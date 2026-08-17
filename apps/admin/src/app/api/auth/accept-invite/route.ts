import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";
import { validateMilitaryPasswordPolicy } from "@dragon/auth";

export const dynamic = "force-dynamic";

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Invitation token required." }, { status: 400 });
    }

    const tokenHash = hashToken(token.trim());

    // Search TeamInvitation by tokenHash
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
      // Mark as expired in DB
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
    const { token, password, email: clientEmail, passkeyData } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token and password are required." }, { status: 400 });
    }

    const tokenHash = hashToken(token.trim());

    const invitation = await prisma.teamInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation || invitation.status !== "PENDING" || invitation.expiresAt <= new Date()) {
      return NextResponse.json({ success: false, error: "Invitation is invalid, expired, or already used." }, { status: 400 });
    }

    // Email binding guard
    if (clientEmail && clientEmail.trim().toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Invitation is bound to a different email address." }, { status: 400 });
    }

    const passCheck = validateMilitaryPasswordPolicy(password);
    if (!passCheck.valid) {
      return NextResponse.json({ success: false, error: passCheck.error || "Password policy validation failed." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Atomic transaction for single-use invitation consumption
    const result = await prisma.$transaction(async (tx) => {
      // Conditional status update to prevent race conditions
      const updateResult = await tx.teamInvitation.updateMany({
        where: { id: invitation.id, status: "PENDING" },
        data: { status: "ACCEPTED" },
      });

      if (updateResult.count === 0) {
        throw new Error("ALREADY_CONSUMED");
      }

      // Create or update User in PostgreSQL using strictly assigned invitation.role (ignores client role forging)
      const user = await tx.user.upsert({
        where: { email: invitation.email },
        update: {
          name: invitation.name || invitation.email.split("@")[0],
          password: hashedPassword,
          role: invitation.role,
          department: invitation.department || "Engineering",
          permissions: invitation.permissions || "[]",
          status: "ACTIVE",
          isActive: true,
          isDeleted: false,
          emailVerified: new Date(),
          provider: "credentials",
        },
        create: {
          email: invitation.email,
          name: invitation.name || invitation.email.split("@")[0],
          password: hashedPassword,
          role: invitation.role,
          department: invitation.department || "Engineering",
          permissions: invitation.permissions || "[]",
          status: "ACTIVE",
          isActive: true,
          isDeleted: false,
          emailVerified: new Date(),
          provider: "credentials",
        },
      });

      // Handle optional WebAuthn / Passkey credential registration
      const passkeyObj = passkeyData || body.passkey;
      if (passkeyObj && passkeyObj.credentialId && passkeyObj.publicKey) {
        await tx.passkeyCredential.create({
          data: {
            userId: user.id,
            credentialId: passkeyObj.credentialId,
            publicKey: passkeyObj.publicKey,
            deviceType: passkeyObj.deviceType || "Authenticator",
            transports: passkeyObj.transports || "internal",
          },
        }).catch((e) => console.warn("Passkey storage warning:", e));

        await tx.auditLog.create({
          data: {
            userId: user.id,
            userEmail: user.email,
            action: "PASSKEY_REGISTERED",
            resource: "WEBAUTHN",
            details: `Registered Passkey authenticator for ${user.email}`,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "INVITATION_ACCEPTED",
          resource: "TEAM_KEY_PORTAL",
          details: `Account activated for ${user.email} with role ${user.role} (${user.department})`,
        },
      });

      return user;
    }, { timeout: 15000 }).catch((err) => {
      if (err.message === "ALREADY_CONSUMED") {
        return null;
      }
      throw err;
    });

    if (!result) {
      return NextResponse.json({ success: false, error: "This invitation has already been consumed by another request." }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      message: "Account created and activated successfully.",
      redirect: "/login",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
