import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validations";
import { createReport, getReports } from "@/lib/services/reports";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = reportSchema.parse(json);

    const newReport = await createReport(body, parseInt(session.user.id));

    return NextResponse.json(newReport);
  } catch (error) {
    // Basic error handling
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userReports = await getReports(session);

    return NextResponse.json(userReports);
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
