import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { sendEmail } from "@dragon/email";

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["SUPER_ADMIN", "ADMINISTRATOR", "OWNER", "FOUNDER", "CO_FOUNDER"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Requires administrative privileges." }, { status: 403 });
    }

    const body = await req.json();
    const { email, name, role, department, permissions } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid corporate email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hours = 48;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const rawTokenBytes = crypto.randomBytes(32).toString("hex");
    const rawToken = `DRG-INV-${rawTokenBytes}`;
    const tokenHash = hashToken(rawToken);

    const permsJson = Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify([]);

    const invitation = await prisma.teamInvitation.create({
      data: {
        email: cleanEmail,
        name: name ? name.trim() : cleanEmail.split("@")[0],
        role: role || "EDITOR",
        department: department || "Engineering",
        permissions: permsJson,
        tokenHash,
        status: "PENDING",
        createdBy: auth.user.email,
        expiresAt,
      },
    });

    const inviteUrl = `http://localhost:4000/auth/accept-invite?token=${rawToken}`;

    await sendEmail({
      to: cleanEmail,
      subject: "Invitation to join Dragon Studios Enterprise Team",
      html: `
        <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 36px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffffff; margin-top: 0;">DRAGON STUDIOS — ENTERPRISE INVITATION</h2>
          <p>Hello <strong>${name || cleanEmail}</strong>,</p>
          <p>You have been issued a single-use Dragon Team Invitation by <strong>${auth.user.name || auth.user.email}</strong> to join Dragon Studios as <strong>${role || "EDITOR"}</strong> (${department || "Engineering"}).</p>
          <div style="margin: 32px 0;">
            <a href="${inviteUrl}" style="background: #ffffff; color: #000000; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
              ACCEPT INVITATION & COMPLETE ACCOUNT SETUP →
            </a>
          </div>
          <p style="color: #71717a; font-size: 12px;">Link is single-use, bound to your email, and will expire in ${hours} hours.</p>
        </div>
      `,
    }).catch((e: unknown) => console.warn("Email dispatch warning:", e));

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "INVITATION_CREATED",
        resource: "USERS_IAM",
        details: `Issued single-use invitation for ${cleanEmail} as ${role || "EDITOR"} (${department || "Engineering"})`,
      },
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
