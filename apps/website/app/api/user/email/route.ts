import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateEmailSecurity } from "@/lib/security/disposable-email";
import { sendVerificationEmail } from "@/lib/email/verification";
import { siteConfig } from "@/lib/site";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    const body = await req.json();
    const { newEmail } = body;

    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json({ success: false, error: "New email address is required." }, { status: 400 });
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    if (cleanEmail === session.user.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "New email is identical to current email." }, { status: 400 });
    }

    const emailSec = validateEmailSecurity(cleanEmail);
    if (!emailSec.isValid) {
      return NextResponse.json({ success: false, error: emailSec.reason || "Invalid email address." }, { status: 400 });
    }

    // Check if new email is already used by another user
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ success: false, error: "Email address is already in use by another account." }, { status: 409 });
    }

    // Reset emailVerified to NULL and update user email in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        email: cleanEmail,
        emailVerified: null, // Reset verification status for new email!
      },
    });

    // Generate Verification Token for New Email
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.contactVerificationToken.create({
      data: {
        token: rawToken,
        email: cleanEmail,
        name: updatedUser.name || "Dragon Studios Member",
        category: "Account Management",
        subject: "Email Address Update Verification",
        message: "Request to verify new email address for Dragon Studios account.",
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || siteConfig.url || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/contact/verify?token=${rawToken}`;

    await sendVerificationEmail({
      name: updatedUser.name || "Member",
      email: cleanEmail,
      subject: "Verify New Email Address",
      token: rawToken,
      verifyUrl,
    });

    return NextResponse.json({
      success: true,
      emailVerified: false,
      message: "Email address updated. Verification email dispatched to your new inbox.",
    });

  } catch (error: any) {
    console.error("Email update API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
