import { NextResponse } from "next/server";

export async function GET() {
  const healthData = {
    status: "STATUS_OPERATIONAL",
    timestamp: new Date().toISOString(),
    engine: "Dragon Engine",
    version: "v1.0.0-production",
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
    clusters: {
      asiaPacific: "100% HEALTHY",
      northAmerica: "100% HEALTHY",
      europe: "100% HEALTHY",
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
