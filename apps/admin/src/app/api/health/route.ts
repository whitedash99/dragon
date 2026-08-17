import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    let dbStatus = "HEALTHY";
    let dbLatencyMs = 0;
    const startDb = Date.now();

    try {
      await prisma.$queryRaw`SELECT 1`.catch(() => prisma.$queryRaw`SELECT 1`);
      dbLatencyMs = Math.max(1, Date.now() - startDb);
    } catch {
      dbStatus = "UNHEALTHY";
    }

    const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_"));
    const googleOauthConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const webauthnConfigured = Boolean(process.env.WEBAUTHN_RP_ID || process.env.NEXTAUTH_URL);

    const isDegraded = dbStatus === "HEALTHY" && (!resendConfigured || !googleOauthConfigured);

    const overallStatus = dbStatus === "UNHEALTHY" ? "UNHEALTHY" : isDegraded ? "DEGRADED" : "HEALTHY";

    const health = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: "v2.5.0-ENTERPRISE",
      services: {
        database: {
          status: dbStatus,
          provider: "Neon PostgreSQL",
          latencyMs: dbLatencyMs,
        },
        emailGateway: {
          status: resendConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
          provider: "Resend",
        },
        googleOAuth: {
          status: googleOauthConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
        },
        webauthnPasskeys: {
          status: webauthnConfigured ? "CONFIGURED" : "DEFAULT",
        },
        application: {
          status: "HEALTHY",
          uptimeSeconds: Math.floor(process.uptime()),
          environment: process.env.NODE_ENV || "development",
        },
      },
    };

    return NextResponse.json(health, { status: dbStatus === "HEALTHY" ? 200 : 503 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ status: "UNHEALTHY", error: message }, { status: 500 });
  }
}
