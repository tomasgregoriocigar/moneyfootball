"""Pytest suite for the TPI defensive engine: asserts BUY/PASS decisions,
probability bounds, and the steam-breaker rule on run_target_audit()."""

from tpi_defense_engine import DefenseProfile, TargetEvaluation, run_target_audit


def _rb(player="Test RB", ask=0.40, prob=0.60, share=0.70):
    return TargetEvaluation(
        player_name=player,
        team="TST",
        position="RB",
        vegas_itt=24.0,
        base_touchdown_prob=prob,
        team_gtg_run_share=share,
        kalshi_market_ask=ask,
    )


def _neutral_def():
    return DefenseProfile(
        opponent_name="OPP",
        rz_fg_forced_rate=0.30,
        gl_stuff_rate=0.18,
        rz_blitz_rate=0.22,
        cluster_injury_dl_mlb=False,
        cluster_injury_secondary=False,
    )


def test_clear_positive_edge_is_buy():
    res = run_target_audit(_rb(ask=0.40, prob=0.65), _neutral_def())
    assert res["decision"] == "BUY"
    assert res["net_edge"].startswith("+")
    assert res["rejection_flag"] is None


def test_clear_negative_edge_is_pass():
    res = run_target_audit(_rb(ask=0.75, prob=0.40), _neutral_def())
    assert res["decision"] == "PASS"
    assert res["net_edge"].startswith("-")


def test_fair_value_is_a_valid_probability():
    res = run_target_audit(_rb(), _neutral_def())
    pct = float(res["adjusted_fair_value"].strip("%")) / 100.0
    assert 0.0 < pct < 1.0


def test_audit_dict_has_required_keys():
    res = run_target_audit(_rb(), _neutral_def())
    for key in ("player", "team", "position", "market_ask",
                "adjusted_fair_value", "net_edge", "decision"):
        assert key in res, f"missing key: {key}"


def test_steamed_market_triggers_steam_breaker():
    # Ask far above fair value must never be a BUY (Steam Breaker rule).
    res = run_target_audit(_rb(ask=0.95, prob=0.45), _neutral_def())
    assert res["decision"] == "PASS"


def test_spec_hurdle_six_percent_edge_is_buy():
    # TPI spec: execute longs when gross dislocation >= +5.0%.
    # A +6% edge must BUY (it was PASS under the old 8% engine hurdle).
    res = run_target_audit(_rb(ask=0.50, prob=0.56), _neutral_def())
    assert res["net_edge"] == "+6.0%"
    assert res["decision"] == "BUY"


def test_below_spec_hurdle_is_pass():
    res = run_target_audit(_rb(ask=0.52, prob=0.56), _neutral_def())
    assert res["decision"] == "PASS"
