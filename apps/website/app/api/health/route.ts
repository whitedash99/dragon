import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "UNAVAILABLE";
  let dbLatency: number | null = null;

  try {
    const dbPingStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbPingStart;
    dbStatus = "OPERATIONAL";
  } catch (error: any) {
    console.error("[Health API] Database check failed:", error?.message || error);
    dbStatus = "UNAVAILABLE";
    dbLatency = null;
  }

  const isHealthy = dbStatus === "OPERATIONAL";
  const overallStatus = isHealthy ? "HEALTHY" : "DEGRADED";
  const httpStatus = isHealthy ? 200 : 503;

  const healthData = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    engine: "Dragon Core Engine",
    version: "v1.0.0-production",
    uptimeSeconds: Math.floor(process.uptime()),
    diagnostics: {
      database: dbStatus === "OPERATIONAL" ? "operational" : "unavailable",
      latency: dbLatency !== null ? `${dbLatency}ms` : null,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      },
    },
    services: {
      auth: "OPERATIONAL",
      dragonId: isHealthy ? "OPERATIONAL" : "DEGRADED",
      leaderboards: isHealthy ? "OPERATIONAL" : "DEGRADED",
      gameSessions: isHealthy ? "OPERATIONAL" : "DEGRADED",
    },
  };

  return NextResponse.json(healthData, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
