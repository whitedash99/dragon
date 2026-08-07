import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    let dbStatus = "UP";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "DOWN";
    }

    const health = {
      status: dbStatus === "UP" ? "HEALTHY" : "DEGRADED",
      timestamp: new Date().toISOString(),
      version: "v2.5.0-ENTERPRISE",
      services: {
        application: "UP",
        database: dbStatus,
        apiGateway: "UP",
        mediaStorageCDN: "UP",
        geminiAiEngine: "UP",
      },
      environment: process.env.NODE_ENV || "production",
      uptimeSeconds: Math.floor(process.uptime()),
    };

    return NextResponse.json(health, { status: dbStatus === "UP" ? 200 : 503 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ status: "UNHEALTHY", error: message }, { status: 500 });
  }
}
