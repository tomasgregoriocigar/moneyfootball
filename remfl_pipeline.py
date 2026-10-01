#!/usr/bin/env python3
"""
REMFL Money Football Pipeline (TPI-v4.2)
Multi-Zone Distance Decay Model (<3, 5, 10, 20) with Exact Column Output.
"""

import os
import json
import csv
import math

# -------------------------------------------------------------
# 1. Pro Club Mappings & Positional Overrides
# -------------------------------------------------------------
NFL_ROSTER_OVERRIDES = {
    "Jonah Coleman": {
        "team": "DEN",
        "pos": "RB",
        "share_3": 0.05,
        "share_5": 0.05,
        "share_10": 0.08,
        "share_20": 0.10,
        "under_center_rate": 0.50,
        "has_rushing_qb": False,
    },
    "Jaydon Blue": {
        "team": "DAL",
        "pos": "RB",
        "share_3": 0.30,
        "share_5": 0.28,
        "share_10": 0.25,
        "share_20": 0.20,
        "under_center_rate": 0.50,
        "has_rushing_qb": False,
    },
    "Elic Ayomanor": {
        "team": "TEN",
        "pos": "WR",
        "share_3": 0.12,
        "share_5": 0.15,
        "share_10": 0.20,
        "share_20": 0.22,
        "under_center_rate": 0.45,
        "has_rushing_qb": False,
    },
    "Zachariah Branch": {
        "team": "ATL",
        "pos": "WR",
        "share_3": 0.15,
        "share_5": 0.18,
        "share_10": 0.22,
        "share_20": 0.25,
        "under_center_rate": 0.50,
        "has_rushing_qb": False,
    },
}

# -------------------------------------------------------------
# 2. Week 4 NFL Slate Schedules & Vegas Implied Team Totals
# -------------------------------------------------------------
WEEK_4_ODDS = {
    "BAL": {"opponent": "vs. TEN", "itt": 27.50},
    "KC":  {"opponent": "@ LV",    "itt": 26.50},
    "IND": {"opponent": "@ WAS",   "itt": 25.50},
    "DET": {"opponent": "@ CAR",   "itt": 27.00},
    "CIN": {"opponent": "vs. JAX", "itt": 27.00},
    "BUF": {"opponent": "vs. NE",  "itt": 27.50},
    "PHI": {"opponent": "vs. LAR", "itt": 26.50},
    "SF":  {"opponent": "vs. DEN", "itt": 24.50},
    "MIN": {"opponent": "vs. MIA", "itt": 24.75},
    "LAC": {"opponent": "@ SEA",   "itt": 22.50},
    "DAL": {"opponent": "@ HOU",   "itt": 23.50},
    "ATL": {"opponent": "@ NO",    "itt": 22.50},
    "DEN": {"opponent": "@ SF",    "itt": 21.00},
    "TEN": {"opponent": "@ BAL",   "itt": 18.25},
    "MIA": {"opponent": "@ MIN",   "itt": 14.25},
    "CAR": {"opponent": "vs. DET", "itt": 17.50},
    "NE":  {"opponent": "@ BUF",   "itt": 17.00},
    "WAS": {"opponent": "vs. IND", "itt": 24.00},
    "LAR": {"opponent": "@ PHI",   "itt": 22.00},
    "SEA": {"opponent": "vs. LAC", "itt": 21.00},
    "LV":  {"opponent": "vs. KC",  "itt": 20.00},
    "JAX": {"opponent": "@ CIN",   "itt": 22.50},
}

