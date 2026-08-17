import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const fetchDatasetMeta = async (
      modelName: string,
      description: string,
      retentionPolicy: string,
      deletionCapability: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "RESTRICTED",
      exportCapability: boolean,
      archiveCapability: boolean,
      countQuery: () => Promise<number>,
      oldestQuery: () => Promise<Date | null>,
      newestQuery: () => Promise<Date | null>
    ) => {
      try {
        const [records, oldestDate, newestDate] = await Promise.all([
          countQuery().catch(() => 0),
          oldestQuery().catch(() => null),
          newestQuery().catch(() => null),
        ]);

        return {
          id: modelName.toLowerCase(),
          dataset: modelName,
          description,
          records,
          oldestRecord: oldestDate ? oldestDate.toISOString() : null,
          newestRecord: newestDate ? newestDate.toISOString() : null,
          retentionPolicy,
          deletionCapability,
          exportCapability,
          archiveCapability,
        };
      } catch {
        return {
          id: modelName.toLowerCase(),
          dataset: modelName,
          description,
          records: 0,
          oldestRecord: null,
          newestRecord: null,
          retentionPolicy,
          deletionCapability,
          exportCapability,
          archiveCapability,
        };
      }
    };

    const datasets = await Promise.all([
      fetchDatasetMeta(
        "Users",
        "Staff identities, executive owner accounts & RBAC entitlements",
        "PERMANENT / INDEFINITE",
        "RESTRICTED",
        true,
        true,
        () => prisma.user.count(),
        async () => (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.user.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "Sessions",
        "Active DIP admin authentication tokens & session cookies",
        "EXPIRES AFTER 7 DAYS",
        "LEVEL_1",
        false,
        false,
        () => prisma.session.count(),
        async () => (await prisma.session.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.session.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "Passkeys",
        "WebAuthn hardware authenticator public credentials",
        "ACTIVE SESSIONS",
        "LEVEL_2",
        false,
        false,
        () => prisma.passkeyCredential.count(),
        async () => (await prisma.passkeyCredential.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.passkeyCredential.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "UserDevices",
        "Trusted hardware browsers & IP fingerprint registrations",
        "90 DAYS INACTIVITY",
        "LEVEL_1",
        false,
        false,
        () => prisma.userDevice.count(),
        async () => (await prisma.userDevice.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.userDevice.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "TeamApplications",
        "Recruitment candidate submissions & portfolios",
        "365 DAYS RETENTION",
        "LEVEL_2",
        true,
        true,
        () => prisma.teamApplication.count(),
        async () => (await prisma.teamApplication.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.teamApplication.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "TeamInvitations",
        "Single-use cryptographic recruitment invitation tokens",
        "EXPIRES AFTER 7 DAYS",
        "LEVEL_1",
        true,
        false,
        () => prisma.teamInvitation.count(),
        async () => (await prisma.teamInvitation.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.teamInvitation.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "ContactTickets",
        "Public website contact submissions & AI support requests",
        "180 DAYS RETENTION",
        "LEVEL_2",
        true,
        true,
        () => prisma.contactTicket.count(),
        async () => (await prisma.contactTicket.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.contactTicket.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "Tickets",
        "Admin desk support tickets, notes & agent replies",
        "180 DAYS RETENTION",
        "LEVEL_2",
        true,
        true,
        () => prisma.ticket.count(),
        async () => (await prisma.ticket.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.ticket.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "EmailLogs",
        "Resend email dispatch status & delivery logs",
        "90 DAYS RETENTION",
        "LEVEL_1",
        true,
        false,
        () => prisma.emailLog.count(),
        async () => (await prisma.emailLog.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.emailLog.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "AuditLogs",
        "Immutable administrative security audit trail",
        "MANDATORY 365 DAYS",
        "RESTRICTED",
        true,
        true,
        () => prisma.auditLog.count(),
        async () => (await prisma.auditLog.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.auditLog.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "ContentBlocks",
        "CMS page section text, hero blocks & metadata",
        "PERMANENT / REVISIONED",
        "LEVEL_2",
        true,
        true,
        () => prisma.contentBlock.count(),
        async () => (await prisma.contentBlock.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.contentBlock.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "ContentRevisions",
        "CMS historical page block version snapshots",
        "180 DAYS RETENTION",
        "LEVEL_1",
        true,
        false,
        () => prisma.contentRevision.count(),
        async () => (await prisma.contentRevision.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.contentRevision.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "GameContent",
        "AAA Game titles, platforms, patch notes & DLC metadata",
        "PERMANENT",
        "LEVEL_2",
        true,
        true,
        () => prisma.gameContent.count(),
        async () => (await prisma.gameContent.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.gameContent.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "AnalyticsEvents",
        "Real-time website traffic events & CTA clicks",
        "90 DAYS RETENTION",
        "LEVEL_1",
        true,
        true,
        () => prisma.analyticsEvent.count(),
        async () => (await prisma.analyticsEvent.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.analyticsEvent.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
      fetchDatasetMeta(
        "AnalyticsSessions",
        "Public web visitor session durations & page view counts",
        "90 DAYS RETENTION",
        "LEVEL_1",
        true,
        false,
        () => prisma.analyticsSession.count(),
        async () => (await prisma.analyticsSession.findFirst({ orderBy: { createdAt: "asc" } }))?.createdAt || null,
        async () => (await prisma.analyticsSession.findFirst({ orderBy: { createdAt: "desc" } }))?.createdAt || null
      ),
    ]);

    return NextResponse.json({
      success: true,
      inventory: datasets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
