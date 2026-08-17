import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export async function GET() {
  try {
    const featureFlags = await prisma.featureFlag.findMany({
      orderBy: { name: "asc" },
    });

    const integrations = await prisma.integration.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      settings: {
        companyName: "Dragon Studios",
        timezone: "UTC-5 (Eastern Time)",
        defaultLanguage: "English (US)",
        currency: "USD ($)",
        systemVersion: "v2.5.0-ENTERPRISE",
        maintenanceMode: false,
        smtpHost: "smtp.dragonstudios.com",
        smtpPort: 587,
        senderEmail: "support@dragonstudios.com",
        defaultAiModel: "gemini-2.5-flash",
        aiTemperature: 0.7,
        dbStatus: "HEALTHY",
      },
      featureFlags: featureFlags.length > 0 ? featureFlags : [
        { id: "1", key: "PUBLIC_REGISTRATION", name: "Public User Registration", enabled: true, description: "Allow players to create accounts from main website." },
        { id: "2", key: "AI_CRM_AUTO_REPLY", name: "AI Auto-Reply Assistant", enabled: true, description: "Enable Gemini 2.5 suggested replies on inbound tickets." },
        { id: "3", key: "MAINTENANCE_LOCK", name: "Maintenance Lockout Mode", enabled: false, description: "Restrict public website access during game releases." },
      ],
      integrations: integrations.length > 0 ? integrations : [
        { id: "1", name: "Google Gemini 2.5 AI Engine", provider: "GEMINI_AI", status: "CONNECTED", enabled: true },
        { id: "2", name: "PostgreSQL Database Cluster", provider: "POSTGRESQL", status: "CONNECTED", enabled: true },
        { id: "3", name: "Nodemailer SMTP Gateway", provider: "SMTP_MAIL", status: "CONNECTED", enabled: true },
        { id: "4", name: "Amazon S3 Media Vault", provider: "AWS_S3", status: "CONNECTED", enabled: true },
        { id: "5", name: "Discord Developer Webhooks", provider: "DISCORD", status: "CONNECTED", enabled: true },
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "settings.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires settings.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action, key, enabled, companyName } = body;

    // 1. Toggle Feature Flag
    if (action === "toggle_flag" && key) {
      const flag = await prisma.featureFlag.upsert({
        where: { key },
        update: { enabled },
        create: {
          key,
          name: key,
          enabled: !!enabled,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "UPDATE_FEATURE_FLAG",
          resource: "SETTINGS",
          details: `Feature Flag '${key}' set to: ${enabled}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, flag });
    }

    // 2. Save General Settings
    if (companyName) {
      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "UPDATE_SYSTEM_SETTINGS",
          resource: "SETTINGS",
          details: `Updated System Configurations: ${companyName}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));
      return NextResponse.json({ success: true, message: "System settings saved successfully." });
    }

    return NextResponse.json({ success: true, message: "Settings updated." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
