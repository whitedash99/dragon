import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startTime;

    const [
      totalUsers,
      totalTickets,
      openTickets,
      totalGames,
      totalArticles,
      totalMedia,
      totalSubscribers,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.contactTicket.count({ where: { deleted: false } }),
      prisma.contactTicket.count({ where: { status: "OPEN", deleted: false } }),
      prisma.gameContent.count(),
      prisma.newsArticle.count(),
      prisma.mediaAsset.count(),
      prisma.newsletterSubscriber.count(),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

    return NextResponse.json({
      success: true,
      telemetry: {
        dbLatencyMs,
        totalUsers,
        totalTickets,
        openTickets,
        totalGames,
        totalArticles,
        totalMedia,
        totalSubscribers,
        serverStatus: "OPERATIONAL",
        databaseStatus: "CONNECTED",
        prismaStatus: "ACTIVE",
        authStatus: "ONLINE",
        smtpStatus: process.env.SMTP_HOST ? "CONFIGURED" : "BYPASSED",
        aiStatus: "ONLINE",
      },
      recentLogs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
