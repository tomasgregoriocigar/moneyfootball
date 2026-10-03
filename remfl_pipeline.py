#!/usr/bin/env python3
"""
REMFL Money Football Pipeline (TPI-v4.3 Dual-Engine)
- RB Engine: 4-Zone Distance Decay (<3, 5, 10, 20) with Under-Center & QB Vulture Gates.
- Receiver Alpha Engine: End-Zone Target Share (EZTS) + Explosive Air Yards Conversion.
- Strict League 30605 Roster Exclusion Filter.
"""

import os
import json
import csv
import math

# -------------------------------------------------------------
# 1. League 30605 Master Rostered Filter (Prevents False FA Calls)
# -------------------------------------------------------------
REMFL_ROSTERED_PLAYERS = {
    # Competitor Rosters (Explicitly Blocked from Wire)
    "Ray Davis", "Blake Corum", "Bucky Irving", "Braelon Allen",
    "Jordan Mason", "Zach Charbonnet", "Tyler Allgeier", "Chuba Hubbard",
    "Derrick Henry", "Kyren Williams", "De'Von Achane",
    # Tommy's Guns Active & Stash
    "J.K. Dobbins", "Jaydon Blue", "Samaje Perine", "Alexander Mattison",
    "Jonah Coleman", "George Kittle", "Jordan Addison", "Josh Downs",
    "Keenan Allen", "Zachariah Branch", "Elic Ayomanor"
}

# -------------------------------------------------------------
# 2. Positional Overrides & Player Configs
# -------------------------------------------------------------
NFL_ROSTER_OVERRIDES = {
    "Jonah Coleman": {
        "team": "DEN", "pos": "RB",
        "share_3": 0.05, "share_5": 0.05, "share_10": 0.08, "share_20": 0.10,
        "under_center_rate": 0.50, "has_rushing_qb": False,
    },
    "Jaydon Blue": {
        "team": "DAL", "pos": "RB",
        "share_3": 0.30, "share_5": 0.28, "share_10": 0.25, "share_20": 0.20,
        "under_center_rate": 0.50, "has_rushing_qb": False,
    },
    "Elic Ayomanor": {
        "team": "TEN", "pos": "WR",
        "ez_target_share": 0.20, "air_yards_share": 0.22,
        "explosive_rate": 0.14, "pass_funnel_rate": 0.50,
    },
    "Zachariah Branch": {
        "team": "ATL", "pos": "WR",
        "ez_target_share": 0.22, "air_yards_share": 0.24,
        "explosive_rate": 0.18, "pass_funnel_rate": 0.52,
    },
    # Unowned Wire Targets
    "Pat Bryant": {
        "team": "DEN", "pos": "WR",
        "ez_target_share": 0.30, "air_yards_share": 0.26,
        "explosive_rate": 0.20, "pass_funnel_rate": 0.54,
    },
    "Dontayvion Wicks": {
        "team": "GB", "pos": "WR",
        "ez_target_share": 0.28, "air_yards_share": 0.28,
        "explosive_rate": 0.22, "pass_funnel_rate": 0.55,
    },
}

# -------------------------------------------------------------
# 3. Week 4 Slate Matchup Data & Vegas ITTs
# -------------------------------------------------------------
WEEK_4_ODDS = {
    "BAL": {"opponent": "vs. TEN", "itt": 27.50, "pass_td_exp": 1.40},
    "CIN": {"opponent": "vs. JAX", "itt": 27.00, "pass_td_exp": 2.50},
    "BUF": {"opponent": "vs. NE",  "itt": 27.75, "pass_td_exp": 2.20},
    "KC":  {"opponent": "@ LV",    "itt": 26.50, "pass_td_exp": 2.30},
    "IND": {"opponent": "@ WAS",   "itt": 26.00, "pass_td_exp": 2.10},
    "SF":  {"opponent": "vs. DEN", "itt": 24.50, "pass_td_exp": 1.90},
    "MIN": {"opponent": "vs. MIA", "itt": 24.75, "pass_td_exp": 2.10},
    "DAL": {"opponent": "@ HOU",   "itt": 23.50, "pass_td_exp": 1.95},
    "LAR": {"opponent": "@ PHI",   "itt": 23.25, "pass_td_exp": 1.80},
    "ATL": {"opponent": "@ NO",    "itt": 22.50, "pass_td_exp": 1.70},
    "GB":  {"opponent": "@ TB",    "itt": 21.50, "pass_td_exp": 1.80},
    "DEN": {"opponent": "@ SF",    "itt": 21.00, "pass_td_exp": 1.40},
    "TEN": {"opponent": "@ BAL",   "itt": 18.25, "pass_td_exp": 1.10},
    "NE":  {"opponent": "@ BUF",   "itt": 17.00, "pass_td_exp": 0.95},
    "MIA": {"opponent": "@ MIN",   "itt": 14.00, "pass_td_exp": 0.80},
}

