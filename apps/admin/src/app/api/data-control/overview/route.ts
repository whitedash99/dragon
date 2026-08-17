import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const [
      totalUsers,
      activeUsers,
      teamMembers,
      careerApplications,
      contactTickets,
      supportTickets,
      contentBlocksCount,
      pagesCount,
      gamesCount,
      websiteEventsCount,
      analyticsSessionsCount,
      auditEventsCount,
      activeSessionsCount,
      pendingInvitationsCount,
    ] = await Promise.all([
      prisma.user.count().catch(() => null),
      prisma.user.count({ where: { isActive: true, isDeleted: false } }).catch(() => null),
      prisma.user.count({ where: { role: { in: ["OWNER", "FOUNDER", "CO_FOUNDER", "ADMIN", "DEVELOPER", "SUPPORT_LEAD", "CMS_EDITOR"] }, isDeleted: false } }).catch(() => null),
      prisma.teamApplication.count().catch(() => null),
      prisma.contactTicket.count().catch(() => null),
      prisma.ticket.count().catch(() => null),
      prisma.contentBlock.count().catch(() => null),
      prisma.page.count().catch(() => null),
      prisma.gameContent.count().catch(() => null),
      prisma.analyticsEvent.count().catch(() => null),
      prisma.analyticsSession.count().catch(() => null),
      prisma.auditLog.count().catch(() => null),
      prisma.session.count({ where: { expiresAt: { gte: new Date() } } }).catch(() => null),
      prisma.teamInvitation.count({ where: { status: "PENDING" } }).catch(() => null),
    ]);

    const cmsRecords = contentBlocksCount !== null && pagesCount !== null ? contentBlocksCount + pagesCount : null;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        teamMembers,
        careerApplications,
        contactTickets,
        supportTickets,
        cmsRecords,
        games: gamesCount,
        websiteEvents: websiteEventsCount,
        analyticsSessions: analyticsSessionsCount,
        auditEvents: auditEventsCount,
        activeSessions: activeSessionsCount,
        pendingInvitations: pendingInvitationsCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
