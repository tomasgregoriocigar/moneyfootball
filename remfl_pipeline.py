#!/usr/bin/env python3
"""
REMFL Money Football Pipeline (TPI-v4.1)
Pure 6-Point Touchdown Quant Model with 85-90% Tier 1 Confidence Gate.
"""

import os
import json
import csv

# -------------------------------------------------------------
# 1. Pro Club Mappings & Positional Overrides
# -------------------------------------------------------------
NFL_ROSTER_OVERRIDES = {
    "Jonah Coleman": {
        "team": "DEN",
        "pos": "RB",
        "status": "Active",
        "inside_3_share": 0.35,
        "under_center_rate": 0.55,
        "has_rushing_qb": False,
    },
    "Jaydon Blue": {
        "team": "DAL",
        "pos": "RB",
        "status": "Active",
        "inside_3_share": 0.30,
        "under_center_rate": 0.50,
        "has_rushing_qb": False,
    },
    "Elic Ayomanor": {
        "team": "TEN",
        "pos": "WR",
        "status": "Active",
        "inside_3_share": 0.15,
        "under_center_rate": 0.45,
        "has_rushing_qb": False,
    },
    "Zachariah Branch": {
        "team": "ATL",
        "pos": "WR",
        "status": "Active",
        "inside_3_share": 0.20,
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
# 3. Active Slate Player Pool (Tommy's Guns + NFL Slate Anchors)
# -------------------------------------------------------------
RAW_SLATE_PLAYERS = [
    # High-leverage benchmark backs
    {"player": "Derrick Henry", "pos": "RB", "team": "BAL", "inside_3_share": 0.88, "under_center_rate": 0.72, "has_rushing_qb": False, "rz_share": "42%"},
    {"player": "Kyren Williams", "pos": "RB", "team": "LAR", "inside_3_share": 0.82, "under_center_rate": 0.65, "has_rushing_qb": False, "rz_share": "38%"},
    
    # Tommy's Guns Active & Stash
    {"player": "J.K. Dobbins", "pos": "RB", "team": "LAC", "inside_3_share": 0.78, "under_center_rate": 0.68, "has_rushing_qb": False, "rz_share": "35%"},
    {"player": "George Kittle", "pos": "TE", "team": "SF", "inside_3_share": 0.35, "under_center_rate": 0.60, "has_rushing_qb": False, "rz_share": "28%"},
    {"player": "Jordan Addison", "pos": "WR", "team": "MIN", "inside_3_share": 0.18, "under_center_rate": 0.50, "has_rushing_qb": False, "rz_share": "24%"},
    {"player": "Josh Downs", "pos": "WR", "team": "IND", "inside_3_share": 0.14, "under_center_rate": 0.45, "has_rushing_qb": False, "rz_share": "22%"},
    {"player": "Samaje Perine", "pos": "RB", "team": "KC", "inside_3_share": 0.12, "under_center_rate": 0.40, "has_rushing_qb": False, "rz_share": "15%"},
    {"player": "Alexander Mattison", "pos": "RB", "team": "MIA", "inside_3_share": 0.30, "under_center_rate": 0.40, "has_rushing_qb": False, "rz_share": "18%"},
    {"player": "Kayshon Boutte", "pos": "WR", "team": "NE", "inside_3_share": 0.08, "under_center_rate": 0.40, "has_rushing_qb": False, "rz_share": "12%"},
    
    # Overrides (Coleman, Blue, Ayomanor, Branch)
    {"player": "Jonah Coleman", "pos": "RB", "team": "DEN", "inside_3_share": 0.35, "under_center_rate": 0.55, "has_rushing_qb": False, "rz_share": "20%"},
    {"player": "Jaydon Blue", "pos": "RB", "team": "DAL", "inside_3_share": 0.30, "under_center_rate": 0.50, "has_rushing_qb": False, "rz_share": "16%"},
    {"player": "Elic Ayomanor", "pos": "WR", "team": "TEN", "inside_3_share": 0.15, "under_center_rate": 0.45, "has_rushing_qb": False, "rz_share": "14%"},
    {"player": "Zachariah Branch", "pos": "WR", "team": "ATL", "inside_3_share": 0.20, "under_center_rate": 0.50, "has_rushing_qb": False, "rz_share": "15%"},
]

# -------------------------------------------------------------
# 4. 85-90% High Conviction Bayesian Gating Model
# -------------------------------------------------------------
def calculate_high_conviction_tpi(player: dict) -> dict:
    itt = float(player.get("vegas_itt", 20.0))
    inside_3_share = float(player.get("inside_3_share", 0.0))
    under_center_rate = float(player.get("under_center_rate", 0.50))
    qb_rush_vulture = bool(player.get("has_rushing_qb", False))

    # HARD GATES FOR TIER 1 (85%+ CONVICTION)
    clears_itt = itt >= 24.0
    clears_inside_3 = inside_3_share >= 0.75
    clears_scheme = under_center_rate >= 0.60
    no_vulture = not qb_rush_vulture

    # BASE TPI SCORE
    raw_score = (
        (min(itt, 30.0) / 30.0) * 0.45 +
        inside_3_share * 0.40 +
        (under_center_rate * 0.15)
    )

    if qb_rush_vulture:
        raw_score *= 0.65

    # TIER DETERMINATION
    if clears_itt and clears_inside_3 and clears_scheme and no_vulture:
        conviction_tier = "TIER 1 (85%+ CONVICTION)"
        confidence_pct = round(min(0.92, 0.83 + (raw_score - 0.75) * 0.4), 2)
    elif raw_score >= 0.50:
        conviction_tier = "TIER 2 (STARTABLE)"
        confidence_pct = round(raw_score * 0.75, 2)
    elif raw_score >= 0.35:
        conviction_tier = "TIER 3 (FLEX / LEAN)"
        confidence_pct = round(raw_score * 0.55, 2)
    else:
        conviction_tier = "TIER 4 (PASS / UNRELIABLE)"
        confidence_pct = round(raw_score * 0.35, 2)

    return {
        "tpi_score": round(raw_score, 2),
        "confidence_pct": confidence_pct,
        "conviction_tier": conviction_tier,
    }

# -------------------------------------------------------------
# 5. Pipeline Execution & Data Export
# -------------------------------------------------------------
def run_pipeline():
    print("[*] Initializing REMFL Touchdown Quant Pipeline (TPI-v4.1)...")
    processed = []

    for raw in RAW_SLATE_PLAYERS:
        name = raw["player"]
        player = raw.copy()

        # Apply pro-club overrides
        if name in NFL_ROSTER_OVERRIDES:
            override = NFL_ROSTER_OVERRIDES[name]
            player["team"] = override["team"]
            player["pos"] = override["pos"]
            player["inside_3_share"] = override.get("inside_3_share", player.get("inside_3_share", 0.0))

        team = player.get("team", "NFL")
        matchup = WEEK_4_ODDS.get(team, {"opponent": "TBD", "itt": 20.0})

        player["opponent"] = matchup["opponent"]
        player["vegas_itt"] = matchup["itt"]

        # Run TPI Quant Model
        quant_result = calculate_high_conviction_tpi(player)
        player["tpi_score"] = quant_result["tpi_score"]
        player["confidence_pct"] = quant_result["confidence_pct"]
        player["tier"] = quant_result["conviction_tier"]
        player["inside_5"] = f"{int(player.get('inside_3_share', 0.0) * 100)}%"

        processed.append(player)

    # Sort descending by TPI score
    processed.sort(key=lambda x: x["tpi_score"], reverse=True)
    for idx, p in enumerate(processed):
        p["rank"] = idx + 1

    # Ensure output directories exist
    os.makedirs("public/data", exist_ok=True)

    # Write CSV
    csv_headers = ["rank", "player", "pos", "team", "opponent", "vegas_itt", "rz_share", "inside_5", "tpi_score", "tier"]
    csv_paths = ["tpi_touchdown_board_full_slate.csv", "public/data/tpi_touchdown_board_full_slate.csv"]

    for path in csv_paths:
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=csv_headers)
            writer.writeheader()
            for p in processed:
                writer.writerow({
                    "rank": p["rank"],
                    "player": p["player"],
                    "pos": p["pos"],
                    "team": p["team"],
                    "opponent": p["opponent"],
                    "vegas_itt": f"{p['vegas_itt']:.2f}",
                    "rz_share": p.get("rz_share", "N/A"),
                    "inside_5": p["inside_5"],
                    "tpi_score": f"{p['tpi_score']:.2f}",
                    "tier": p["tier"],
                })

    # Write JSON
    json_paths = ["remfl_waiver_board.json", "public/data/remfl_waiver_board.json"]
    for path in json_paths:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(processed, f, indent=2)

    print(f"[✓] Processed {len(processed)} players with 85%+ Bayesian gating.")
    print("[✓] Datasets exported to both root and public/data/ successfully.")

if __name__ == "__main__":
    run_pipeline()