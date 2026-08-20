import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireAdmin, checkRateLimit, generateSecureToken, hashToken, recordSecurityAudit } from "@/lib/auth/security";
import { sendEmail } from "@dragon/email";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user: actor } = authResult.context;

    // Rate Limiting: max 10 invitation requests per 15 minutes per administrator
    const rateLimit = checkRateLimit(`invite_${actor.id}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait before creating more invitations." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, name, role, department, permissions } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid corporate email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser && existingUser.status === "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "An active user with this email address already exists." },
        { status: 409 }
      );
    }

    // Role assignment security guard: Only Owners can invite other Owners or Admins
    const targetRole = (role || "EDITOR").toUpperCase();
    const actorRole = actor.role.toUpperCase();
    const isActorOwner = ["OWNER", "FOUNDER", "BREAK_GLASS"].includes(actorRole);

    if (["OWNER", "FOUNDER", "SUPER_ADMIN", "ADMIN"].includes(targetRole) && !isActorOwner) {
      return NextResponse.json(
        { success: false, error: "403 Forbidden: Only verified Owners can issue Owner or Admin invitations." },
        { status: 403 }
      );
    }

    const hours = 48;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const rawTokenBytes = generateSecureToken();
    const rawToken = `DRG-INV-${rawTokenBytes}`;
    const tokenHash = hashToken(rawToken);

    const permsJson = Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify([]);

    // Invalidate any prior pending invitations for this email
    await prisma.teamInvitation.updateMany({
      where: { email: cleanEmail, status: "PENDING" },
      data: { status: "REVOKED" },
    });

    const invitation = await prisma.teamInvitation.create({
      data: {
        email: cleanEmail,
        name: name ? name.trim() : cleanEmail.split("@")[0],
        role: targetRole,
        department: department || "Engineering",
        permissions: permsJson,
        tokenHash,
        status: "PENDING",
        createdBy: actor.email,
        expiresAt,
      },
    });

    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://dragoncontrol.vercel.app";
    const inviteUrl = `${baseUrl}/auth/accept-invite?token=${rawToken}`;

    await sendEmail({
      to: cleanEmail,
      subject: "Invitation to join Dragon Studios Enterprise Staff",
      html: `
        <div style="font-family: Arial, sans-serif; background: #050C17; color: #ffffff; padding: 36px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(0, 240, 255, 0.3);">
          <h2 style="color: #00f0ff; margin-top: 0;">DRAGON STUDIOS — ADMINISTRATIVE INVITATION</h2>
          <p>Hello <strong>${name || cleanEmail}</strong>,</p>
          <p>You have been issued a single-use Dragon Control OS invitation by <strong>${actor.name || actor.email}</strong> to join as <strong>${targetRole}</strong> (${department || "Engineering"}).</p>
          <div style="margin: 32px 0;">
            <a href="${inviteUrl}" style="background: #00f0ff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
              ACCEPT INVITATION & COMPLETE ACCOUNT SETUP →
            </a>
          </div>
          <p style="color: #71717a; font-size: 12px;">Link is single-use, cryptographically bound to your email, and will expire in ${hours} hours.</p>
        </div>
      `,
    }).catch((e: unknown) => console.warn("Email dispatch warning:", e));

    await recordSecurityAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "INVITATION_CREATED",
      resource: "ADMIN_INVITE",
      details: `Issued single-use invitation for ${cleanEmail} as ${targetRole} (${department || "Engineering"})`,
      severity: "LOW",
    });

    return NextResponse.json({
      success: true,
      message: `Single-use SHA-256 hashed invitation dispatched to ${cleanEmail}`,
      invitationId: invitation.id,
      inviteUrl,
      rawToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
