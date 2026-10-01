import os
import csv
import json
import re
import requests
from datetime import datetime

# ==========================================
# 1. CONFIGURATION
# ==========================================
SHEET_ID = "1_43IkwJ3LnugvgPMv6yhWgYv0XZtrsFud3pc8yHzWIs"
GOOGLE_SHEET_EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"

YEAR = "2026"
LEAGUE_ID = "30605"
FRANCHISE_NAME = "TOMMY'S GUNS"
LOCAL_CSV = "tpi_touchdown_board_full_slate.csv"
OUTPUT_REPORT = "remfl_daily_strategy.json"

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def download_live_sheet():
    print(f"[+] Syncing live Google Sheet (ID: {SHEET_ID})...")
    try:
        res = requests.get(GOOGLE_SHEET_EXPORT_URL, headers=HEADERS, timeout=15)
        res.raise_for_status()
        with open(LOCAL_CSV, "w", encoding="utf-8") as f:
            f.write(res.text)
        print(f"[✓] Fresh dataset synced to local disk: {LOCAL_CSV}")
        return True
    except Exception as e:
        print(f"[-] Google Sheet download failed: {e}")
        if os.path.exists(LOCAL_CSV):
            print("[!] Falling back to cached local CSV.")
            return True
        return False

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

def run_pipeline():
    print("=" * 65)
    print(f"🏈 REMFL QUANT ENGINE // DAILY GOOGLE SHEET SYNC")
    print(f"Franchise: {FRANCHISE_NAME} | League ID: {LEAGUE_ID}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 65)

    # 1. Fetch live Google Sheet
    download_live_sheet()
    tpi_data = load_tpi()
    print(f"[+] Loaded {len(tpi_data)} projections into quantitative board.")

    # 2. Ingest REMFL MyFantasyLeague Data
    base_url = f"https://api.myfantasyleague.com/{YEAR}/export"
    try:
        l_res = requests.get(base_url, params={"TYPE": "league", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS, timeout=15)
        franchises = l_res.json().get("league", {}).get("franchises", {}).get("franchise", [])
    except Exception as e:
        print(f"[-] MFL Connection Error: {e}")
        return

    my_fid = None
    for f in franchises:
        if "tommy" in f.get("name", "").lower() or "guns" in f.get("name", "").lower():
            my_fid = f.get("id")
            break

    # 3. Pull Rosters & Player Catalog
    rosters_res = requests.get(base_url, params={"TYPE": "rosters", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS, timeout=15)
    rosters_list = rosters_res.json().get("rosters", {}).get("franchise", [])
    
    rostered_ids = set()
    my_roster_ids = []
    for r in rosters_list:
        p_list = r.get("player", [])
        if isinstance(p_list, dict):
            p_list = [p_list]
        for p in p_list:
            pid = p.get("id")
            rostered_ids.add(pid)
            if r.get("id") == my_fid:
                my_roster_ids.append(pid)

    p_res = requests.get(base_url, params={"TYPE": "players", "DETAILS": "1", "JSON": "1"}, headers=HEADERS, timeout=15)
    players_list = p_res.json().get("players", {}).get("player", [])
    player_map = {p["id"]: p for p in players_list}

    # 4. Cross-Reference Free Agents against TPI Sheet
    free_agents_with_edge = []
    for pid, p in player_map.items():
        if pid not in rostered_ids and p.get("position") in ["RB", "WR", "TE", "QB"]:
            raw_name = p.get("name", "")
            if "," in raw_name:
                parts = raw_name.split(",")
                std_name = f"{parts[1].strip()} {parts[0].strip()}".lower()
            else:
                std_name = raw_name.lower()

            if std_name in tpi_data:
                model_stat = tpi_data[std_name]
                bid = "12-18%" if "STRONG" in model_stat["signal"] else ("5-8%" if "OVER" in model_stat["signal"] else "0-2%")
                free_agents_with_edge.append({
                    "player_name": model_stat["player_name"],
                    "position": model_stat["position"],
                    "team": model_stat["team"],
                    "opponent": model_stat["opponent"],
                    "tpi_prob": f"{model_stat['tpi_prob'] * 100:.1f}%",
                    "kalshi_prob": f"{model_stat['kalshi_prob'] * 100:.1f}%",
                    "edge": model_stat["edge"],
                    "signal": model_stat["signal"],
                    "gtg_share": f"{model_stat['gtg_share'] * 100:.0f}%",
                    "suggested_faab": bid
                })

    free_agents_with_edge.sort(key=lambda x: float(x["edge"].replace("%", "").replace("+", "")), reverse=True)

    # 5. Output Local Analysis
    print("\n" + "=" * 65)
    print("🎯 DAILY REMFL WAIVER BOARD (MODEL EDGES FROM GOOGLE SHEET)")
    print("=" * 65)
    if free_agents_with_edge:
        for idx, fa in enumerate(free_agents_with_edge, 1):
            print(f"[{idx}] {fa['player_name']} ({fa['position']}, {fa['team']} vs {fa['opponent']})")
            print(f"    • Model Prob: {fa['tpi_prob']} | Kalshi Implied: {fa['kalshi_prob']} | Edge: {fa['edge']}")
            print(f"    • Signal: {fa['signal']} | GTG Concentration: {fa['gtg_share']}")
            print(f"    • Action: Add / Claim ({fa['suggested_faab']} FAAB)")
            print("-" * 65)
    else:
        print("[!] No active TPI targets currently unowned on the REMFL wire.")

    # 6. Save Private JSON
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "league_id": LEAGUE_ID,
            "franchise": FRANCHISE_NAME,
            "targets": free_agents_with_edge
        }, f, indent=2)

    print(f"\n[✓] Local report saved to: {OUTPUT_REPORT}")
    print("[✓] Zero external transmission. Complete.")
    print("=" * 65)

if __name__ == "__main__":
    run_pipeline()
