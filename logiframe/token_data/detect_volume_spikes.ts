export interface VolumePoint {
  timestamp: number
  volumeUsd: number
}

export interface SpikeEvent {
  timestamp: number
  volume: number
  spikeRatio: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Detect spikes in trading volume compared to a rolling average window.
 */
export function detectVolumeSpikes(
  points: VolumePoint[],
  windowSize: number = 10,
  spikeThreshold: number = 2.0
): SpikeEvent[] {
  const events: SpikeEvent[] = []
  const data = points
    .filter(p => Number.isFinite(p?.timestamp) && Number.isFinite(p?.volumeUsd))
    .sort((a, b) => a.timestamp - b.timestamp)

  if (data.length <= windowSize) return events

  const volumes = data.map(p => p.volumeUsd)
  for (let i = windowSize; i < volumes.length; i++) {
    const slice = volumes.slice(i - windowSize, i)
    const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length
    const curr = volumes[i]
    const ratio = avg > 0 ? curr / avg : 0

    if (ratio >= spikeThreshold) {
      events.push({
        timestamp: data[i].timestamp,
        volume: curr,
        spikeRatio: round2(ratio),
      })
    }
  }

  return events
}
