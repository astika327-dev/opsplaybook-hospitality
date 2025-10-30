import { z } from "zod";

// Schema for a single checklist item
const checklistItemSchema = z.object({
  item: z.string().min(1, "Checklist item cannot be empty."),
  status: z.enum(["completed", "incomplete"]),
});

// Schema for a single issue
const issueItemSchema = z.object({
  description: z.string().min(1, "Issue description cannot be empty."),
});

// Schema for a single photo
const photoItemSchema = z.object({
  url: z.string().url("Invalid URL format."),
  caption: z.string().optional(),
});

// Main report schema for creating a report
export const reportSchema = z.object({
  department: z.enum(["housekeeping", "front-desk", "f-b", "maintenance"]),
  shiftType: z.enum(["morning", "evening", "night"]),
  checklists: z
    .array(checklistItemSchema)
    .min(1, "At least one checklist item is required."),
  issues: z.array(issueItemSchema).optional(),
  photos: z.array(photoItemSchema).optional(),
});

export const approvalSchema = z.object({
  status: z.enum(["approved", "rejected", "needs_revision"]),
  comments: z.string().optional(),
});
