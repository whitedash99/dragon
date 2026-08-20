import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireAdmin, requireOwner, generateSecureToken, hashToken, recordSecurityAudit } from "@/lib/auth/security";
import { sendEmail } from "@dragon/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin().catch(() => ({ authorized: false, response: null }));
    
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (filterStatus && filterStatus !== "ALL") {
      where.status = filterStatus;
    }

    const invitations = await prisma.teamInvitation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    const applications = await prisma.teamApplication.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    const activeTeamCount = await prisma.user.count({ where: { isDeleted: false, isActive: true } });
    const pendingCount = invitations.filter((i) => i.status === "PENDING" && new Date(i.expiresAt) > new Date()).length;
    const expiredCount = invitations.filter((i) => i.status === "EXPIRED" || (i.status === "PENDING" && new Date(i.expiresAt) <= new Date())).length;
    const revokedCount = invitations.filter((i) => i.status === "REVOKED").length;

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: {
          in: [
            "INVITATION_CREATED",
            "INVITATION_SENT",
            "INVITATION_REVOKED",
            "INVITATION_ACCEPTED",
            "PASSKEY_REGISTERED",
            "APPLICATION_CREATED",
            "APPLICATION_REVIEWED",
            "APPLICATION_APPROVED",
            "APPLICATION_REJECTED",
            "APPLICATION_INFO_REQUESTED",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return NextResponse.json({
      success: true,
      telemetry: {
        activeTeamCount,
        pendingCount,
        expiredCount,
        revokedCount,
        applicationsCount: applications.length,
        totalCount: invitations.length,
      },
      applications: applications.map((app) => ({
        id: app.id,
        applicationNumber: app.applicationNumber,
        jobTitle: app.jobTitle,
        department: app.department,
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        phone: app.phone,
        country: app.country,
        portfolioUrl: app.portfolioUrl,
        linkedinUrl: app.linkedinUrl,
        primarySkill: app.primarySkill,
        experience: app.experience,
        whyJoin: app.whyJoin,
        relevantProjects: app.relevantProjects,
        resumeUrl: app.resumeUrl,
        note: app.note,
        status: app.status,
        ownerNotes: app.ownerNotes,
        reviewedBy: app.reviewedBy,
        createdAt: app.createdAt.toISOString(),
      })),
      invitations: invitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        name: inv.name,
        role: inv.role,
        department: inv.department,
        permissions: inv.permissions ? JSON.parse(inv.permissions) : [],
        status: new Date(inv.expiresAt) <= new Date() && inv.status === "PENDING" ? "EXPIRED" : inv.status,
        createdBy: inv.createdBy,
        expiresAt: inv.expiresAt.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      })),
      auditLogs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireOwner();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user: actor } = authResult.context;
    const body = await req.json();
    const { action, id, email, name, role, department, permissions, expirationHours, notes } = body;

    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://dragoncontrol.vercel.app";

    // 1. SET APPLICATION TO UNDER_REVIEW
    if (action === "review_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: { status: "UNDER_REVIEW", reviewedBy: actor.email, reviewedAt: new Date() },
      });

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "APPLICATION_REVIEWED",
        resource: "TEAM_APPLICATIONS",
        details: `Owner ${actor.email} marked candidate application ${updated.applicationNumber || updated.id} as UNDER_REVIEW`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 2. REQUEST MORE INFORMATION FOR APPLICATION
    if (action === "request_info_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: {
          status: "MORE_INFORMATION",
          ownerNotes: notes || "More info requested",
          reviewedBy: actor.email,
          reviewedAt: new Date(),
        },
      });

      await sendEmail({
        to: updated.applicantEmail,
        subject: `Update on your Dragon Studios Application (${updated.applicationNumber || updated.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #050C17; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.3);">
            <h3 style="color: #00f0ff;">Additional Information Requested</h3>
            <p>Hi <strong>${updated.applicantName}</strong>,</p>
            <p>Owner <strong>${actor.name || actor.email}</strong> requested additional information regarding your application for <strong>${updated.jobTitle}</strong>:</p>
            <p style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-family: monospace;">${notes || "Please reply to this email with updated portfolio details."}</p>
          </div>
        `,
      }).catch((e) => console.error("Resend request info error:", e));

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "APPLICATION_INFO_REQUESTED",
        resource: "TEAM_APPLICATIONS",
        details: `Requested info for candidate ${updated.applicantEmail}. Notes: ${notes || "None"}`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 3. APPROVE CANDIDATE TEAM APPLICATION & ISSUE INVITATION
    if (action === "approve_application" && id) {
      const appRecord = await prisma.teamApplication.findUnique({ where: { id } });
      if (!appRecord) {
        return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
      }

      const hours = parseInt(expirationHours || "48", 10);
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      const rawTokenBytes = generateSecureToken();
      const rawToken = `DRG-INV-${rawTokenBytes}`;
      const tokenHash = hashToken(rawToken);

      const targetRole = (role || "DEVELOPER").toUpperCase();
      const targetDept = department || appRecord.department || "Engineering";

      // Revoke any prior pending invites for this email
      await prisma.teamInvitation.updateMany({
        where: { email: appRecord.applicantEmail, status: "PENDING" },
        data: { status: "REVOKED" },
      });

      const invitation = await prisma.teamInvitation.create({
        data: {
          email: appRecord.applicantEmail,
          name: appRecord.applicantName,
          role: targetRole,
          department: targetDept,
          permissions: JSON.stringify(permissions || ["cms.read", "games.read"]),
          tokenHash,
          status: "PENDING",
          createdBy: actor.email,
          expiresAt,
        },
      });

      await prisma.teamApplication.update({
        where: { id },
        data: {
          status: "APPROVED",
          invitationId: invitation.id,
          reviewedBy: actor.email,
          reviewedAt: new Date(),
          ownerNotes: notes || "Application approved by Owner",
        },
      });

      const inviteUrl = `${baseUrl}/auth/accept-invite?token=${rawToken}`;

      await sendEmail({
        to: appRecord.applicantEmail,
        subject: `Application Approved: Welcome to Dragon Studios (${appRecord.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #050C17; color: #ffffff; padding: 36px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 240, 255, 0.3);">
            <h2 style="color: #00f0ff; margin-top: 0;">CONGRATULATIONS — APPLICATION APPROVED</h2>
            <p>Hi <strong>${appRecord.applicantName}</strong>,</p>
            <p>Your application for <strong>${appRecord.jobTitle}</strong> at Dragon Studios has been approved by Owner <strong>${actor.name || actor.email}</strong>.</p>
            <p>You have been issued a single-use staff invitation as <strong>${targetRole}</strong> (${targetDept}).</p>
            <div style="margin: 32px 0;">
              <a href="${inviteUrl}" style="background: #00f0ff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                Accept Invitation & Complete Account Setup →
              </a>
            </div>
            <p style="font-size: 12px; color: #71717a;">This link is single-use, bound to your email, and will expire in ${hours} hours.</p>
          </div>
        `,
      }).catch((e) => console.error("Resend approval error:", e));

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "APPLICATION_APPROVED",
        resource: "TEAM_APPLICATIONS",
        details: `Approved application ${appRecord.applicationNumber || appRecord.id} for ${appRecord.applicantEmail} as ${targetRole}`,
        severity: "MEDIUM",
      });

      return NextResponse.json({ success: true, inviteUrl, rawToken, invitationId: invitation.id });
    }

    // 4. REJECT CANDIDATE TEAM APPLICATION
    if (action === "reject_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: {
          status: "REJECTED",
          ownerNotes: notes || "Application rejected",
          reviewedBy: actor.email,
          reviewedAt: new Date(),
        },
      });

      await sendEmail({
        to: updated.applicantEmail,
        subject: `Update on your Dragon Studios Application (${updated.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #050C17; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <p>Hi <strong>${updated.applicantName}</strong>,</p>
            <p>Thank you for applying to Dragon Studios for the <strong>${updated.jobTitle}</strong> position.</p>
            <p>After careful evaluation of current engineering priorities, we have decided not to proceed with your application at this time.</p>
            <p>We wish you the best in your career pursuits.</p>
          </div>
        `,
      }).catch((e) => console.error("Resend rejection error:", e));

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "APPLICATION_REJECTED",
        resource: "TEAM_APPLICATIONS",
        details: `Rejected application ${updated.applicationNumber || updated.id} for ${updated.applicantEmail}`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 5. DIRECT INVITATION CREATION
    if (action === "create_invitation" && email) {
      const cleanEmail = email.trim().toLowerCase();
      const hours = parseInt(expirationHours || "48", 10);
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      const rawTokenBytes = generateSecureToken();
      const rawToken = `DRG-INV-${rawTokenBytes}`;
      const tokenHash = hashToken(rawToken);

      const targetRole = (role || "DEVELOPER").toUpperCase();
      const targetDept = department || "Engineering";

      // Invalidate existing pending invites for this email
      await prisma.teamInvitation.updateMany({
        where: { email: cleanEmail, status: "PENDING" },
        data: { status: "REVOKED" },
      });

      const invitation = await prisma.teamInvitation.create({
        data: {
          email: cleanEmail,
          name: name ? name.trim() : cleanEmail.split("@")[0],
          role: targetRole,
          department: targetDept,
          permissions: JSON.stringify(permissions || ["cms.read", "games.read"]),
          tokenHash,
          status: "PENDING",
          createdBy: actor.email,
          expiresAt,
        },
      });

      const inviteUrl = `${baseUrl}/auth/accept-invite?token=${rawToken}`;

      await sendEmail({
        to: cleanEmail,
        subject: "Invitation to join Dragon Studios Enterprise Staff",
        html: `
          <div style="font-family: Arial, sans-serif; background: #050C17; color: #ffffff; padding: 36px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 240, 255, 0.3);">
            <h2 style="color: #00f0ff; margin-top: 0;">DRAGON STUDIOS — ADMINISTRATIVE INVITATION</h2>
            <p>Hello <strong>${name || cleanEmail}</strong>,</p>
            <p>You have been issued an official invitation by <strong>${actor.name || actor.email}</strong> to join as <strong>${targetRole}</strong> (${targetDept}).</p>
            <div style="margin: 32px 0;">
              <a href="${inviteUrl}" style="background: #00f0ff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                ACCEPT INVITATION & COMPLETE ACCOUNT SETUP →
              </a>
            </div>
            <p style="color: #71717a; font-size: 12px;">Link is single-use, bound to your email, and will expire in ${hours} hours.</p>
          </div>
        `,
      }).catch((e) => console.error("Resend invite error:", e));

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "INVITATION_CREATED",
        resource: "TEAM_INVITATIONS",
        details: `Created direct invitation for ${cleanEmail} as ${targetRole}`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, inviteUrl, rawToken, invitationId: invitation.id });
    }

    // 6. REVOKE INVITATION
    if (action === "revoke_invitation" && id) {
      const revoked = await prisma.teamInvitation.update({
        where: { id },
        data: { status: "REVOKED" },
      });

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "INVITATION_REVOKED",
        resource: "TEAM_INVITATIONS",
        details: `Revoked invitation for ${revoked.email} by ${actor.email}`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, invitation: revoked });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
