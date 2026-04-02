import math
from typing import List, Dict

def compute_shannon_entropy(addresses: List[str]) -> float:
    """
    Compute Shannon entropy (bits) of a sequence of addresses.
    Entropy reflects how evenly distributed the addresses are:
    - Higher = more diverse distribution.
    - Lower = more concentrated distribution.
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

    entropy = 0.0
    for count in freq.values():
        p = count / total
        entropy -= p * math.log2(p)

    return round(entropy, 4)


def normalized_entropy(addresses: List[str]) -> float:
    """
    Compute entropy normalized to [0, 1].
    - 0 means no diversity (all values identical).
    - 1 means maximum diversity (all values unique).
    """
    if not addresses:
        return 0.0
    unique_count = len(set(addresses))
    max_entropy = math.log2(unique_count) if unique_count > 1 else 1
    return round(compute_shannon_entropy(addresses) / max_entropy, 4)
