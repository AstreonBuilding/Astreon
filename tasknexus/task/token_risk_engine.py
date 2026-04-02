import math
from typing import Dict

def calculate_risk_score(price_change_pct: float, liquidity_usd: float, flags_mask: int) -> float:
    """
    Compute a 0–100 risk score.
    - price_change_pct: percent change over period (e.g. +5.0 for +5%).
    - liquidity_usd: total liquidity in USD.
    - flags_mask: integer bitmask of risk flags; each set bit adds a penalty.
    """
    # volatility component (max 50 points)
    vol_score = min(abs(price_change_pct) / 10, 1) * 50

    # liquidity component: more liquidity = lower risk (max 30 points)
    if liquidity_usd > 0:
        liq_score = max(0.0, 30 - (math.log10(liquidity_usd) * 5))
    else:
        liq_score = 30.0

    # flag penalty: 5 points per set bit
    flag_count = bin(flags_mask).count("1")
    flag_score = flag_count * 5

    raw_score = vol_score + liq_score + flag_score
    return min(round(raw_score, 2), 100.0)


def explain_risk_components(price_change_pct: float, liquidity_usd: float, flags_mask: int) -> Dict[str, float]:
    """
    Return a breakdown of each risk component for transparency.
    """
    return {
        "volatility_component": min(abs(price_change_pct) / 10, 1) * 50,
        "liquidity_component": (
            max(0.0, 30 - (math.log10(liquidity_usd) * 5)) if liquidity_usd > 0 else 30.0
        ),
        "flag_penalty": bin(flags_mask).count("1") * 5,
        "final_score": calculate_risk_score(price_change_pct, liquidity_usd, flags_mask),
    }
