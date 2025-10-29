import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq, leftJoin } from "drizzle-orm";
import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const json = await req.json();
  const body = reportSchema.parse(json);

  if (session.user.id) {
    const newReport = await db
      .insert(reports)
      .values({
        userId: parseInt(session.user.id),
        shiftType: body.shiftType,
        department: body.department,
        checklists: body.checklists,
        issues: body.issues,
        photos: body.photos,
        status: "submitted",
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
    userReports = await db.query.reports.findMany({
      where: eq(reports.department, session.user.department),
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
