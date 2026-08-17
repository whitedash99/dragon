import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const activeSessionsCount = await prisma.session.count();
    const totalUsersCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      metrics: {
        activeSessionsCount,
        totalUsersCount,
        failedLoginsCount: 0,
        rateLimitStatus: "STRICT (100 req/min)",
        twoFactorStatus: "OPTIONAL",
      },
      auditLogs: logs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
