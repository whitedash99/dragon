import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";
import { hashToken, validateAdminPasswordPolicy, recordSecurityAudit } from "@/lib/auth/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Invitation token required." }, { status: 400 });
    }

    const tokenHash = hashToken(token.trim());

    // Search TeamInvitation by SHA-256 tokenHash
    const invitation = await prisma.teamInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation) {
      return NextResponse.json({ success: false, error: "Invalid or expired invitation token." }, { status: 404 });
    }

    if (invitation.status === "REVOKED") {
      return NextResponse.json({ success: false, error: "This invitation has been revoked by an Owner." }, { status: 410 });
    }

    if (invitation.status === "ACCEPTED") {
      return NextResponse.json({ success: false, error: "This invitation has already been used." }, { status: 410 });
    }

    if (invitation.expiresAt <= new Date()) {
      await prisma.teamInvitation.update({ where: { id: invitation.id }, data: { status: "EXPIRED" } }).catch(() => {});
      return NextResponse.json({ success: false, error: "This invitation link has expired." }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      invitation: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        department: invitation.department,
        permissions: invitation.permissions ? JSON.parse(invitation.permissions) : [],
        expiresAt: invitation.expiresAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, email: clientEmail } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token and password are required." }, { status: 400 });
    }

    const tokenHash = hashToken(token.trim());

    const invitation = await prisma.teamInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation || invitation.status !== "PENDING" || invitation.expiresAt <= new Date()) {
      return NextResponse.json({ success: false, error: "Invitation is invalid, expired, or already consumed." }, { status: 400 });
    }

    // Email binding guard: ensure client email matches invitation email if provided
    if (clientEmail && clientEmail.trim().toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Invitation is bound to a different email address." }, { status: 400 });
    }

    // Strict Military Password Policy (16+ chars, upper, lower, digit, special symbol)
    const passCheck = validateAdminPasswordPolicy(password);
    if (!passCheck.valid) {
      return NextResponse.json({ success: false, error: passCheck.error || "Password policy validation failed." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Atomic transaction for single-use invitation consumption & user provisioning
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark invitation as ACCEPTED atomically
      const updatedInvite = await tx.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      // 2. Upsert user in database with staff credentials
      const user = await tx.user.upsert({
        where: { email: invitation.email },
        update: {
          name: invitation.name || undefined,
          password: hashedPassword,
          role: invitation.role,
          department: invitation.department,
          permissions: invitation.permissions,
          status: "ACTIVE",
          isActive: true,
          isDeleted: false,
          isProtected: invitation.role === "OWNER" || invitation.role === "FOUNDER",
        },
        create: {
          email: invitation.email,
          name: invitation.name,
          password: hashedPassword,
          role: invitation.role,
          department: invitation.department,
          permissions: invitation.permissions,
          status: "ACTIVE",
          isActive: true,
          isDeleted: false,
          isProtected: invitation.role === "OWNER" || invitation.role === "FOUNDER",
        },
      });

      return { user, updatedInvite };
    });

    await recordSecurityAudit({
      userId: result.user.id,
      userEmail: result.user.email,
      action: "INVITATION_ACCEPTED",
      resource: "ADMIN_AUTH",
      details: `Administrator account activated via invitation for ${result.user.email} (${result.user.role})`,
      severity: "LOW",
    });

    return NextResponse.json({
      success: true,
      message: "Administrator account activated successfully. Proceed to login.",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
