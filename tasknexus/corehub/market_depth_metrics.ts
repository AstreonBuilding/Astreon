/**
 * Analyze on-chain orderbook depth for a given market.
 */
export interface Order {
  price: number
  size: number
}

export interface DepthMetrics {
  averageBidDepth: number
  averageAskDepth: number
  spread: number
}

export class TokenDepthAnalyzer {
  constructor(private readonly rpcEndpoint: string, private readonly marketId: string) {}

  async fetchOrderbook(depth = 50): Promise<{ bids: Order[]; asks: Order[] }> {
    const url = `${this.rpcEndpoint}/orderbook/${encodeURIComponent(this.marketId)}?depth=${Math.max(1, depth)}`
    const res = await fetch(url)
    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      throw new Error(`Orderbook fetch failed: HTTP ${res.status}${txt ? ` - ${txt}` : ""}`)
    }
    const json = await res.json().catch(() => ({}))
    const bids: Order[] = Array.isArray(json?.bids) ? json.bids : []
    const asks: Order[] = Array.isArray(json?.asks) ? json.asks : []
    return { bids, asks }
  }

  async analyze(depth = 50): Promise<DepthMetrics> {
    const { bids, asks } = await this.fetchOrderbook(depth)
    const avgSize = (arr: Order[]) =>
      arr.length ? arr.reduce((s, o) => s + (Number(o?.size) || 0), 0) / arr.length : 0

    const bestBid = bids.length ? Math.max(...bids.map(b => Number(b?.price) || 0)) : 0
    const bestAsk = asks.length ? Math.min(...asks.map(a => Number(a?.price) || 0)) : 0

    const spread = bestBid > 0 && bestAsk > 0 ? Math.max(0, bestAsk - bestBid) : 0

    return {
      averageBidDepth: avgSize(bids),
      averageAskDepth: avgSize(asks),
      spread,
    }
  }
}
