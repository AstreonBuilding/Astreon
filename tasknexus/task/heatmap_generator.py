from typing import List, Tuple, Dict

def generate_activity_heatmap(
    timestamps: List[int],
    counts: List[int],
    buckets: int = 10,
    normalize: bool = True
) -> List[float]:
    """
    Bucket activity counts into 'buckets' time intervals,
    returning either raw counts or normalized [0.0–1.0].
    - timestamps: list of epoch ms timestamps.
    - counts: list of integer counts per timestamp.
    - buckets: number of intervals to split the timeline into.
    - normalize: if True, output is scaled to max=1.0.
    """
    if not timestamps or not counts or len(timestamps) != len(counts):
        return []

    t_min, t_max = min(timestamps), max(timestamps)
    span = max(1, t_max - t_min)  # avoid division by zero
    bucket_size = span / buckets

    agg = [0] * buckets
    for t, c in zip(timestamps, counts):
        idx = min(buckets - 1, int((t - t_min) / bucket_size))
        agg[idx] += c

    if normalize:
        m = max(agg) or 1
        return [round(val / m, 4) for val in agg]

    return agg


def heatmap_summary(heatmap: List[float]) -> Dict[str, float]:
    """
    Provide quick summary stats for a generated heatmap.
    """
    if not heatmap:
        return {"max": 0.0, "avg": 0.0, "nonzero_buckets": 0}
    return {
        "max": max(heatmap),
        "avg": round(sum(heatmap) / len(heatmap), 4),
        "nonzero_buckets": sum(1 for v in heatmap if v > 0),
    }
