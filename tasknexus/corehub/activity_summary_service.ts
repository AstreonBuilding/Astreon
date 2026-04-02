/**
 * Analyze on-chain token activity: fetch recent activity and summarize transfers.
 */
export interface ActivityRecord {
  timestamp: number
  signature: string
  source: string
  destination: string
  amount: number
}

type Json = any

const clampConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>
): Promise<R[]> => {
  const results: R[] = []
  let i = 0
  const run = async () => {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx).catch(() => undefined as unknown as R)
    }
  }
  const n = Math.max(1, Math.min(limit, items.length))
  await Promise.all(Array.from({ length: n }, run))
  return results
}

const toMs = (secs?: number) => (Number.isFinite(secs) ? (secs as number) * 1000 : Date.now())
const n = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d)
const s = (v: unknown, d = "unknown") => (typeof v === "string" && v ? v : d)

export class TokenActivityAnalyzer {
  constructor(private readonly rpcEndpoint: string) {}

  private async fetchJson<T = Json>(url: string): Promise<T> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return (await res.json()) as T
  }

  async fetchRecentSignatures(mint: string, limit = 100): Promise<string[]> {
    const url = `${this.rpcEndpoint}/getSignaturesForAddress/${encodeURIComponent(mint)}?limit=${limit}`
    const json = await this.fetchJson<Json>(url)
    const arr: Json[] = Array.isArray(json) ? json : Array.isArray(json?.result) ? json.result : []
    return arr.map(e => s(e?.signature)).filter(Boolean)
  }

  async analyzeActivity(mint: string, limit = 50): Promise<ActivityRecord[]> {
    const sigs = await this.fetchRecentSignatures(mint, limit)
    if (sigs.length === 0) return []

    // мягкое ограничение конкуренции, чтобы не долбить RPC
    const txs = await clampConcurrency(
      sigs,
      6,
      async sig => {
        const url = `${this.rpcEndpoint}/getTransaction/${encodeURIComponent(sig)}`
        try {
          const tx = await this.fetchJson<Json>(url)
          return { sig, tx }
        } catch {
          return { sig, tx: null }
        }
      }
    )

    const records: ActivityRecord[] = []

    for (const item of txs) {
      const tx = item.tx
      if (!tx?.meta) continue
      const pre = Array.isArray(tx.meta.preTokenBalances) ? tx.meta.preTokenBalances : []
      const post = Array.isArray(tx.meta.postTokenBalances) ? tx.meta.postTokenBalances : []
      const t = toMs(n(tx.blockTime))

      const len = Math.max(pre.length, post.length)
      for (let i = 0; i < len; i++) {
        const p = post[i] ?? {}
        const q = pre[i] ?? {}
        const pAmt = n(p?.uiTokenAmount?.uiAmount)
        const qAmt = n(q?.uiTokenAmount?.uiAmount)
        const delta = pAmt - qAmt
        if (delta === 0) continue

        records.push({
          timestamp: t,
          signature: item.sig,
          source: s(q?.owner),
          destination: s(p?.owner),
          amount: Math.abs(delta),
        })
      }
    }

    // сортировка по времени (новые сверху)
    records.sort((a, b) => b.timestamp - a.timestamp)
    return records
  }
}
