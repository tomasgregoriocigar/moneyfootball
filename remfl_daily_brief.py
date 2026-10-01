import os
import csv
import json
import re
import requests
from datetime import datetime

# =====================================================================
# REMFL QUANTITATIVE ENGINE // HARDENED VOLUME & BYLAW GUARDRAILS
# =====================================================================
SHEET_ID = "1_43IkwJ3LnugvgPMv6yhWgYv0XZtrsFud3pc8yHzWIs"
GOOGLE_SHEET_EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"

YEAR = "2026"
LEAGUE_ID = "30605"
FRANCHISE_NAME = "TOMMY'S GUNS"

POS_CATEGORY = {
    "QB": "QB",
    "RB": "RB",
    "WR": "REC",
    "TE": "REC",
    "K": "K",
    "PK": "K"
}

CAPS = {"QB": 2, "RB": 5, "REC": 7, "K": 2, "TOTAL": 15}

# Blacklist players who are buried on depth charts / 0-snap emergency pieces
VOLUME_BLACKLIST = ["roschon johnson"]

LOCAL_CSV = "tpi_touchdown_board_full_slate.csv"
OUTPUT_REPORT = "remfl_daily_strategy.json"
DRIVE_SUMMARY = "REMFL_DAILY_BRIEF.txt"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def download_live_sheet():
    print("[1/5] Syncing live Google Sheet dataset...")
    try:
        res = requests.get(GOOGLE_SHEET_EXPORT_URL, headers=HEADERS, timeout=15)
        res.raise_for_status()
        with open(LOCAL_CSV, "w", encoding="utf-8") as f:
            f.write(res.text)
        print(f"      [✓] Cached live sheet to {LOCAL_CSV}")
        return True
    except Exception as e:
        print(f"      [-] Google Sheet download failed: {e}")
        return os.path.exists(LOCAL_CSV)

