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

  // Generate a lightweight unique ID for the task
  const taskId =
    (globalThis as any).crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  // Optional: basic schedule sanity check
  if (typeof scheduleCron === "string" && !scheduleCron.trim()) {
    return { success: false, message: "Invalid schedule: cron expression is empty" }
  }

  // Future hook: persist and queue this task in your task manager
  // await taskScheduler.create({ id: taskId, name: taskName, type: taskType, params: parameters, cron: scheduleCron })

  return {
    success: true,
    message: `Task "${taskName}" scheduled successfully`,
    taskId,
  }
}
