import requests
import json
from datetime import datetime

# --- CONFIGURATION (LOCAL ONLY) ---
YEAR = "2026"
LEAGUE_ID = "30605"
FRANCHISE_NAME = "TOMMY'S GUNS"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def fetch_and_audit():
    base_url = f"https://api.myfantasyleague.com/{YEAR}/export"
    print("=" * 60)
    print(f"🔒 REMFL PRIVATE AUDIT: {FRANCHISE_NAME} (League ID: {LEAGUE_ID})")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # 1. Fetch Franchises
    try:
        l_res = requests.get(base_url, params={"TYPE": "league", "L": LEAGUE_ID, "JSON": "1"}, headers=HEADERS)
        franchises = l_res.json().get("league", {}).get("franchises", {}).get("franchise", [])
    except Exception as e:
        print(f"[-] MFL API Error: {e}")
        return

    my_fid = None
    for f in franchises:
        if "tommy" in f.get("name", "").lower() or "guns" in f.get("name", "").lower():
            my_fid = f.get("id")
            break

    # 2. Fetch Rosters
    print("[+] Ingesting league rosters...")
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
    print("[+] Fetching master player pool and availability...")
    p_res = requests.get(base_url, params={"TYPE": "players", "DETAILS": "1", "JSON": "1"}, headers=HEADERS)
    players_list = p_res.json().get("players", {}).get("player", [])
    player_map = {p["id"]: p for p in players_list}

    # 4. Filter Free Agents
    free_agents = [p for pid, p in player_map.items() if pid not in rostered_ids and p.get("position") in ["RB", "WR", "TE", "QB"]]

    # 5. Output Local Analysis
    print("\n" + "=" * 60)
    print("📊 CURRENT ROSTER OVERVIEW (TOMMY'S GUNS)")
    print("=" * 60)
    print(f"Total Rostered Contracts: {len(my_roster_ids)}")
    my_players_by_pos = {}
    for pid in my_roster_ids:
        p = player_map.get(pid, {"name": f"ID {pid}", "position": "UNK", "team": "UNK"})
        pos = p.get("position", "UNK")
        my_players_by_pos.setdefault(pos, []).append(f"{p.get('name')} ({p.get('team')})")
    
    for pos, p_names in sorted(my_players_by_pos.items()):
        print(f"• {pos}: {', '.join(p_names)}")

    print("\n" + "=" * 60)
    print("🎯 AVAILABLE FREE AGENT TARGETS (TOP DEPTH)")
    print("=" * 60)
    audit_export = {
        "timestamp": datetime.now().isoformat(),
        "my_roster": [player_map.get(pid) for pid in my_roster_ids if pid in player_map],
        "available_by_pos": {}
    }
    
    for pos in ["RB", "WR", "TE", "QB"]:
        top = [p for p in free_agents if p.get("position") == pos][:8]
        top_names = [f"{p.get('name')} ({p.get('team')})" for p in top]
        audit_export["available_by_pos"][pos] = top
        print(f"• {pos} Pool:")
        for name in top_names:
            print(f"    - {name}")

    # 6. Save Local Data File for Offline / Python Inspection
    local_file = "remfl_waiver_board.json"
    with open(local_file, "w", encoding="utf-8") as f:
        json.dump(audit_export, f, indent=2)
    print("\n" + "=" * 60)
    print(f"[✓] Local dataset cached to: {local_file}")
    print("[✓] Zero external data pushed. Local execution complete.")
    print("=" * 60)

if __name__ == "__main__":
    fetch_and_audit()
