export interface VolumePoint {
  timestamp: number
  volumeUsd: number
}

export interface SpikeEvent {
  timestamp: number
  volume: number
  spikeRatio: number
  avgVolume: number
}

/**
 * Detect spikes in trading volume relative to a rolling average window.
 */
export function detectVolumeSpikes(
  points: VolumePoint[],
  windowSize: number = 10,
  spikeThreshold: number = 2.0
): SpikeEvent[] {
  if (points.length < windowSize) return []

  const events: SpikeEvent[] = []
  const volumes = points.map(p => p.volumeUsd)

  for (let i = windowSize; i < volumes.length; i++) {
    const window = volumes.slice(i - windowSize, i)
    const avg = window.reduce((sum, v) => sum + v, 0) / window.length
    const curr = volumes[i]
    const ratio = avg > 0 ? curr / avg : 0

    if (ratio >= spikeThreshold) {
      events.push({
        timestamp: points[i].timestamp,
        volume: curr,
        spikeRatio: Math.round(ratio * 100) / 100,
        avgVolume: Math.round(avg * 100) / 100,
      })
    }
  }

  return events
}
