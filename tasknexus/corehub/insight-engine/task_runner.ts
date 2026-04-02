/**
 * Simple task executor: registers handlers and runs queued tasks.
 */
type Handler = (params: any) => Promise<any>

export class ExecutionEngine {
  private handlers: Record<string, Handler> = {}
  private queue: Array<{ id: string; type: string; params: any }> = []

  register(type: string, handler: Handler): void {
    if (this.handlers[type]) {
      throw new Error(`Handler already registered for type "${type}"`)
    }
    this.handlers[type] = handler
  }

  enqueue(id: string, type: string, params: any): void {
    if (!this.handlers[type]) {
      throw new Error(`No handler for task type "${type}"`)
    }
    this.queue.push({ id, type, params })
  }

  async runAll(): Promise<Array<{ id: string; result?: any; error?: string }>> {
    const results: Array<{ id: string; result?: any; error?: string }> = []

    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      try {
        const data = await this.handlers[task.type](task.params)
        results.push({ id: task.id, result: data })
      } catch (err: any) {
        results.push({ id: task.id, error: err.message ?? "Unknown error" })
      }
    }

    return results
  }

  clearQueue(): void {
    this.queue = []
  }

  listPending(): Array<{ id: string; type: string }> {
    return this.queue.map(({ id, type }) => ({ id, type }))
  }
}
