import time
import requests

SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"

TARGET_TEAMS = {
    "BAL": "Derrick Henry",
    "CIN": "Ja'Marr Chase",
    "LAR": "Kyren Williams"
}

seen_plays = set()

def check_redzone():
    try:
        resp = requests.get(SCOREBOARD_URL, timeout=5)
        if resp.status_code != 200:
            return
        data = resp.json()
        
        for event in data.get("events", []):
            competition = event["competitions"][0]
            situation = competition.get("situation", {})
            if not situation:
                continue

            possession_id = situation.get("possession")
            yardline = situation.get("yardLine", 100)
            down_dist = situation.get("downDistanceText", "")
            last_play = situation.get("lastPlay", {})
            play_id = last_play.get("id")
            play_text = last_play.get("text", "")

            for team in competition["competitors"]:
                abbr = team["team"]["abbreviation"]
                if team["id"] == possession_id and abbr in TARGET_TEAMS:
                    if yardline <= 10:
                        play_key = f"{abbr}-{play_id}"
                        if play_key not in seen_plays:
                            seen_plays.add(play_key)
                            player = TARGET_TEAMS[abbr]
                            print("\n" + "="*50)
                            print(f"🚨 [RED ZONE ALERT] {abbr} inside the 10! ({down_dist})")
                            print(f"🎯 Target active: {player}")
                            print(f"📖 Play: {play_text}")
                            print("="*50)
    except Exception:
        pass

if __name__ == "__main__":
    print("[*] Red Zone Monitor started. Watching BAL, CIN, and LAR...")
    print("[*] Polling every 15s. Press Ctrl+C to stop.\n")
    while True:
        check_redzone()
        time.sleep(15)