# -------------------------------------------------------------
# 3. Active Slate Player Pool
# -------------------------------------------------------------
RAW_SLATE_PLAYERS = [
    # Benchmark heavy hitters
    {
        "player": "Derrick Henry",
        "pos": "RB",
        "team": "BAL",
        "share_3": 0.88,
        "share_5": 0.80,
        "share_10": 0.65,
        "share_20": 0.45,
        "under_center_rate": 0.72,
        "has_rushing_qb": False,
    },
    {
        "player": "Kyren Williams",
        "pos": "RB",
        "team": "LAR",
        "share_3": 0.82,
        "share_5": 0.75,
        "share_10": 0.55,
        "share_20": 0.40,
        "under_center_rate": 0.65,
        "has_rushing_qb": False,
    },
    # Tommy's Guns Active & Pipeline Roster
    {
        "player": "J.K. Dobbins",
        "pos": "RB",
        "team": "DEN",
        "share_3": 0.78,
        "share_5": 0.70,
        "share_10": 0.50,
        "share_20": 0.35,
        "under_center_rate": 0.68,
        "has_rushing_qb": False,
    },
    {
        "player": "George Kittle",
        "pos": "TE",
        "team": "SF",
        "share_3": 0.32,
        "share_5": 0.35,
        "share_10": 0.30,
        "share_20": 0.26,
        "under_center_rate": 0.60,
        "has_rushing_qb": False,
    },
    {
        "player": "Jordan Addison",
        "pos": "WR",
        "team": "MIN",
        "share_3": 0.18,
        "share_5": 0.22,
        "share_10": 0.25,
        "share_20": 0.24,
        "under_center_rate": 0.50,
        "has_rushing_qb": False,
    },
    {
        "player": "Josh Downs",
        "pos": "WR",
        "team": "IND",
        "share_3": 0.14,
        "share_5": 0.18,
        "share_10": 0.22,
        "share_20": 0.25,
        "under_center_rate": 0.45,
        "has_rushing_qb": False,
    },
    {
        "player": "Samaje Perine",
        "pos": "RB",
        "team": "KC",
        "share_3": 0.15,
        "share_5": 0.20,
        "share_10": 0.18,
        "share_20": 0.15,
        "under_center_rate": 0.40,
        "has_rushing_qb": False,
    },
    {
        "player": "Alexander Mattison",
        "pos": "RB",
        "team": "MIA",
        "share_3": 0.32,
        "share_5": 0.30,
        "share_10": 0.25,
        "share_20": 0.20,
        "under_center_rate": 0.40,
        "has_rushing_qb": False,
    },
    {
        "player": "Kayshon Boutte",
        "pos": "WR",
        "team": "NE",
        "share_3": 0.08,
        "share_5": 0.10,
        "share_10": 0.15,
        "share_20": 0.14,
        "under_center_rate": 0.40,
        "has_rushing_qb": False,
    },
    # Overrides (Coleman, Blue, Ayomanor, Branch)
    {"player": "Jonah Coleman", "pos": "RB", "team": "DEN"},
    {"player": "Jaydon Blue", "pos": "RB", "team": "DAL"},
    {"player": "Elic Ayomanor", "pos": "WR", "team": "TEN"},
    {"player": "Zachariah Branch", "pos": "WR", "team": "ATL"},
]

# -------------------------------------------------------------
# 4. Multi-Zone Conversion Engine
# -------------------------------------------------------------
ZONE_CONVERSION_RATES = {
    "3":  {"rush": 0.54, "target": 0.47},
    "5":  {"rush": 0.28, "target": 0.24},
    "10": {"rush": 0.14, "target": 0.18},
    "20": {"rush": 0.06, "target": 0.09},
}

