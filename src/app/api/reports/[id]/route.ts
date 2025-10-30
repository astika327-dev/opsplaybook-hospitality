import { db } from "@/lib/db";
import { reports, approvals } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { approvalSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    .where(eq(reports.id, parseInt(params.id)))
    .returning();

  if (session.user.id) {
    await db.insert(approvals).values({
      reportId: parseInt(params.id),
      approverId: parseInt(session.user.id),
      status: body.status,
      comments: body.comments,
    });
  }

  return NextResponse.json(updatedReport);
}
