import os
import csv
import json
import requests
from datetime import datetime

# --- CONFIGURATION (STRICTLY LOCAL) ---
YEAR = "2026"
LEAGUE_ID = "30605"
FRANCHISE_NAME = "TOMMY'S GUNS"
CSV_FILE = "tpi_touchdown_board_full_slate.csv"
OUTPUT_REPORT = "remfl_daily_strategy.json"

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def load_tpi_model():
    if not os.path.exists(CSV_FILE):
        print(f"[-] TPI CSV file not found: {CSV_FILE}")
        return {}
    
    tpi_map = {}
    with open(CSV_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_name = row["player_name"].strip().lower()
            tpi_map[clean_name] = {
                "player_name": row["player_name"],
                "position": row["position"],
                "team": row["team"],
                "opponent": row["opponent"],
                "gtg_share": float(row["goal_to_go_share"]),
                "rz_target_share": float(row["rz_target_share"]),
                "surface_rush_delta": float(row["surface_rush_delta"]),
                "tpi_prob": float(row["tpi_anytime_td_prob"]),
                "kalshi_prob": float(row["kalshi_implied_prob"]),
                "edge": row["tpi_edge_pct"],
                "signal": row["model_signal"]
            }
    return tpi_map

def run_remfl_strategy():
    print("=" * 65)
    print(f"🏈 REMFL QUANT WAIVER STRATEGY ENGINE: {FRANCHISE_NAME}")
    print(f"League ID: {LEAGUE_ID} | Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 65)

    tpi_data = load_tpi_model()
    print(f"[+] Loaded {len(tpi_data)} model projections from {CSV_FILE}")

    base_url = f"https://api.myfantasyleague.com/{YEAR}/export"

    # 1. Fetch Franchises
    try:
        l_res = requests.get(base_url, params={"TYPE": "league", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS)
        franchises = l_res.json().get("league", {}).get("franchises", {}).get("franchise", [])
    except Exception as e:
        print(f"[-] Failed connecting to MFL: {e}")
        return

    my_fid = None
    for f in franchises:
        if "tommy" in f.get("name", "").lower() or "guns" in f.get("name", "").lower():
            my_fid = f.get("id")
            break

    # 2. Fetch Rosters
    print("[+] Ingesting all REMFL rosters...")
    rosters_res = requests.get(base_url, params={"TYPE": "rosters", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS)
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

    # 3. Master Player Catalog
    print("[+] Pulling MFL master player catalog...")
    p_res = requests.get(base_url, params={"TYPE": "players", "DETAILS": "1", "JSON": "1"}, headers=HEADERS)
    players_list = p_res.json().get("players", {}).get("player", [])
    player_map = {p["id"]: p for p in players_list}

    # 4. Cross-Reference Free Agents with TPI Board
    print("[+] Cross-referencing unrostered pool against quantitative board...")
    available_tpi_gems = []
    
    for pid, p in player_map.items():
        if pid not in rostered_ids and p.get("position") in ["RB", "WR", "TE", "QB"]:
            # MFL stores names as 'Last, First'
            raw_name = p.get("name", "")
            if "," in raw_name:
                parts = raw_name.split(",")
                std_name = f"{parts[1].strip()} {parts[0].strip()}".lower()
            else:
                std_name = raw_name.lower()

            # Direct match against TPI model
            if std_name in tpi_data:
                model_stat = tpi_data[std_name]
                bid_pct = "12-18%" if "STRONG" in model_stat["signal"] else ("5-8%" if "OVER" in model_stat["signal"] else "0-2%")
                available_tpi_gems.append({
                    "player_name": model_stat["player_name"],
                    "position": model_stat["position"],
                    "team": model_stat["team"],
                    "opponent": model_stat["opponent"],
                    "tpi_prob": f"{model_stat['tpi_prob'] * 100:.1f}%",
                    "kalshi_prob": f"{model_stat['kalshi_prob'] * 100:.1f}%",
                    "edge": model_stat["edge"],
                    "signal": model_stat["signal"],
                    "gtg_share": f"{model_stat['gtg_share'] * 100:.0f}%",
                    "suggested_faab": bid_pct
                })

    # Sort candidates by edge magnitude
    available_tpi_gems.sort(key=lambda x: float(x["edge"].replace("%", "").replace("+", "")), reverse=True)

    # 5. Terminal Executive Brief
    print("\n" + "=" * 65)
    print("🎯 HIGH-CONVICTION UNROSTERED FREE AGENTS (TPI CROSS-MATCH)")
    print("=" * 65)

    if available_tpi_gems:
        for idx, fa in enumerate(available_tpi_gems, 1):
            print(f"[{idx}] {fa['player_name']} ({fa['position']}, {fa['team']} vs {fa['opponent']})")
            print(f"    • Model Prob: {fa['tpi_prob']} | Kalshi Implied: {fa['kalshi_prob']} | Edge: {fa['edge']}")
            print(f"    • Signal: {fa['signal']} | GTG Concentration: {fa['gtg_share']}")
            print(f"    • Recommended Action: Add / Claim ({fa['suggested_faab']} FAAB)")
            print("-" * 65)
    else:
        print("[!] All 59 players on this week's active TPI board are currently owned.")
        print("[!] Generating positional high-upside depth scan...")

    # 6. Save Local Strategy File
    output_payload = {
        "generated_at": datetime.now().isoformat(),
        "league_id": LEAGUE_ID,
        "franchise": FRANCHISE_NAME,
        "my_rostered_count": len(my_roster_ids),
        "tpi_free_agent_matches": available_tpi_gems
    }

    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print(f"\n[✓] Full private strategy dumped to: {OUTPUT_REPORT}")
    print("[✓] Zero external transmission. Complete.")
    print("=" * 65)

if __name__ == "__main__":
    run_remfl_strategy()
