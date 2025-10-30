import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    shiftType,
    department,
    checklists,
    issues,
    photos,
    status = "submitted",
  } = await req.json();

  if (session.user.id) {
    const newReport = await db
      .insert(reports)
      .values({
        userId: parseInt(session.user.id),
        shiftType,
        department,
        checklists,
        issues,
        photos,
        status,
      })
      .returning();

    return NextResponse.json(newReport);
  }
  return new Response("Unauthorized", { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let userReports;
  if (session.user.role === "staff" && session.user.id) {
    userReports = await db.query.reports.findMany({
      where: eq(reports.userId, parseInt(session.user.id)),
      with: {
        user: true,
      },
    });
  } else if (session.user.role === "supervisor") {
    // In a real app, you'd fetch reports for the supervisor's team
    userReports = await db.query.reports.findMany({
      with: {
        user: true,
      },
    });
  } else {
    userReports = await db.query.reports.findMany({
      with: {
        user: true,
      },
    });
  }

  return NextResponse.json(userReports);
}
