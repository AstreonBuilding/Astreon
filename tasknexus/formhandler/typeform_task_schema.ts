import { z } from "zod"

/**
 * Schema for scheduling a new task via Typeform submission.
 */
export const TaskFormSchema = z.object({
  taskName: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name must be less than 100 characters"),
  taskType: z.enum(["anomalyScan", "tokenAnalytics", "whaleMonitor"], {
    required_error: "Task type is required",
  }),
  parameters: z
    .record(z.string(), z.string())
    .refine(obj => Object.keys(obj).length > 0, {
      message: "Parameters must include at least one key-value pair",
    }),
  scheduleCron: z
    .string()
    .regex(
      /^(\*|[0-5]?\d) (\*|[01]?\d|2[0-3]) (\*|[1-9]|[12]\d|3[01]) (\*|[1-9]|1[0-2]) (\*|[0-6])$/,
      "Invalid cron expression"
    )
    .optional(),
  description: z.string().max(250).optional(), // added flexibility for metadata
})

export type TaskFormInput = z.infer<typeof TaskFormSchema>
