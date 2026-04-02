import { z } from "zod"

/**
 * Base types for any action flow.
 */
export type ActionSchema = z.ZodObject<z.ZodRawShape>

/**
 * Standardized response format for any executed action.
 */
export interface ActionResponse<T = unknown> {
  notice: string
  data?: T
  warnings?: string[]
  meta?: Record<string, unknown>
}

/**
 * Contract definition for all actions.
 */
export interface BaseAction<
  S extends ActionSchema,
  R,
  Ctx = unknown
> {
  readonly id: string
  readonly summary: string
  readonly input: S
  execute(args: {
    payload: z.infer<S>
    context: Ctx
  }): Promise<ActionResponse<R>>
}

/**
 * Helper to neatly type-check an action implementation.
 */
export const makeAction = <
  S extends ActionSchema,
  R,
  Ctx = unknown
>(
  action: BaseAction<S, R, Ctx>
): BaseAction<S, R, Ctx> => action
