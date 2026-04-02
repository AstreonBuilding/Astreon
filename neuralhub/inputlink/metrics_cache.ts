export interface MetricEntry {
  key: string
  value: number
  updatedAt: number
}

export class MetricsCache {
  private cache = new Map<string, MetricEntry>()

  /** Retrieve a metric entry by key */
  get(key: string): MetricEntry | undefined {
    return this.cache.get(key)
  }

  /** Set or update a metric entry */
  set(key: string, value: number): void {
    this.cache.set(key, { key, value, updatedAt: Date.now() })
  }

  /** Check if a cached entry is still valid within the given age */
  hasRecent(key: string, maxAgeMs: number): boolean {
    const entry = this.cache.get(key)
    return !!entry && Date.now() - entry.updatedAt < maxAgeMs
  }

  /** Remove a single entry from cache */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /** Clear the entire cache */
  clear(): void {
    this.cache.clear()
  }

  /** Return all cached entries as an array */
  entries(): MetricEntry[] {
    return Array.from(this.cache.values())
  }

  /** Get the number of cached entries */
  size(): number {
    return this.cache.size
  }
}
