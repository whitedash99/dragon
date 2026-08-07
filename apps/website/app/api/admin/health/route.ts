import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "OFFLINE";
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
    dbStatus = "OPERATIONAL";
  } catch (e) {
    dbStatus = "ERROR";
  }

  // Check Environment Variables
  const envCheck = {
    databaseUrl: !!process.env.DATABASE_URL,
    geminiApiKey: !!process.env.GEMINI_API_KEY,
    smtpHost: !!process.env.SMTP_HOST || !!process.env.RESEND_API_KEY,
    contactEmail: !!process.env.CONTACT_EMAIL,
    nodeEnv: process.env.NODE_ENV || "development",
  };

  // Check Database Counts
  let counts = {
    games: 0,
    articles: 0,
    users: 0,
    tickets: 0,
    auditLogs: 0,
    contentBlocks: 0,
  };

  if (dbStatus === "OPERATIONAL") {
    try {
      const [games, articles, users, tickets, auditLogs, contentBlocks] = await Promise.all([
        prisma.game.count(),
        prisma.article.count(),
        prisma.user.count(),
        prisma.contactTicket.count(),
        prisma.auditLog.count(),
        prisma.contentBlock.count(),
      ]);
      counts = { games, articles, users, tickets, auditLogs, contentBlocks };
    } catch (e) {
      console.error("Health query error", e);
    }
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    dbStatus,
    dbLatency: `${dbLatency}ms`,
    responseTime: `${responseTime}ms`,
    nodeVersion: process.version,
    platform: process.platform,
    envCheck,
    counts,
    services: {
      database: dbStatus,
      prisma: dbStatus === "OPERATIONAL" ? "OPERATIONAL" : "DEGRADED",
      geminiAi: envCheck.geminiApiKey ? "CONFIGURED" : "NOT_CONFIGURED",
      emailService: envCheck.smtpHost ? "CONFIGURED" : "DEFAULT_TRANSPORT",
      contactSystem: "OPERATIONAL",
    },
  });
}