# -------------------------------------------------------------
# 4. Player Evaluation Pool
# -------------------------------------------------------------
RAW_SLATE_PLAYERS = [
    # Institutional Tier 1 Benchmarks
    {"player": "Derrick Henry", "pos": "RB", "team": "BAL", "share_3": 0.88, "share_5": 0.80, "share_10": 0.65, "share_20": 0.45, "under_center_rate": 0.72, "has_rushing_qb": False},
    {"player": "Ja'Marr Chase", "pos": "WR", "team": "CIN", "ez_target_share": 0.42, "air_yards_share": 0.38, "explosive_rate": 0.28, "pass_funnel_rate": 0.60},
    {"player": "Kyren Williams", "pos": "RB", "team": "LAR", "share_3": 0.82, "share_5": 0.75, "share_10": 0.55, "share_20": 0.40, "under_center_rate": 0.65, "has_rushing_qb": False},
    
    # Tommy's Guns Active & Bench
    {"player": "J.K. Dobbins", "pos": "RB", "team": "DEN", "share_3": 0.78, "share_5": 0.70, "share_10": 0.50, "share_20": 0.35, "under_center_rate": 0.68, "has_rushing_qb": False},
    {"player": "George Kittle", "pos": "TE", "team": "SF", "ez_target_share": 0.32, "air_yards_share": 0.26, "explosive_rate": 0.22, "pass_funnel_rate": 0.55},
    {"player": "Jordan Addison", "pos": "WR", "team": "MIN", "ez_target_share": 0.28, "air_yards_share": 0.30, "explosive_rate": 0.24, "pass_funnel_rate": 0.58},
    # Josh Downs benefits from Keenan Allen (Out)
    {"player": "Josh Downs", "pos": "WR", "team": "IND", "ez_target_share": 0.34, "air_yards_share": 0.30, "explosive_rate": 0.22, "pass_funnel_rate": 0.56},
    {"player": "Keenan Allen", "pos": "WR", "team": "IND", "ez_target_share": 0.00, "air_yards_share": 0.00, "explosive_rate": 0.00, "pass_funnel_rate": 0.00, "status": "OUT"},
    {"player": "Samaje Perine", "pos": "RB", "team": "KC", "share_3": 0.15, "share_5": 0.20, "share_10": 0.18, "share_20": 0.15, "under_center_rate": 0.40, "has_rushing_qb": False},
    {"player": "Alexander Mattison", "pos": "RB", "team": "MIA", "share_3": 0.32, "share_5": 0.30, "share_10": 0.25, "share_20": 0.20, "under_center_rate": 0.40, "has_rushing_qb": False},
    {"player": "Jaydon Blue", "pos": "RB", "team": "DAL"},
    {"player": "Jonah Coleman", "pos": "RB", "team": "DEN"},
    {"player": "Zachariah Branch", "pos": "WR", "team": "ATL"},
    {"player": "Elic Ayomanor", "pos": "WR", "team": "TEN"},

    # Legitimate Unowned Free Agent Targets
    {"player": "Pat Bryant", "pos": "WR", "team": "DEN"},
    {"player": "Dontayvion Wicks", "pos": "WR", "team": "GB"},
]

# -------------------------------------------------------------
# 5. Dual Calculation Engines
# -------------------------------------------------------------
def calculate_rb_tpi(player: dict, vegas_itt: float) -> dict:
    base_rz_drives = vegas_itt / 6.5
    trips_3  = base_rz_drives * 0.42
    trips_5  = base_rz_drives * 0.25
    trips_10 = base_rz_drives * 0.22
    trips_20 = base_rz_drives * 0.15

    s_3  = float(player.get("share_3", 0.0))
    s_5  = float(player.get("share_5", 0.0))
    s_10 = float(player.get("share_10", 0.0))
    s_20 = float(player.get("share_20", 0.0))

    xtd_3  = trips_3  * s_3  * 0.54
    xtd_5  = trips_5  * s_5  * 0.28
    xtd_10 = trips_10 * s_10 * 0.14
    xtd_20 = trips_20 * s_20 * 0.06

    total_xtd = xtd_3 + xtd_5 + xtd_10 + xtd_20
    if player.get("has_rushing_qb", False):
        total_xtd *= 0.65
        xtd_3 *= 0.60

    prob_3  = round((1.0 - math.exp(-xtd_3)) * 100, 1)
    prob_5  = round((1.0 - math.exp(-xtd_5)) * 100, 1)
    prob_10 = round((1.0 - math.exp(-xtd_10)) * 100, 1)
    prob_20 = round((1.0 - math.exp(-xtd_20)) * 100, 1)
    total_td_prob = round((1.0 - math.exp(-total_xtd)) * 100, 1)

    if total_td_prob >= 80.0 and s_3 >= 0.75 and player.get("under_center_rate", 0.0) >= 0.60 and vegas_itt >= 24.0:
        tier = "TIER 1 (85%+ SNIPER)"
    elif total_td_prob >= 50.0:
        tier = "TIER 2 (CORE VALUE)"
    elif total_td_prob >= 20.0:
        tier = "TIER 3 (FLEX LEAN)"
    else:
        tier = "TIER 4 (PASS)"

    return {
        "prob_3": f"{prob_3}%", "prob_5": f"{prob_5}%",
        "prob_10": f"{prob_10}%", "prob_20": f"{prob_20}%",
        "total_td": f"{total_td_prob}%", "total_td_val": total_td_prob,
        "tier": tier
    }

