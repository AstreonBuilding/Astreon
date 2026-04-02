import type { TaskFormInput } from "./taskFormSchemas"
import { TaskFormSchema } from "./taskFormSchemas"

/**
 * Processes a Typeform webhook payload to schedule a new task.
 */
export async function handleTypeformSubmission(
  raw: unknown
): Promise<{ success: boolean; message: string; taskId?: string }> {
  const parsed = TaskFormSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => i.message).join("; ")
    return { success: false, message: `Validation error: ${msg}` }
  }

  const { taskName, taskType, parameters, scheduleCron } = parsed.data as TaskFormInput

  // Generate a stable task ID
  const taskId =
    (globalThis as any).crypto?.randomUUID?.() ??
    `${Math.random().toString(16).slice(2)}-${Date.now()}`

  // (Placeholder) Here you would persist and schedule the task with your scheduler
  // await scheduler.create({ id: taskId, name: taskName, type: taskType, parameters, scheduleCron })

  // Basic sanity check for cron-like value (schema should already validate specifics)
  if (typeof scheduleCron === "string" && !scheduleCron.trim()) {
    return { success: false, message: "Invalid schedule: cron expression is empty" }
  }

  return {
    success: true,
    message: `Task "${taskName}" scheduled.`,
    taskId,
  }
}
