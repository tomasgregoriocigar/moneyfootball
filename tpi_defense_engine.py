"""
TPI Defensive Engine (v2)
Integrates defensive red-zone stall rates, goal-line stuff rates,
scheme blitz tendencies, and front-seven/secondary cluster injuries.
"""

from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DefenseProfile:
    opponent_name: str
    rz_fg_forced_rate: float       # Percentage of opp RZ drives ending in FG (e.g. 0.44 = 44%)
    gl_stuff_rate: float           # Percentage of sub-5-yard carries stopped <= LOS (e.g. 0.25 = 25%)
    rz_blitz_rate: float           # Blitz rate inside the 20-yard line (e.g. 0.35 = 35%)
    cluster_injury_dl_mlb: bool    # True if starting DT/MLB or 2+ front-7 starters are OUT
    cluster_injury_secondary: bool # True if starting boundary CB + primary safety are OUT


@dataclass
class TargetEvaluation:
    player_name: str
    team: str
    position: str                  # 'RB', 'WR', 'TE', or 'SLOT'
    vegas_itt: float               # Implied Team Total (e.g. 26.5)
    base_touchdown_prob: float     # Unadjusted offensive TPI (0.0 to 1.0)
    team_gtg_run_share: float      # Sub-5-yard rushing play-calling share (e.g. 0.70 = 70%)
    kalshi_market_ask: float       # Kalshi market price in cents/dollars (e.g. 0.52 = 52¢)


def compute_c_def(defense: DefenseProfile, position: str) -> float:
    """Computes composite defensive coefficient C_DEF."""
    c_def = 1.0

    # 1. Red-Zone Bend-Don't-Break (Field Goal Stall Trap)
    if defense.rz_fg_forced_rate >= 0.40:
        c_def *= 0.85

    # 2. Goal-Line Stuff Rate & Front-7 Health
    if position == "RB":
        if defense.gl_stuff_rate >= 0.22:
            c_def *= 0.82
        if defense.cluster_injury_dl_mlb:
            c_def *= 1.20

    # 3. Red-Zone Scheme & Secondary Health
    if position == "WR":
        if defense.rz_blitz_rate >= 0.32:
            c_def *= 0.88  # High pressure forces rapid release; boundary fades die
        if defense.cluster_injury_secondary:
            c_def *= 1.15
    elif position in ["TE", "SLOT"]:
        if defense.rz_blitz_rate >= 0.32:
            c_def *= 1.15  # Quick checkdowns, seams, and crossing routes

    return round(c_def, 3)


def run_target_audit(target: TargetEvaluation, defense: DefenseProfile) -> Dict[str, Any]:
    """Runs a complete defensive filter audit on a Kalshi / REMFL target."""
    c_def = compute_c_def(defense, target.position)
    adjusted_prob = target.base_touchdown_prob * c_def

    # 4. Under-Center Goal-to-Go Multiplier penalty on WRs
    if target.position == "WR" and target.team_gtg_run_share >= 0.65:
        adjusted_prob *= 0.85

    # Hard Cap Rule: Reject WR contracts priced >= $0.42 unless secondary cluster injury exists
    hard_reject = False
    reject_reason = "None"
    if target.position == "WR" and target.kalshi_market_ask >= 0.42 and not defense.cluster_injury_secondary:
        hard_reject = True
        reject_reason = "WR Ask exceeds 42¢ cap without opposing secondary cluster injury"

    net_edge = adjusted_prob - target.kalshi_market_ask
    recommendation = "BUY" if (net_edge >= 0.08 and not hard_reject) else "PASS"

    return {
        "player": target.player_name,
        "team": target.team,
        "position": target.position,
        "market_ask": f"{target.kalshi_market_ask * 100:.0f}¢",
        "c_def": c_def,
        "adjusted_fair_value": f"{adjusted_prob * 100:.1f}%",
        "net_edge": f"{net_edge * 100:+.1f}%",
        "decision": recommendation,
        "rejection_flag": reject_reason,
    }