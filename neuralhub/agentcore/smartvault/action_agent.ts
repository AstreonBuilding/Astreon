import type { BaseAction, ActionResponse } from "./base_action"
import { z } from "zod"

interface AgentContext {
  apiEndpoint: string
  apiKey: string
}

/**
 * Central Agent: routes calls to registered actions.
 */
export class Agent {
  private actions = new Map<string, BaseAction<z.ZodObject<any>, any, AgentContext>>()

  register<S extends z.ZodObject<any>, R>(action: BaseAction<S, R, AgentContext>): void {
    this.actions.set(action.id, action as BaseAction<z.ZodObject<any>, any, AgentContext>)
  }

  has(id: string): boolean {
    return this.actions.has(id)
  }

  list(): string[] {
    return [...this.actions.keys()]
  }

  async invoke<S extends z.ZodObject<any>, R>(
    actionId: string,
    payload: unknown,
    ctx: AgentContext
  ): Promise<ActionResponse<R>> {
    const action = this.actions.get(actionId) as BaseAction<S, R, AgentContext> | undefined
    if (!action) throw new Error(`Unknown action "${actionId}"`)

    const parsed = action.input.safeParse(payload)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join(".") || "<root>"}: ${i.message}`).join("; ")
      return { notice: `Validation failed: ${issues}` }
    }

    try {
      return await action.execute({ payload: parsed.data, context: ctx })
    } catch (err: any) {
      return { notice: `Execution failed: ${err?.message ?? String(err)}` }
    }
  }
}
