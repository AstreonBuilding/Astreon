import React, { memo } from "react"

interface MarketSentimentWidgetProps {
  sentimentScore: number // expected 0–100
  trend: "Bullish" | "Bearish" | "Neutral"
  dominantToken: string
  totalVolume24h: number
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value))

const getSentimentColor = (score: number): string => {
  const s = clamp(score)
  if (s >= 70) return "#4caf50" // green
  if (s >= 40) return "#ff9800" // orange
  return "#f44336" // red
}

const formatUsd = (amount: number): string =>
  `$${(Number.isFinite(amount) ? amount : 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`

const MarketSentimentWidgetComponent: React.FC<MarketSentimentWidgetProps> = ({
  sentimentScore,
  trend,
  dominantToken,
  totalVolume24h,
}) => (
  <section
    className="p-4 bg-white rounded-xl shadow border border-gray-200"
    aria-labelledby="market-sentiment-title"
  >
    <h3 id="market-sentiment-title" className="text-lg font-semibold mb-3">
      Market Sentiment
    </h3>
    <div className="flex items-center gap-4">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full text-white font-bold"
        style={{ backgroundColor: getSentimentColor(sentimentScore) }}
        aria-label={`Sentiment score ${clamp(sentimentScore)} percent`}
      >
        {clamp(sentimentScore)}%
      </div>
      <ul className="text-sm space-y-1">
        <li>
          <strong>Trend:</strong> {trend}
        </li>
        <li>
          <strong>Dominant Token:</strong> {dominantToken}
        </li>
        <li>
          <strong>24h Volume:</strong> {formatUsd(totalVolume24h)}
        </li>
      </ul>
    </div>
  </section>
)

export const MarketSentimentWidget = memo(MarketSentimentWidgetComponent)
MarketSentimentWidget.displayName = "MarketSentimentWidget"

export default MarketSentimentWidget
