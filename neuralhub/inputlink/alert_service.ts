import nodemailer from "nodemailer"

export interface AlertConfig {
  email?: {
    host: string
    port: number
    user: string
    pass: string
    from: string
    to: string[]
  }
  console?: boolean
}

export interface AlertSignal {
  title: string
  message: string
  level: "info" | "warning" | "critical"
}

export class AlertService {
  constructor(private cfg: AlertConfig) {}

  /** Send an alert via email if email config is provided */
  private async sendEmail(signal: AlertSignal) {
    if (!this.cfg.email) return

    const { host, port, user, pass, from, to } = this.cfg.email
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // common convention
      auth: { user, pass },
    })

    await transporter.sendMail({
      from,
      to,
      subject: `[${signal.level.toUpperCase()}] ${signal.title}`,
      text: signal.message,
    })
  }

  /** Write alert to console if enabled */
  private logConsole(signal: AlertSignal) {
    if (!this.cfg.console) return

    const prefix = `[ALERT][${signal.level.toUpperCase()}]`
    console.log(`${prefix} ${signal.title}\n${signal.message}`)
  }

  /** Dispatch multiple alert signals */
  async dispatch(signals: AlertSignal[]) {
    for (const sig of signals) {
      await this.sendEmail(sig)
      this.logConsole(sig)
    }
  }
}
