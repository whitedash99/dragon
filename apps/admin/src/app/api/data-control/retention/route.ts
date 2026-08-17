import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oneEightyDaysAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    const [
      expiredSessions,
      expiredInvitations,
      oldAnalyticsEvents,
      oldRevisions,
      oldEmailLogs,
    ] = await Promise.all([
      prisma.session.count({ where: { expiresAt: { lt: new Date() } } }).catch(() => 0),
      prisma.teamInvitation.count({ where: { expiresAt: { lt: new Date() } } }).catch(() => 0),
      prisma.analyticsEvent.count({ where: { createdAt: { lt: ninetyDaysAgo } } }).catch(() => 0),
      prisma.contentRevision.count({ where: { createdAt: { lt: oneEightyDaysAgo } } }).catch(() => 0),
      prisma.emailLog.count({ where: { createdAt: { lt: ninetyDaysAgo } } }).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      retentionPolicies: [
        { dataset: "Sessions", policy: "7 Days (Auto-expire)", eligibleForPurge: expiredSessions, status: "ENFORCED" },
        { dataset: "TeamInvitations", policy: "7 Days (Auto-expire)", eligibleForPurge: expiredInvitations, status: "ENFORCED" },
        { dataset: "AnalyticsEvents", policy: "90 Days Retention", eligibleForPurge: oldAnalyticsEvents, status: "CONFIGURED" },
        { dataset: "EmailLogs", policy: "90 Days Retention", eligibleForPurge: oldEmailLogs, status: "CONFIGURED" },
        { dataset: "ContentRevisions", policy: "180 Days Retention", eligibleForPurge: oldRevisions, status: "CONFIGURED" },
        { dataset: "AuditLogs", policy: "Mandatory 365 Days", eligibleForPurge: 0, status: "MANDATORY_RETENTION" },
        { dataset: "Protected Owners", policy: "Permanent / Indefinite", eligibleForPurge: 0, status: "PROTECTED_ROOT" },
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const { action, dataset } = body;

    if (action === "purge_expired") {
      let purgedCount = 0;
      let targetName = "";

      if (dataset === "Sessions") {
        const deleted = await prisma.session.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        });
        purgedCount = deleted.count;
        targetName = "Expired Sessions";
      } else if (dataset === "TeamInvitations") {
        const deleted = await prisma.teamInvitation.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        });
        purgedCount = deleted.count;
        targetName = "Expired Team Invitations";
      } else if (dataset === "AnalyticsEvents") {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const deleted = await prisma.analyticsEvent.deleteMany({
          where: { createdAt: { lt: ninetyDaysAgo } },
        });
        purgedCount = deleted.count;
        targetName = "Analytics Events older than 90 days";
      } else if (dataset === "EmailLogs") {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const deleted = await prisma.emailLog.deleteMany({
          where: { createdAt: { lt: ninetyDaysAgo } },
        });
        purgedCount = deleted.count;
        targetName = "Email Logs older than 90 days";
      } else {
        return NextResponse.json({ success: false, error: "Invalid dataset or retention policy" }, { status: 400 });
      }

      await prisma.auditLog.create({
        data: {
          userId: guard.user.id,
          userEmail: guard.user.email,
          action: "RETENTION_PURGE_EXECUTE",
          resource: "DATA_CONTROL",
          details: `Owner ${guard.user.email} executed retention purge on [${targetName}]: ${purgedCount} record(s) purged.`,
        },
      }).catch((e) => console.warn("AuditLog error:", e));

      return NextResponse.json({
        success: true,
        message: `Retention purge complete. Purged ${purgedCount} record(s) from ${targetName}.`,
        purgedCount,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
