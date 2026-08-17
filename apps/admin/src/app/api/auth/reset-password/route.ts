import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";
import { validateMilitaryPasswordPolicy } from "@dragon/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword, token } = body;

    if (!email || !newPassword || !token) {
      return NextResponse.json({ success: false, error: "Email, new password, and valid reset token are required." }, { status: 400 });
    }

    if (!token.startsWith("DRG-RST-")) {
      return NextResponse.json({ success: false, error: "Invalid or expired password reset token." }, { status: 400 });
    }

    const passCheck = validateMilitaryPasswordPolicy(newPassword);
    if (!passCheck.valid) {
      return NextResponse.json({ success: false, error: passCheck.error || "Password policy validation failed." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: "PASSWORD_RESET_SUCCESS",
        resource: "AUTH_SECURITY",
        details: "Password reset completed via recovery flow",
      },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
