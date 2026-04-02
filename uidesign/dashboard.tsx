import React, { memo } from "react"
import SentimentGauge from "./SentimentGauge"
import AssetOverviewPanel from "./AssetOverviewPanel"
import WhaleTrackerCard from "./WhaleTrackerCard"

interface DashboardProps {
  className?: string
  title?: string
}

const DashboardComponent: React.FC<DashboardProps> = ({
  className = "",
  title = "Analytics Dashboard",
}) => (
  <main className={`p-8 bg-gray-100 min-h-screen ${className}`} aria-labelledby="dashboard-title">
    <h1 id="dashboard-title" className="text-4xl font-bold mb-6">
      {title}
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SentimentGauge symbol="SYM" />
      <AssetOverviewPanel assetId="ASSET-01" />
      <WhaleTrackerCard />
    </div>
  </main>
)

export const Dashboard = memo(DashboardComponent)
Dashboard.displayName = "Dashboard"

export default Dashboard
