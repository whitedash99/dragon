import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";

    let emailLogs: unknown[] = [];
    let activityLogs: unknown[] = [];

    if (type === "all" || type === "emails") {
      emailLogs = await prisma.emailLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { ticket: true },
      });
    }

    if (type === "all" || type === "activities") {
      activityLogs = await prisma.ticketActivity.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { ticket: true },
      });
    }

    return NextResponse.json({
      success: true,
      emailLogs,
      activityLogs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
