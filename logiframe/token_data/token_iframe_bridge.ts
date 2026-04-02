import type { TokenDataPoint } from "./token_data_fetcher"

export interface DataIframeConfig {
  containerId: string
  iframeUrl: string
  token: string
  refreshMs?: number
}

export class TokenDataIframeEmbedder {
  private iframe?: HTMLIFrameElement
  private intervalId?: number
  private readonly targetOrigin: string

  constructor(private cfg: DataIframeConfig) {
    this.targetOrigin = (() => {
      try {
        return new URL(cfg.iframeUrl).origin
      } catch {
        return "*"
      }
    })()
  }

  async init(): Promise<void> {
    if (this.iframe) return

    const container = document.getElementById(this.cfg.containerId)
    if (!container) throw new Error(`Container not found: ${this.cfg.containerId}`)

    const iframe = document.createElement("iframe")
    iframe.src = this.cfg.iframeUrl
    iframe.style.border = "none"
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.onload = () => this.postTokenData()
    container.appendChild(iframe)
    this.iframe = iframe

    if (this.cfg.refreshMs && this.cfg.refreshMs > 0) {
      this.intervalId = window.setInterval(() => this.postTokenData(), this.cfg.refreshMs)
    }
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.iframe?.remove()
    this.iframe = undefined
  }

  private async postTokenData(): Promise<void> {
    if (!this.iframe?.contentWindow) return
    try {
      const { TokenDataFetcher } = await import("./token_data_fetcher")
      const fetcher = new TokenDataFetcher(this.cfg.iframeUrl)
      const data: TokenDataPoint[] = await fetcher.fetchHistory(this.cfg.token)
      this.iframe.contentWindow.postMessage(
        { type: "TOKEN_DATA_UPDATE", token: this.cfg.token, data },
        this.targetOrigin
      )
    } catch (err: any) {
      console.error("Failed to fetch/post token data:", err?.message ?? err)
    }
  }
}