def calculate_zone_decay_tpi(player: dict, vegas_itt: float) -> dict:
    base_rz_drives = vegas_itt / 6.5

    trips_3  = base_rz_drives * 0.42
    trips_5  = base_rz_drives * 0.25
    trips_10 = base_rz_drives * 0.22
    trips_20 = base_rz_drives * 0.15

    is_receiver = player.get("pos") in ["WR", "TE"]
    mode = "target" if is_receiver else "rush"

    s_3  = float(player.get("share_3", 0.0))
    s_5  = float(player.get("share_5", 0.0))
    s_10 = float(player.get("share_10", 0.0))
    s_20 = float(player.get("share_20", 0.0))

    xtd_3  = trips_3  * s_3  * ZONE_CONVERSION_RATES["3"][mode]
    xtd_5  = trips_5  * s_5  * ZONE_CONVERSION_RATES["5"][mode]
    xtd_10 = trips_10 * s_10 * ZONE_CONVERSION_RATES["10"][mode]
    xtd_20 = trips_20 * s_20 * ZONE_CONVERSION_RATES["20"][mode]

    total_xtd = xtd_3 + xtd_5 + xtd_10 + xtd_20

    if player.get("has_rushing_qb", False) and not is_receiver:
        total_xtd *= 0.65
        xtd_3 *= 0.60

    prob_3  = round((1.0 - math.exp(-xtd_3)) * 100, 1)
    prob_5  = round((1.0 - math.exp(-xtd_5)) * 100, 1)
    prob_10 = round((1.0 - math.exp(-xtd_10)) * 100, 1)
    prob_20 = round((1.0 - math.exp(-xtd_20)) * 100, 1)
    total_td_prob = round((1.0 - math.exp(-total_xtd)) * 100, 1)

    if total_td_prob >= 80.0 and s_3 >= 0.75 and vegas_itt >= 24.0:
        tier = "TIER 1 (85%+ CONVICTION)"
    elif total_td_prob >= 50.0:
        tier = "TIER 2 (STARTABLE)"
    elif total_td_prob >= 30.0:
        tier = "TIER 3 (FLEX / LEAN)"
    else:
        tier = "TIER 4 (PASS)"

    return {
        "prob_3": f"{prob_3}%",
        "prob_5": f"{prob_5}%",
        "prob_10": f"{prob_10}%",
        "prob_20": f"{prob_20}%",
        "total_td": f"{total_td_prob}%",
        "total_td_val": total_td_prob,
        "tier": tier,
    }

# -------------------------------------------------------------
# 5. Execution & Data Writing
# -------------------------------------------------------------
def run_pipeline():
    print("[*] Running REMFL Pipeline with 4-Zone Distance Decay Model...")
    processed = []

    for raw in RAW_SLATE_PLAYERS:
        name = raw["player"]
        player = raw.copy()

        if name in NFL_ROSTER_OVERRIDES:
            override = NFL_ROSTER_OVERRIDES[name]
            for k, v in override.items():
                player[k] = v

        team = player.get("team", "NFL")
        matchup = WEEK_4_ODDS.get(team, {"opponent": "TBD", "itt": 20.0})
        player["opponent"] = matchup["opponent"]
        player["vegas_itt"] = matchup["itt"]

        zone_results = calculate_zone_decay_tpi(player, player["vegas_itt"])
        player["3_yrd_line"] = zone_results["prob_3"]
        player["5_yrd_line"] = zone_results["prob_5"]
        player["10_yard_line"] = zone_results["prob_10"]
        player["20_yard_line"] = zone_results["prob_20"]
        player["total_td"] = zone_results["total_td"]
        player["total_td_val"] = zone_results["total_td_val"]
        player["tier"] = zone_results["tier"]

        processed.append(player)

    processed.sort(key=lambda x: x["total_td_val"], reverse=True)
    for idx, p in enumerate(processed):
        p["rank"] = idx + 1

    csv_headers = [
        "Rank",
        "Player",
        "Pos",
        "Team",
        "Opponent",
        "Vegas ITT",
        "3 Yrd line",
        "5 yrd line",
        "10 yard line",
        "20 yard line",
        "Total TD",
        "Tier",
    ]

    os.makedirs("public/data", exist_ok=True)
    csv_paths = ["tpi_touchdown_board_full_slate.csv", "public/data/tpi_touchdown_board_full_slate.csv"]

    for path in csv_paths:
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=csv_headers)
            writer.writeheader()
            for p in processed:
                writer.writerow({
                    "Rank": p["rank"],
                    "Player": p["player"],
                    "Pos": p["pos"],
                    "Team": p["team"],
                    "Opponent": p["opponent"],
                    "Vegas ITT": f"{p['vegas_itt']:.2f}",
                    "3 Yrd line": p["3_yrd_line"],
                    "5 yrd line": p["5_yrd_line"],
                    "10 yard line": p["10_yard_line"],
                    "20 yard line": p["20_yard_line"],
                    "Total TD": p["total_td"],
                    "Tier": p["tier"],
                })

    json_paths = ["remfl_waiver_board.json", "public/data/remfl_waiver_board.json"]
    for path in json_paths:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(processed, f, indent=2)

    print(f"[✓] Processed {len(processed)} players with 4-zone probability decay.")
    print("[✓] Saved with columns: 3 Yrd line | 5 yrd line | 10 yard line | 20 yard line | Total TD")

if __name__ == "__main__":
    run_pipeline()