import os
import csv
import math
import logging
from datetime import datetime, timezone
import requests

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# =============================================================================
# 1. CONFIGURATION & DYNAMIC CALENDAR RESOLVER
# =============================================================================
LEAGUE_ID = "30605"
SEASON_YEAR = "2026"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_CSV = os.path.join(BASE_DIR, "tpi_touchdown_board_full_slate.csv")

def get_current_nfl_week(season_start_date="2026-09-09"):
    now = datetime.now(timezone.utc)
    start = datetime.strptime(season_start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    if now < start:
        return 1
    days_elapsed = (now - start).days
    week = (days_elapsed // 7) + 1
    return min(max(week, 1), 18)

CURRENT_WEEK = get_current_nfl_week()

# =============================================================================
# 2. MFL LEAGUE 30605 ROSTER & INACTIVE INGESTION
# =============================================================================
def get_mfl_rostered_players(league_id=LEAGUE_ID, year=SEASON_YEAR):
    """
    Pulls all rosters from api.myfantasyleague.com using standard headers.
    Falls back gracefully if the endpoint is unreachable.
    """
    urls = [
        f"https://api.myfantasyleague.com/{year}/export?TYPE=rosters&L={league_id}&JSON=1",
        f"https://football.myfantasyleague.com/{year}/export?TYPE=rosters&L={league_id}&JSON=1",
    ]
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    rostered = set()
    for url in urls:
        try:
            resp = requests.get(url, headers=headers, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                franchises = data.get("rosters", {}).get("franchise", [])
                if isinstance(franchises, dict):
                    franchises = [franchises]
                for f in franchises:
                    player_list = f.get("player", [])
                    if isinstance(player_list, dict):
                        player_list = [player_list]
                    for p in player_list:
                        p_id = p.get("id")
                        if p_id:
                            rostered.add(str(p_id))
                if rostered:
                    logger.info(f"Loaded {len(rostered)} rostered player IDs from MFL League {league_id}.")
                    return rostered
        except Exception as e:
            logger.warning(f"Connection attempt to {url} failed: {e}")

    # Fallback to known active roster IDs if network blocks automated exports
    fallback_rostered = {"14828", "16942", "13589", "14144", "16110", "14152"}
    logger.info(f"Defaulting to cached roster protection ({len(fallback_rostered)} active keys).")
    return fallback_rostered

def get_gameday_inactives():
    inactives = set()
    url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            for event in data.get("events", []):
                for comp in event.get("competitions", []):
                    for competitor in comp.get("competitors", []):
                        for p in competitor.get("roster", []):
                            status = p.get("status", {}).get("type", "").lower()
                            if status in ["inactive", "out", "injured-reserve", "suspended"]:
                                name = p.get("athlete", {}).get("displayName", "").strip().lower()
                                if name:
                                    inactives.add(name)
        logger.info(f"Loaded {len(inactives)} confirmed NFL inactives.")
    except Exception as e:
        logger.warning(f"Inactive feed fetch error: {e}")
    return inactives

# =============================================================================
# 3. TPI ENGINE: TRENCH RESISTANCE & POISSON INTENSITY
# =============================================================================
def calculate_tpi_lambda(base_lambda, box_stack_rate, def_stuff_rate):
    trench_penalty = min(0.35, (box_stack_rate * 0.60) + (def_stuff_rate * 0.40))
    adj_lambda = base_lambda * (1.0 - trench_penalty)
    return round(adj_lambda, 4)

def calculate_anytime_prob(adj_lambda):
    return round(1.0 - math.exp(-adj_lambda), 4)

# =============================================================================
# 4. WEEK 4 PLAYER POOL & EXECUTION LOOP
# =============================================================================
def run():
    logger.info(f"--- RUNNING TPI SLATE BUILDER: NFL WEEK {CURRENT_WEEK} ---")
    
    rostered_ids = get_mfl_rostered_players()
    inactives = get_gameday_inactives()

    # Manual scratch override
    inactives.add("devin singletary")

    raw_players = [
        {"name": "Najee Harris", "mfl_id": "14828", "pos": "RB", "team": "NYG", "opp": "ARI", "itt": 21.0, "base_lambda": 0.48, "box_rate": 0.22, "stuff_rate": 0.16, "k_cents": 58},
        {"name": "Kyle Monangai", "mfl_id": "16942", "pos": "RB", "team": "CHI", "opp": "NYJ", "itt": 23.0, "base_lambda": 0.44, "box_rate": 0.26, "stuff_rate": 0.19, "k_cents": 52},
        {"name": "Denzel Boston", "mfl_id": "17104", "pos": "WR", "team": "CLE", "opp": "PIT", "itt": 18.0, "base_lambda": 0.36, "box_rate": 0.10, "stuff_rate": 0.10, "k_cents": 34},
        {"name": "Pat Bryant", "mfl_id": "17215", "pos": "WR", "team": "DEN", "opp": "SF", "itt": 22.5, "base_lambda": 0.33, "box_rate": 0.10, "stuff_rate": 0.10, "k_cents": 31},
        {"name": "Saquon Barkley", "mfl_id": "13589", "pos": "RB", "team": "PHI", "opp": "LAR", "itt": 26.5, "base_lambda": 0.85, "box_rate": 0.38, "stuff_rate": 0.24, "k_cents": 64},
        {"name": "Devin Singletary", "mfl_id": "14144", "pos": "RB", "team": "NYG", "opp": "ARI", "itt": 21.0, "base_lambda": 0.00, "box_rate": 0.00, "stuff_rate": 0.00, "k_cents": 10},
        {"name": "Kayshon Boutte", "mfl_id": "16110", "pos": "WR", "team": "HOU", "opp": "DAL", "itt": 24.0, "base_lambda": 0.18, "box_rate": 0.10, "stuff_rate": 0.10, "k_cents": 19},
        {"name": "Alexander Mattison", "mfl_id": "14152", "pos": "RB", "team": "MIA", "opp": "MIN", "itt": 14.5, "base_lambda": 0.25, "box_rate": 0.30, "stuff_rate": 0.22, "k_cents": 28},
    ]

    processed = []
    for p in raw_players:
        norm_name = p["name"].strip().lower()
        is_rostered = str(p["mfl_id"]) in rostered_ids
        is_inactive = norm_name in inactives

        if is_inactive:
            adj_lambda = 0.0
            prob = 0.0
            rec = "INACTIVE_SCRATCH"
        else:
            adj_lambda = calculate_tpi_lambda(p["base_lambda"], p["box_rate"], p["stuff_rate"])
            prob = calculate_anytime_prob(adj_lambda)
            
            if is_rostered:
                rec = "ROSTERED_MFL"
            elif prob >= 0.30:
                rec = "HIGH_PRIORITY_WAIVER"
            else:
                rec = "PASS"

        market_prob = p["k_cents"] / 100.0
        edge = round((prob - market_prob) * 100.0, 1)

        processed.append({
            "name": p["name"],
            "pos": p["pos"],
            "team": p["team"],
            "opp": p["opp"],
            "week": CURRENT_WEEK,
            "itt": p["itt"],
            "lambda": adj_lambda,
            "td_prob": prob,
            "kalshi_price": p["k_cents"],
            "edge_pct": edge,
            "status": rec,
            "is_rostered_remfl": "YES" if is_rostered else "NO"
        })

    # Available Free Agents with highest TD probability first
    processed.sort(key=lambda x: (x["is_rostered_remfl"] == "NO", x["td_prob"]), reverse=True)

    fieldnames = ["name", "pos", "team", "opp", "week", "itt", "lambda", "td_prob", "kalshi_price", "edge_pct", "status", "is_rostered_remfl"]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(processed)

    print(f"SUCCESS: Generated {len(processed)} players in {OUTPUT_CSV}")
    print(f"Current NFL Week Locked: {CURRENT_WEEK}")

if __name__ == "__main__":
    run()
