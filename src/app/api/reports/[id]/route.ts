import { db } from "@/lib/db";
import { reports, approvals } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { approvalSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Re-trigger Vercel build with the latest commit
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    !["supervisor", "manager"].includes(session.user.role)
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const json = await req.json();
  const body = approvalSchema.parse(json);

  const updatedReport = await db
    .update(reports)
    .set({ status: body.status })
    .where(eq(reports.id, parseInt(id)))
    .returning();

  if (session.user.id) {
    await db.insert(approvals).values({
      reportId: parseInt(id),
      approverId: parseInt(session.user.id),
      status: body.status,
      comments: body.comments,
    });
  }

  return NextResponse.json(updatedReport);
}
