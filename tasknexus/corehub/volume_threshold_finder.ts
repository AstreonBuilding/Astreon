/**
 * Detect volume-based patterns in a numeric series.
 */
export interface PatternMatch {
  index: number
  window: number
  average: number
}

export function detectVolumePatterns(
  volumes: number[],
  windowSize: number,
  threshold: number
): PatternMatch[] {
  const matches: PatternMatch[] = []

  if (!Array.isArray(volumes) || volumes.length === 0) return matches
  if (windowSize <= 0 || threshold <= 0) return matches

  for (let i = 0; i + windowSize <= volumes.length; i++) {
    const slice = volumes.slice(i, i + windowSize)
    const avg =
      slice.reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0) / windowSize

    if (avg >= threshold) {
      matches.push({
        index: i,
        window: windowSize,
        average: Math.round(avg * 100) / 100, // rounded for readability
      })
    }
  }

  return matches
}
