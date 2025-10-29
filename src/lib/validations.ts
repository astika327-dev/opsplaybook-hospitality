import { z } from "zod";

export const reportSchema = z.object({
  department: z.enum(["housekeeping", "front-desk", "f-b", "maintenance"]),
  shiftType: z.enum(["morning", "evening", "night"]),
  checklists: z.array(
    z.object({
      task: z.string(),
      completed: z.boolean(),
    })
  ),
  issues: z.array(
    z.object({
      description: z.string(),
      priority: z.enum(["low", "medium", "high"]),
    })
  ),
  photos: z.array(z.string()),
});

export const approvalSchema = z.object({
  status: z.enum(["approved", "rejected", "needs_revision"]),
  comments: z.string().optional(),
});
