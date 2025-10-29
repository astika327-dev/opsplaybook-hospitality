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
  checklists: text("checklists", { mode: "json" }),
  issues: text("issues", { mode: "json" }),
  photos: text("photos", { mode: "json" }),
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
