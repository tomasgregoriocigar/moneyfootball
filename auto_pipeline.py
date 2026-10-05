"""
Fully Automated TPI Pipeline
Scrapes live NFL injury statuses, evaluates defensive friction,
calculates net edge, and outputs actionable BUY/PASS verdicts without user intervention.
"""

import json
import os
import requests
from typing import Dict, Any, List
from tpi_defense_engine import DefenseProfile, TargetEvaluation, run_target_audit


def fetch_defensive_injury_clusters() -> Dict[str, Dict[str, bool]]:
    """
    Scrapes ESPN's official NFL injury feed to detect:
    - Front-7 cluster injuries (DT / MLB out)
    - Secondary cluster injuries (CB / S out)
    """
    url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries"
    clusters = {}

    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            for team_entry in data.get("injuries", []):
                team_abbr = team_entry.get("team", {}).get("abbreviation", "")
                front7_out = 0
                secondary_out = 0

                for player in team_entry.get("injuries", []):
                    status = player.get("status", {}).get("description", "").upper()
                    pos = player.get("athlete", {}).get("position", {}).get("abbreviation", "").upper()

                    if status in ["OUT", "INJURED RESERVE", "IR"]:
                        if pos in ["DT", "NT", "DE", "MLB", "ILB"]:
                            front7_out += 1
                        elif pos in ["CB", "S", "FS", "SS"]:
                            secondary_out += 1

                clusters[team_abbr] = {
                    "cluster_dl_mlb": front7_out >= 1,
                    "cluster_secondary": secondary_out >= 2,
                }
    except Exception as e:
        print(f"[Warning] Live injury fetch failed: {e}. Defaulting to conservative injury status.")

    return clusters


def build_active_board(injury_clusters: Dict[str, Dict[str, bool]]) -> List[Dict[str, Any]]:
    """
    Constructs the weekly defensive board using team rates and live injury cluster states.
    """
    # Defensive baselines: rz_fg_forced_rate, gl_stuff_rate, rz_blitz_rate
    defenses = {
        "MIA": DefenseProfile("MIA", 0.44, 0.22, 0.35, False, False),
        "DAL": DefenseProfile("DAL", 0.42, 0.20, 0.30, False, False),
        "CLE": DefenseProfile("CLE", 0.38, 0.25, 0.33, False, False),
        "CHI": DefenseProfile("CHI", 0.36, 0.21, 0.28, False, False),
        "TB":  DefenseProfile("TB",  0.40, 0.24, 0.36, False, False),
        "TEN": DefenseProfile("TEN", 0.28, 0.15, 0.22, False, False),
    }

    # Inject live scraped cluster injuries
    for abbr, profile in defenses.items():
        if abbr in injury_clusters:
            profile.cluster_injury_dl_mlb = injury_clusters[abbr]["cluster_dl_mlb"]
            profile.cluster_injury_secondary = injury_clusters[abbr]["cluster_secondary"]

    # Active target candidates (Kalshi / REMFL priority radar)
    targets = [
        (TargetEvaluation("Chase Brown", "CIN", "RB", 26.5, 0.44, 0.65, 0.34), defenses["MIA"]),
        (TargetEvaluation("Braelon Allen", "NYJ", "RB", 20.5, 0.37, 0.70, 0.31), defenses["CLE"]),
        (TargetEvaluation("Dontayvion Wicks", "GB", "WR", 23.0, 0.38, 0.52, 0.30), defenses["CHI"]),
        (TargetEvaluation("Matt Gay (PK)", "LVR", "TE", 22.0, 0.45, 0.50, 0.32), defenses["TEN"]),
    ]

    results = []
    for target, def_profile in targets:
        audit = run_target_audit(target, def_profile)
        results.append(audit)

    return results


def main():
    print("Fetching live NFL injury feeds...")
    injury_clusters = fetch_defensive_injury_clusters()
    
    print("Running automated TPI defensive engine...")
    slate_results = build_active_board(injury_clusters)

    # Save outputs to JSON for frontend or automated alerts
    output_path = "slate_verdict.json"
    with open(output_path, "w") as f:
        json.dump(slate_results, f, indent=2)

    print(f"\n[Success] Automated pipeline completed. Output saved to {output_path}:")
    print(json.dumps(slate_results, indent=2))


if __name__ == "__main__":
    main()