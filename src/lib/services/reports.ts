import { db } from "@/lib/db";
import { reports, approvals, checklists, issues, photos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { reportSchema, approvalSchema } from "@/lib/validations";
import type { Session } from "next-auth";
import { z } from "zod";

type ReportInput = z.infer<typeof reportSchema>;
type ApprovalInput = z.infer<typeof approvalSchema>;

/**
 * Creates a new report and its associated details in a transaction.
 * @param data - The validated report data.
 * @param userId - The ID of the user creating the report.
 * @returns The newly created report with its details.
 */
export async function createReport(data: ReportInput, userId: number) {
  return db.transaction(async (tx) => {
    // 1. Create the main report record
    const [newReport] = await tx
      .insert(reports)
      .values({
        userId,
        shiftType: data.shiftType,
        department: data.department,
        status: "submitted",
        createdAt: new Date(),
      })
      .returning();

    const reportId = newReport.id;

    // 2. Insert checklist items
    if (data.checklists && data.checklists.length > 0) {
      await tx.insert(checklists).values(
        data.checklists.map((item) => ({
          reportId,
          ...item,
        }))
      );
    }

    // 3. Insert issues
    if (data.issues && data.issues.length > 0) {
      await tx.insert(issues).values(
        data.issues.map((item) => ({
          reportId,
          ...item,
        }))
      );
    }

    // 4. Insert photos
    if (data.photos && data.photos.length > 0) {
      await tx.insert(photos).values(
        data.photos.map((item) => ({
          reportId,
          ...item,
        }))
      );
    }

    return newReport;
  });
}

/**
 * Fetches reports with all related details based on the user's role.
 * @param session - The user's session object.
 * @returns A list of reports with checklists, issues, and photos.
 */
export async function getReports(session: Session) {
  const { user } = session;
  if (!user?.id || !user.department) {
    return [];
  }

  const userId = parseInt(user.id);
  const commonQueryOptions = {
    with: {
      user: true,
      checklists: true,
      issues: true,
      photos: true,
    },
    orderBy: (reports: { createdAt: any; }, { desc }: any) => [desc(reports.createdAt)],
  };

  if (user.role === "staff") {
    return db.query.reports.findMany({
      ...commonQueryOptions,
      where: eq(reports.userId, userId),
    });
  }

  if (user.role === "supervisor") {
    return db.query.reports.findMany({
      ...commonQueryOptions,
      where: eq(reports.department, user.department),
    });
  }

  return db.query.reports.findMany(commonQueryOptions);
}

/**
 * Approves, rejects, or requests revision for a report.
 * @param reportId - The ID of the report.
 * @param approvalData - The approval status and comments.
 * @param approverId - The ID of the user performing the action.
 * @returns The updated report.
 */
export async function approveOrRejectReport(
  reportId: number,
  approvalData: ApprovalInput,
  approverId: number
) {
  return db.transaction(async (tx) => {
    const [updatedReport] = await tx
      .update(reports)
      .set({ status: approvalData.status })
      .where(eq(reports.id, reportId))
      .returning();

    await tx.insert(approvals).values({
      reportId,
      approverId,
      status: approvalData.status,
      comments: approvalData.comments,
      approvedAt: new Date(),
    });

    return updatedReport;
  });
}
