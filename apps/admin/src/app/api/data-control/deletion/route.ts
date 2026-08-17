import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";
import { comparePassword } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const {
      operationLevel, // "LEVEL_1" | "LEVEL_2" | "LEVEL_3"
      subsystem, // "REVOKE_SESSION" | "DELETE_EXPIRED_INVITES" | "PURGE_ANALYTICS" | "PURGE_WEBSITE_EVENTS" | "PURGE_CUSTOMER_DATA" | "PURGE_RECRUITMENT_DATA" | "PURGE_SUPPORT_DATA" | "PURGE_CONTENT_DATA" | "FULL_APPLICATION_DATA_PURGE"
      confirmationPhrase,
      password,
      targetId,
    } = body;

    if (!subsystem) {
      return NextResponse.json({ success: false, error: "Subsystem or target operation is required" }, { status: 400 });
    }

    // LEVEL 2 & 3 Authentication & Confirmation Phrase Verification
    if (operationLevel === "LEVEL_2" || operationLevel === "LEVEL_3") {
      if (!confirmationPhrase || typeof confirmationPhrase !== "string") {
        return NextResponse.json({ success: false, error: "Confirmation phrase is required for sensitive/nuclear operations" }, { status: 400 });
      }

      const expectedPhrases: Record<string, string> = {
        PURGE_CUSTOMER_DATA: "DELETE CUSTOMER DATA",
        PURGE_RECRUITMENT_DATA: "DELETE RECRUITMENT DATA",
        PURGE_SUPPORT_DATA: "DELETE SUPPORT DATA",
        PURGE_CONTENT_DATA: "DELETE CONTENT DATA",
        PURGE_ANALYTICS: "PURGE ANALYTICS",
        PURGE_WEBSITE_EVENTS: "PURGE WEBSITE EVENTS",
        FULL_APPLICATION_DATA_PURGE: "PURGE ALL DRAGON DATA",
      };

      const expected = expectedPhrases[subsystem] || subsystem;
      if (confirmationPhrase.trim().toUpperCase() !== expected.toUpperCase()) {
        return NextResponse.json({
          success: false,
          error: `CONFIRMATION MISMATCH: You must type exact phrase "${expected}".`,
        }, { status: 400 });
      }

      // Password re-authentication check if password is provided
      if (password) {
        const passwordMatches = await comparePassword(password, guard.user.password);
        if (!passwordMatches) {
          return NextResponse.json({ success: false, error: "FRESH AUTHENTICATION FAILED: Incorrect account password." }, { status: 401 });
        }
      }
    }

    let affectedCount = 0;
    let operationSummary = "";

    // 1. LEVEL 1 OPERATIONS
    if (subsystem === "REVOKE_SESSION" && targetId) {
      const targetSession = await prisma.session.findUnique({ where: { id: targetId } });
      if (targetSession) {
        await prisma.session.delete({ where: { id: targetId } });
        affectedCount = 1;
        operationSummary = `Revoked Admin Session ${targetId}`;
      }
    } else if (subsystem === "DELETE_EXPIRED_INVITES") {
      const res = await prisma.teamInvitation.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      affectedCount = res.count;
      operationSummary = `Deleted ${res.count} expired recruitment invitation tokens`;
    }

    // 2. LEVEL 2 & 3 SUBSYSTEM PURGES
    else if (subsystem === "PURGE_ANALYTICS" || subsystem === "PURGE_WEBSITE_EVENTS") {
      const [resEvents, resSessions] = await prisma.$transaction([
        prisma.analyticsEvent.deleteMany(),
        prisma.analyticsSession.deleteMany(),
      ]);
      affectedCount = resEvents.count + resSessions.count;
      operationSummary = `Purged ${resEvents.count} analytics events and ${resSessions.count} analytics sessions.`;
    }

    else if (subsystem === "PURGE_CUSTOMER_DATA" || subsystem === "PURGE_SUPPORT_DATA") {
      const [resContact, resMessages, resReplies, resTickets] = await prisma.$transaction([
        prisma.contactTicket.deleteMany(),
        prisma.ticketMessage.deleteMany(),
        prisma.ticketReply.deleteMany(),
        prisma.ticket.deleteMany(),
      ]);
      affectedCount = resContact.count + resMessages.count + resReplies.count + resTickets.count;
      operationSummary = `Purged ${affectedCount} customer support records (${resContact.count} contact tickets, ${resTickets.count} admin tickets).`;
    }

    else if (subsystem === "PURGE_RECRUITMENT_DATA") {
      const [resApps, resInvs] = await prisma.$transaction([
        prisma.teamApplication.deleteMany(),
        prisma.teamInvitation.deleteMany({ where: { status: { not: "ACCEPTED" } } }),
      ]);
      affectedCount = resApps.count + resInvs.count;
      operationSummary = `Purged ${resApps.count} career applications and ${resInvs.count} invitation keys.`;
    }

    else if (subsystem === "PURGE_CONTENT_DATA") {
      const [resRevisions] = await prisma.$transaction([
        prisma.contentRevision.deleteMany(),
      ]);
      affectedCount = resRevisions.count;
      operationSummary = `Purged ${resRevisions.count} historical CMS revision snapshots. Core pages & games preserved.`;
    }

    else if (subsystem === "FULL_APPLICATION_DATA_PURGE") {
      // NUCLEAR PURGE: Dependency-aware execution order
      // SECURITY ROOT PROTECTION: Explicitly exclude protected Owners, User credentials, and AuditLog records
      const [
        resEvents,
        resSessions,
        resContact,
        resTickets,
        resApps,
        resInvs,
        resRevisions,
        resNonOwnerUsers,
      ] = await prisma.$transaction([
        prisma.analyticsEvent.deleteMany(),
        prisma.analyticsSession.deleteMany(),
        prisma.contactTicket.deleteMany(),
        prisma.ticket.deleteMany(),
        prisma.teamApplication.deleteMany(),
        prisma.teamInvitation.deleteMany({ where: { status: { not: "ACCEPTED" } } }),
        prisma.contentRevision.deleteMany(),
        // Delete ONLY non-owner, non-protected users to protect the security root
        prisma.user.deleteMany({
          where: {
            role: { not: "OWNER" },
            isProtected: false,
          },
        }),
      ]);

      affectedCount =
        resEvents.count +
        resSessions.count +
        resContact.count +
        resTickets.count +
        resApps.count +
        resInvs.count +
        resRevisions.count +
        resNonOwnerUsers.count;

      operationSummary = `Full Application Data Purge completed cleanly: ${affectedCount} records purged across analytics, support, recruitment, and non-owner workforce. Protected Owners & Security Root INTACT.`;
    }

    else {
      return NextResponse.json({ success: false, error: "Unsupported deletion operation or subsystem target" }, { status: 400 });
    }

    // Record immutable audit log
    await prisma.auditLog.create({
      data: {
        userId: guard.user.id,
        userEmail: guard.user.email,
        action: `DELETION_EXECUTE_${subsystem}`,
        resource: "DATA_CONTROL",
        details: `Owner ${guard.user.email} executed [${subsystem}] (Level: ${operationLevel || "LEVEL_1"}). Result: ${operationSummary}`,
      },
    }).catch((e) => console.warn("AuditLog error:", e));

    return NextResponse.json({
      success: true,
      subsystem,
      affectedCount,
      summary: operationSummary,
      executedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
