import { toolkitBuilder } from "@/ai/core"
import { FETCH_POOL_DATA_KEY } from "@/ai/modules/liquidity/pool-fetcher/key"
import { ANALYZE_POOL_HEALTH_KEY } from "@/ai/modules/liquidity/health-checker/key"
import { FetchPoolDataAction } from "@/ai/modules/liquidity/pool-fetcher/action"
import { AnalyzePoolHealthAction } from "@/ai/modules/liquidity/health-checker/action"

type Toolkit = ReturnType<typeof toolkitBuilder>

/**
 * Canonical identifiers for liquidity analysis toolkits.
 * Helps ensure stable references across the system.
 */
export enum LiquidityToolId {
  FetchPoolData = `liquidityscan-${FETCH_POOL_DATA_KEY}`,
  AnalyzePoolHealth = `poolhealth-${ANALYZE_POOL_HEALTH_KEY}`,
}

/**
 * Toolkit exposing liquidity-related actions:
 * – fetch raw pool data
 * – run health / risk analysis on a liquidity pool
 */
export const LIQUIDITY_ANALYSIS_TOOLS: Record<LiquidityToolId, Toolkit> = Object.freeze({
  [LiquidityToolId.FetchPoolData]: toolkitBuilder(new FetchPoolDataAction()),
  [LiquidityToolId.AnalyzePoolHealth]: toolkitBuilder(new AnalyzePoolHealthAction()),
})
