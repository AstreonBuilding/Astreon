export interface TokenDataPoint {
  timestamp: number
  priceUsd: number
  volumeUsd: number
  marketCapUsd: number
}

export class TokenDataFetcher {
  constructor(private readonly apiBase: string) {}

  /**
   * Fetches an array of TokenDataPoint for the given token symbol.
   * Expects endpoint: `${apiBase}/tokens/${symbol}/history`
   */
  async fetchHistory(symbol: string): Promise<TokenDataPoint[]> {
    let res: Response
    try {
      res = await fetch(`${this.apiBase}/tokens/${encodeURIComponent(symbol)}/history`)
    } catch (err: any) {
      throw new Error(`Network error while fetching history for ${symbol}: ${err?.message ?? String(err)}`)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Failed to fetch history for ${symbol}: HTTP ${res.status}${text ? ` - ${text}` : ""}`)
    }

    let raw: any[]
    try {
      raw = (await res.json()) as any[]
    } catch {
      throw new Error(`Invalid JSON format returned for ${symbol}`)
    }

    const points: TokenDataPoint[] = raw
      .filter(r => r && typeof r.time === "number")
      .map(r => ({
        timestamp: r.time * 1000,
        priceUsd: Number(r.priceUsd) || 0,
        volumeUsd: Number(r.volumeUsd) || 0,
        marketCapUsd: Number(r.marketCapUsd) || 0,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    return points
  }
}