def calculate_wr_alpha_tpi(player: dict, matchup: dict) -> dict:
    if player.get("status") == "OUT":
        return {
            "prob_3": "0.0%", "prob_5": "0.0%", "prob_10": "0.0%", "prob_20": "0.0%",
            "total_td": "0.0%", "total_td_val": 0.0, "tier": "INACTIVE (OUT)"
        }

    vegas_itt = matchup["itt"]
    pass_td_exp = matchup.get("pass_td_exp", vegas_itt / 12.0)
    ezts = float(player.get("ez_target_share", 0.20))
    ays = float(player.get("air_yards_share", 0.20))
    exp_rate = float(player.get("explosive_rate", 0.18))
    funnel = float(player.get("pass_funnel_rate", 0.50))

    xtd_ez = pass_td_exp * ezts * 0.62
    xtd_explosive = pass_td_exp * ays * exp_rate * funnel * 3.8
    xtd_underneath = (vegas_itt / 6.5) * 0.25 * ezts * 0.18
    total_xtd = xtd_ez + xtd_explosive + xtd_underneath

    prob_ez = round((1.0 - math.exp(-xtd_ez)) * 100, 1)
    prob_exp = round((1.0 - math.exp(-xtd_explosive)) * 100, 1)
    prob_und = round((1.0 - math.exp(-xtd_underneath)) * 100, 1)
    total_td_prob = round((1.0 - math.exp(-total_xtd)) * 100, 1)

    if total_td_prob >= 80.0 and ezts >= 0.38 and ays >= 0.35 and funnel >= 0.55 and vegas_itt >= 24.0:
        tier = "TIER 1 (85%+ SNIPER)"
    elif total_td_prob >= 50.0:
        tier = "TIER 2 (CORE VALUE)"
    elif total_td_prob >= 20.0:
        tier = "TIER 3 (FLEX LEAN)"
    else:
        tier = "TIER 4 (PASS)"

    return {
        "prob_3": f"{prob_ez}%", "prob_5": f"{prob_ez}%",
        "prob_10": f"{prob_exp}%", "prob_20": f"{prob_und}%",
        "total_td": f"{total_td_prob}%", "total_td_val": total_td_prob,
        "tier": tier
    }

# -------------------------------------------------------------
# 6. Pipeline Execution & File Export
# -------------------------------------------------------------
def run_pipeline():
    print("[*] Executing Dual-Engine TPI Pipeline with League 30605 Guardrails...")
    processed = []

    for raw in RAW_SLATE_PLAYERS:
        name = raw["player"]
        player = raw.copy()

        if name in NFL_ROSTER_OVERRIDES:
            for k, v in NFL_ROSTER_OVERRIDES[name].items():
                player[k] = v

        team = player.get("team", "NFL")
        matchup = WEEK_4_ODDS.get(team, {"opponent": "TBD", "itt": 20.0, "pass_td_exp": 1.5})
        player["opponent"] = matchup["opponent"]
        player["vegas_itt"] = matchup["itt"]

        # Tag availability
        player["remfl_status"] = "ROSTERED" if name in REMFL_ROSTERED_PLAYERS else "AVAILABLE_FA"

        if player.get("pos") in ["WR", "TE"]:
            results = calculate_wr_alpha_tpi(player, matchup)
        else:
            results = calculate_rb_tpi(player, player["vegas_itt"])

        player["3_yrd_line"] = results["prob_3"]
        player["5_yrd_line"] = results["prob_5"]
        player["10_yard_line"] = results["prob_10"]
        player["20_yard_line"] = results["prob_20"]
        player["total_td"] = results["total_td"]
        player["total_td_val"] = results["total_td_val"]
        player["tier"] = results["tier"]

        processed.append(player)

    processed.sort(key=lambda x: x["total_td_val"], reverse=True)
    for idx, p in enumerate(processed):
        p["rank"] = idx + 1

    csv_headers = [
        "Rank", "Player", "Pos", "Team", "Opponent", "Vegas ITT",
        "3 Yrd line", "5 yrd line", "10 yard line", "20 yard line",
        "Total TD", "Tier", "REMFL Status"
    ]

    os.makedirs("public/data", exist_ok=True)
    for path in ["tpi_touchdown_board_full_slate.csv", "public/data/tpi_touchdown_board_full_slate.csv"]:
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
                    "REMFL Status": p["remfl_status"],
                })

    for path in ["remfl_waiver_board.json", "public/data/remfl_waiver_board.json"]:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(processed, f, indent=2)

    print(f"[✓] Pipeline complete. Evaluated {len(processed)} players with strict roster guardrails.")

if __name__ == "__main__":
    run_pipeline()