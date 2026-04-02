import math
from typing import List, Dict

def compute_shannon_entropy(addresses: List[str]) -> float:
    """
    Compute Shannon entropy (bits) of a sequence of addresses.
    Higher entropy => more diversity in addresses.
    Lower entropy  => more concentration on fewer addresses.
    """
    if not addresses:
        return 0.0

    freq: Dict[str, int] = {}
    for addr in addresses:
        if not isinstance(addr, str):
            continue
        freq[addr] = freq.get(addr, 0) + 1

    total = len(addresses)
    if total == 0:
        return 0.0

    entropy = -sum((count / total) * math.log2(count / total) for count in freq.values())
    return round(entropy, 4)


def normalized_entropy(addresses: List[str]) -> float:
    """
    Compute normalized entropy in range [0,1].
    0 = all identical, 1 = perfectly uniform distribution.
    """
    if not addresses:
        return 0.0
    unique_count = len(set(addresses))
    if unique_count <= 1:
        return 0.0
    max_entropy = math.log2(unique_count)
    return round(compute_shannon_entropy(addresses) / max_entropy, 4)
