from typing import List, TypedDict
import math

class VolumeBurstEvent(TypedDict):
    index: int
    previous: float
    current: float
    ratio: float

def detect_volume_bursts(
    volumes: List[float],
    threshold_ratio: float = 1.5,
    min_interval: int = 1,
    baseline_window: int = 1,
) -> List[VolumeBurstEvent]:
    """
    Identify indices where volume jumps by `threshold_ratio` over a baseline.
    Baseline is the mean of the previous `baseline_window` volumes (default: 1 = previous point).
    Returns: list of events: {index, previous, current, ratio}.
    """
    n = len(volumes)
    if n < 2:
        return []

    min_gap = max(1, int(min_interval))
    win = max(1, int(baseline_window))

    events: List[VolumeBurstEvent] = []
    last_idx = -min_gap

    for i in range(1, n):
        start = max(0, i - win)
        prev_vals = [v for v in volumes[start:i] if isinstance(v, (int, float)) and math.isfinite(v)]
        prev = (sum(prev_vals) / len(prev_vals)) if prev_vals else 0.0

        curr = volumes[i]
        curr = float(curr) if isinstance(curr, (int, float)) and math.isfinite(curr) else 0.0

        ratio = (curr / prev) if prev > 0 else (float("inf") if curr > 0 else 0.0)

        if ratio >= threshold_ratio and (i - last_idx) >= min_gap:
            events.append({
                "index": i,
                "previous": round(prev, 4),
                "current": round(curr, 4),
                "ratio": round(ratio, 4),
            })
            last_idx = i

    return events
