import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { sendEmail } from "@dragon/email";

export const dynamic = "force-dynamic";

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["OWNER", "FOUNDER", "CO_FOUNDER"].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Dragon Team Key Portal is restricted strictly to Owners." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (filterStatus && filterStatus !== "ALL") {
      where.status = filterStatus;
    }

    const invitations = await prisma.teamInvitation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const applications = await prisma.teamApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

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
      take: 20,
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
        portfolioUrl: app.portfolioUrl,
        linkedinUrl: app.linkedinUrl,
        primarySkill: app.primarySkill,
        experience: app.experience,
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
    const auth = await getAuthenticatedUser();
    if (!auth || !["OWNER", "FOUNDER", "CO_FOUNDER"].includes(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Dragon Team Key Portal is restricted strictly to Owners." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, id, email, name, role, department, permissions, expirationHours, notes } = body;

    // 1. SET APPLICATION TO UNDER_REVIEW
    if (action === "review_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: { status: "UNDER_REVIEW", reviewedBy: auth.user.email, reviewedAt: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "APPLICATION_REVIEWED",
          resource: "TEAM_APPLICATIONS",
          details: `Owner ${auth.user.email} marked application ${updated.applicationNumber || updated.id} UNDER_REVIEW.`,
        },
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 2. REQUEST MORE INFORMATION FOR APPLICATION
    if (action === "request_info_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: { status: "MORE_INFORMATION", ownerNotes: notes || "More info requested", reviewedBy: auth.user.email, reviewedAt: new Date() },
      });

      await sendEmail({
        to: updated.applicantEmail,
        subject: `Update on your Dragon Studios Application (${updated.applicationNumber || updated.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 32px; border-radius: 12px;">
            <h3 style="color: #38bdf8;">Additional Information Requested</h3>
            <p>Hi <strong>${updated.applicantName}</strong>,</p>
            <p>Owner <strong>${auth.user.name || auth.user.email}</strong> requested additional information regarding your application for <strong>${updated.jobTitle}</strong>:</p>
            <p style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">${notes || "Please reply to this email with updated portfolio details."}</p>
          </div>
        `,
      }).catch((e) => console.error("Resend request info error:", e));

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "APPLICATION_INFO_REQUESTED",
          resource: "TEAM_APPLICATIONS",
          details: `Requested info for application ${updated.applicantEmail}. Notes: ${notes || "None"}`,
        },
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 3. APPROVE CANDIDATE TEAM APPLICATION
    if (action === "approve_application" && id) {
      const appRecord = await prisma.teamApplication.findUnique({ where: { id } });
      if (!appRecord) {
        return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
      }

      const hours = parseInt(expirationHours || "24", 10);
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      const rawTokenBytes = crypto.randomBytes(32).toString("hex");
      const rawToken = `DRG-INV-${rawTokenBytes}`;
      const tokenHash = hashToken(rawToken);

      const invitation = await prisma.teamInvitation.create({
        data: {
          email: appRecord.applicantEmail,
          name: appRecord.applicantName,
          role: role || "DEVELOPER",
          department: appRecord.department || "Engineering",
          permissions: JSON.stringify(permissions || ["cms.read", "games.read"]),
          tokenHash,
          status: "PENDING",
          createdBy: auth.user.email,
          expiresAt,
        },
      });

      await prisma.teamApplication.update({
        where: { id },
        data: { status: "APPROVED", invitationId: invitation.id, reviewedBy: auth.user.email, reviewedAt: new Date() },
      });

      const inviteUrl = `http://localhost:4000/auth/accept-invite?token=${rawToken}`;

      await sendEmail({
        to: appRecord.applicantEmail,
        subject: `Application Approved: Welcome to Dragon Studios (${appRecord.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 36px; border-radius: 16px; max-w: 600px; margin: 0 auto;">
            <h2 style="color: #ffffff;">CONGRATULATIONS — APPLICATION APPROVED</h2>
            <p>Hi <strong>${appRecord.applicantName}</strong>,</p>
            <p>Your application for <strong>${appRecord.jobTitle}</strong> at Dragon Studios has been approved by Owner <strong>${auth.user.name || auth.user.email}</strong>.</p>
            <div style="margin: 32px 0;">
              <a href="${inviteUrl}" style="background: #ffffff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                Accept Invitation & Complete Account Setup →
              </a>
            </div>
            <p style="font-size: 12px; color: #71717a;">This link is single-use, bound to your email, and will expire in ${hours} hours.</p>
          </div>
        `,
      }).catch((e) => console.error("Resend approval error:", e));

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "APPLICATION_APPROVED",
          resource: "TEAM_APPLICATIONS",
          details: `Approved application ${appRecord.applicationNumber || appRecord.id} for ${appRecord.applicantEmail} as ${role || "DEVELOPER"}.`,
        },
      });

      return NextResponse.json({ success: true, inviteUrl, rawToken, invitationId: invitation.id });
    }

    // 4. REJECT CANDIDATE TEAM APPLICATION
    if (action === "reject_application" && id) {
      const updated = await prisma.teamApplication.update({
        where: { id },
        data: { status: "REJECTED", ownerNotes: notes || "Application rejected", reviewedBy: auth.user.email, reviewedAt: new Date() },
      });

      await sendEmail({
        to: updated.applicantEmail,
        subject: `Update on your Dragon Studios Application (${updated.jobTitle})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 32px; border-radius: 12px;">
            <p>Hi <strong>${updated.applicantName}</strong>,</p>
            <p>Thank you for applying to Dragon Studios for the <strong>${updated.jobTitle}</strong> position.</p>
            <p>After careful evaluation of current engineering priorities, we have decided not to proceed with your application at this time.</p>
          </div>
        `,
      }).catch((e) => console.error("Resend reject error:", e));

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "APPLICATION_REJECTED",
          resource: "TEAM_APPLICATIONS",
          details: `Rejected application ${updated.applicantEmail} for ${updated.jobTitle}.`,
        },
      });

      return NextResponse.json({ success: true, application: updated });
    }

    // 5. DIRECT OWNER INVITATION
    if (action === "create_invitation" || (!action && email)) {
      if (!email || !email.includes("@")) {
        return NextResponse.json({ success: false, error: "Valid email address required." }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const hours = parseInt(expirationHours || "24", 10);
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      const rawTokenBytes = crypto.randomBytes(32).toString("hex");
      const rawToken = `DRG-INV-${rawTokenBytes}`;
      const tokenHash = hashToken(rawToken);

      const permsJson = Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify([]);

      const invitation = await prisma.teamInvitation.create({
        data: {
          email: cleanEmail,
          name: name ? name.trim() : cleanEmail.split("@")[0],
          role: role || "DEVELOPER",
          department: department || "Engineering",
          permissions: permsJson,
          tokenHash,
          status: "PENDING",
          createdBy: auth.user.email,
          expiresAt,
        },
      });

      const inviteUrl = `http://localhost:4000/auth/accept-invite?token=${rawToken}`;

      const dispatchRes = await sendEmail({
        to: cleanEmail,
        subject: `Exclusive Invitation to join Dragon Studios (${role || "DEVELOPER"})`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 36px; border-radius: 16px; max-w: 600px; margin: 0 auto;">
            <div style="font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 24px;">
              DRAGON STUDIOS — TEAM INVITATION
            </div>
            <p style="font-size: 14px; color: #d4d4d8;">
              Hello <strong>${name || cleanEmail}</strong>,
            </p>
            <p style="font-size: 14px; color: #d4d4d8;">
              You have been issued a single-use Dragon Team Invitation by Owner <strong>${auth.user.name || auth.user.email}</strong> to join Dragon Studios as <strong>${role || "DEVELOPER"}</strong>.
            </p>
            <div style="margin: 32px 0;">
              <a href="${inviteUrl}" style="background: #ffffff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                Accept Invitation & Set Up Account →
              </a>
            </div>
          </div>
        `,
      }).catch((e) => ({ success: false, error: e }));

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "INVITATION_CREATED",
          resource: "TEAM_KEY_PORTAL",
          details: `Issued single-use invitation for ${cleanEmail} as ${role}. Expires in ${hours}h.`,
        },
      });

      return NextResponse.json({
        success: true,
        invitationId: invitation.id,
        inviteUrl,
        rawToken,
        dispatched: dispatchRes.success,
      });
    }

    // 6. REVOKE INVITATION
    if (action === "revoke_invitation" && id) {
      const updated = await prisma.teamInvitation.update({
        where: { id },
        data: { status: "REVOKED" },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "INVITATION_REVOKED",
          resource: "TEAM_KEY_PORTAL",
          details: `Owner ${auth.user.email} revoked invitation for ${updated.email}`,
        },
      });

      return NextResponse.json({ success: true, invitation: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
