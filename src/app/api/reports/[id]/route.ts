import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { approvalSchema } from "@/lib/validations";
import { approveOrRejectReport } from "@/lib/services/reports";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const reportId = parseInt(id);

    const session = await getServerSession(authOptions);
    if (
      !session?.user?.id ||
      !["supervisor", "manager"].includes(session.user.role ?? "")
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = approvalSchema.parse(json);

    const updatedReport = await approveOrRejectReport(
      reportId,
      body,
      parseInt(session.user.id)
    );

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