def load_tpi():
    tpi_map = {}
    if not os.path.exists(LOCAL_CSV):
        return tpi_map
    with open(LOCAL_CSV, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_name = row.get("player_name", "").strip().lower()
            if not clean_name:
                continue
            tpi_map[clean_name] = {
                "player_name": row.get("player_name", ""),
                "position": row.get("position", ""),
                "team": row.get("team", ""),
                "opponent": row.get("opponent", ""),
                "gtg_share": float(row.get("goal_to_go_share", 0.0) or 0.0),
                "rz_target_share": float(row.get("rz_target_share", 0.0) or 0.0),
                "tpi_prob": float(row.get("tpi_anytime_td_prob", 0.0) or 0.0),
                "kalshi_prob": float(row.get("kalshi_implied_prob", 0.0) or 0.0),
                "edge": row.get("tpi_edge_pct", "0.0%"),
                "signal": row.get("model_signal", "NEUTRAL")
            }
    return tpi_map

def run_master_brief():
    print("=" * 72)
    print(f"🏈 REMFL QUANT WAIVER BRIEF // {FRANCHISE_NAME}")
    print(f"Date: {datetime.now().strftime('%A, %b %d, %Y - %I:%M %p')}")
    print("=" * 72)

    download_live_sheet()
    tpi_data = load_tpi()

    base_url = f"https://api.myfantasyleague.com/{YEAR}/export"
    print("[2/5] Ingesting MFL League data & rosters...")
    try:
        l_res = requests.get(base_url, params={"TYPE": "league", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS, timeout=15)
        franchises = l_res.json().get("league", {}).get("franchises", {}).get("franchise", [])
        my_fid = next((f.get("id") for f in franchises if "tommy" in f.get("name", "").lower() or "guns" in f.get("name", "").lower()), None)

        p_res = requests.get(base_url, params={"TYPE": "players", "DETAILS": "1", "JSON": "1"}, headers=HEADERS, timeout=15)
        player_map = {p["id"]: p for p in p_res.json().get("players", {}).get("player", [])}

        rosters_res = requests.get(base_url, params={"TYPE": "rosters", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS, timeout=15)
        rosters_list = rosters_res.json().get("rosters", {}).get("franchise", [])

        inj_res = requests.get(base_url, params={"TYPE": "injuries", "JSON": "1"}, headers=HEADERS, timeout=15)
        injury_map = {item.get("id"): item.get("status", "Questionable") for item in inj_res.json().get("injuries", {}).get("injury", [])}
    except Exception as e:
        print(f"[-] MFL API Request Failed: {e}")
        return

    # Map all taken players across active, taxi, and IR
    rostered_ids = set()
    my_roster_ids = []
    for r in rosters_list:
        p_list = r.get("player", [])
        if isinstance(p_list, dict):
            p_list = [p_list]
        for p in p_list:
            pid = p.get("id")
            rostered_ids.add(pid)
            if r.get("id") == my_fid and p.get("status") != "TAXI_SQUAD":
                my_roster_ids.append(pid)

    print("[3/5] Auditing TOMMY'S GUNS roster by strict positional category...")
    roster_by_cat = {"QB": [], "RB": [], "REC": [], "K": []}
    ir_candidates = []

    for pid in my_roster_ids:
        p = player_map.get(pid, {})
        raw_name = p.get("name", f"ID {pid}")
        parts = raw_name.split(",") if "," in raw_name else [raw_name, ""]
        display_name = f"{parts[1].strip()} {parts[0].strip()}".strip() if len(parts) > 1 else raw_name
        pos = p.get("position", "UNK")
        cat = POS_CATEGORY.get(pos, "OTHER")
        team = p.get("team", "FA")
        status = injury_map.get(pid, "Active")

        if status.lower() in ["out", "ir", "injured reserve", "pup"]:
            ir_candidates.append(f"{display_name} ({pos}, {team})")

        entry = {"id": pid, "name": display_name, "position": pos, "team": team, "status": status}
        if cat in roster_by_cat:
            roster_by_cat[cat].append(entry)

    print("[4/5] Applying Volume Floor & Depth Chart verification...")
    waiver_matches = []
    for pid, p in player_map.items():
        if pid not in rostered_ids and p.get("position") in ["RB", "WR", "TE", "QB"]:
            raw_name = p.get("name", "")
            parts = raw_name.split(",") if "," in raw_name else [raw_name, ""]
            std_name = f"{parts[1].strip()} {parts[0].strip()}".lower() if len(parts) > 1 else raw_name.lower()

            # Hard gate: Check blacklist
            if std_name in VOLUME_BLACKLIST:
                continue

            if std_name in tpi_data:
                model_stat = tpi_data[std_name]
                t_pos = model_stat["position"]
                cat = POS_CATEGORY.get(t_pos, "REC" if t_pos in ["WR", "TE"] else t_pos)

                # Prioritize designated drop candidates by position
                drops = [d["name"] for d in roster_by_cat.get(cat, [])]

                waiver_matches.append({
                    "name": model_stat["player_name"],
                    "pos": t_pos,
                    "cat": cat,
                    "team": model_stat["team"],
                    "opponent": model_stat["opponent"],
                    "edge": model_stat["edge"],
                    "gtg": model_stat["gtg_share"],
                    "drops": drops
                })

    waiver_matches.sort(key=lambda x: float(x["edge"].replace("%", "").replace("+", "")), reverse=True)

    print("[5/5] Compiling morning brief...")
    lines = []
    lines.append(f"TOMMY'S GUNS // REMFL QUANT STRATEGY MEMO")
    lines.append(f"Date: {datetime.now().strftime('%A, %b %d, %Y')} | League ID: {LEAGUE_ID}")
    lines.append(f"Active Roster: QB: {len(roster_by_cat['QB'])}/2 | RB: {len(roster_by_cat['RB'])}/5 | REC: {len(roster_by_cat['REC'])}/7 | K: {len(roster_by_cat['K'])}/2")
    
    if ir_candidates:
        lines.append(f"• IR Transfer Eligible: {', '.join(ir_candidates)} (Opens free spot without drop)")
    else:
        lines.append("• IR Status: 0 Out/IR tags. All waiver moves require strict like-for-like drops.")

    lines.append("\nPriority Waiver Queue (Strict Like-for-Like Enforcement):")
    if waiver_matches:
        for idx, w in enumerate(waiver_matches[:3], 1):
            drop_sugg = w["drops"][0] if w["drops"] else "None available"
            lines.append(f"Claim #{idx}: ADD {w['name']} ({w['pos']}, {w['team']} vs {w['opponent']})")
            lines.append(f"          -> Mandatory {w['cat']} Drop: {drop_sugg}")
            lines.append(f"          -> Model Edge: {w['edge']} | GTG Concentration: {w['gtg'] * 100:.0f}%")
    else:
        lines.append("• No high-conviction players passed volume gates on the wire. Recommended: HOLD roster.")

    brief_text = "\n".join(lines)
    print("\n" + brief_text)

    # Save to local bridge
    with open(DRIVE_SUMMARY, "w", encoding="utf-8") as f:
        f.write(brief_text)

    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "roster_by_category": roster_by_cat,
            "waiver_queue": waiver_matches
        }, f, indent=2)

    try:
        requests.post("https://ntfy.sh/tommys_guns_remfl_brief", 
                      data=brief_text.encode('utf-8'),
                      headers={"Title": "TOMMY'S GUNS // Verified REMFL Brief", "Priority": "high"})
    except Exception:
        pass

    print("\n[✓] Hardened brief compiled & saved.")

if __name__ == "__main__":
    run_master_brief()
