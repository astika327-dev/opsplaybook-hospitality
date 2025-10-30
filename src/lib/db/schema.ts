import {
  sqliteTable,
  integer,
  text,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  hashedPassword: text("hashed_password"),
  role: text("role", {
    enum: ["staff", "supervisor", "manager"],
  }),
  department: text("department", {
    enum: ["housekeeping", "front-desk", "f-b", "maintenance"],
  }),
});

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  shiftType: text("shift_type", {
    enum: ["morning", "evening", "night"],
  }),
  department: text("department", {
    enum: ["housekeeping", "front-desk", "f-b", "maintenance"],
  }),
  status: text("status", {
    enum: ["draft", "submitted", "approved", "rejected", "needs_revision"],
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    () => new Date()
  ),
});

export const approvals = sqliteTable("approvals", {
  id: integer("id").primaryKey(),
  reportId: integer("report_id").references(() => reports.id),
  approverId: integer("approver_id").references(() => users.id),
  status: text("status", {
    enum: ["approved", "rejected", "needs_revision"],
  }),
  comments: text("comments"),
  approvedAt: integer("approved_at", { mode: "timestamp" }),
});

// New table for checklists
export const checklists = sqliteTable("checklists", {
  id: integer("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reports.id, { onDelete: "cascade" }) // Cascade delete
    .notNull(),
  item: text("item").notNull(),
  status: text("status", { enum: ["completed", "incomplete"] }).notNull(),
});

// New table for issues
export const issues = sqliteTable("issues", {
  id: integer("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description").notNull(),
  isResolved: integer("is_resolved", { mode: "boolean" })
    .default(false)
    .notNull(),
});

// New table for photos
export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(), // URL from Cloudinary or other storage
  caption: text("caption"),
});

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  approvals: many(approvals),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  approvals: many(approvals),
  checklists: many(checklists),
  issues: many(issues),
  photos: many(photos),
}));

// Relations for the new tables
export const checklistsRelations = relations(checklists, ({ one }) => ({
  report: one(reports, {
    fields: [checklists.reportId],
    references: [reports.id],
  }),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  report: one(reports, {
    fields: [issues.reportId],
    references: [reports.id],
  }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  report: one(reports, {
    fields: [photos.reportId],
    references: [reports.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  report: one(reports, {
    fields: [approvals.reportId],
    references: [reports.id],
  }),
  approver: one(users, {
    fields: [approvals.approverId],
    references: [users.id],
  }),
}));
