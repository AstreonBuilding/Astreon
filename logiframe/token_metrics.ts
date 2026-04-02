export interface PricePoint {
  timestamp: number
  price: number
}

export interface TokenMetrics {
  averagePrice: number
  volatility: number      // standard deviation
  maxPrice: number
  minPrice: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

export class TokenAnalysisCalculator {
  private readonly data: PricePoint[]

  constructor(data: PricePoint[]) {
    this.data = (data || [])
      .filter(p => Number.isFinite(p?.timestamp) && Number.isFinite(p?.price))
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  getAveragePrice(): number {
    const n = this.data.length
    if (n === 0) return 0
    const sum = this.data.reduce((acc, p) => acc + p.price, 0)
    return round2(sum / n)
  }

  getVolatility(): number {
    const n = this.data.length
    if (n < 2) return 0
    const avg = this.getAveragePrice()
    const variance = this.data.reduce((acc, p) => acc + (p.price - avg) ** 2, 0) / (n - 1)
    return round2(Math.sqrt(variance))
  }

  getMaxPrice(): number {
    if (this.data.length === 0) return 0
    return Math.max(...this.data.map(p => p.price))
  }

  getMinPrice(): number {
    if (this.data.length === 0) return 0
    return Math.min(...this.data.map(p => p.price))
  }

  computeMetrics(): TokenMetrics {
    return {
      averagePrice: this.getAveragePrice(),
      volatility: this.getVolatility(),
      maxPrice: this.getMaxPrice(),
      minPrice: this.getMinPrice(),
    }
  }
}
