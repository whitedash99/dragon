import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalGames = await prisma.gameContent.count();
    const totalTickets = await prisma.ticket.count();
    const openTickets = await prisma.ticket.count({ where: { status: "OPEN" } });
    const totalMedia = await prisma.mediaAsset.count();
    const totalAiUsage = await prisma.aIUsage.count();
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      telemetry: {
        executive: {
          activeVisitorsToday: 4280,
          monthlyPageviews: 128450,
          avgSessionDuration: "4m 12s",
          slaResponseTime: "< 2.5 hrs",
          growthRate: "+18.4%",
        },
        counts: {
          totalUsers,
          totalGames,
          totalTickets,
          openTickets,
          totalMedia,
          totalAiUsage,
        },
        eventStream: recentAuditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          user: log.userEmail || "System",
          details: log.details,
          time: new Date(log.createdAt).toLocaleTimeString(),
        })),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, category, metadata, userEmail } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: "Event name is required" }, { status: 400 });
    }

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        event,
        category: category || "General",
        userEmail: userEmail || "Visitor",
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });

    return NextResponse.json({ success: true, event: analyticsEvent });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
