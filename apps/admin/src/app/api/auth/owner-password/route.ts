import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword, securityCode } = body;

    if (!email || !newPassword || !securityCode) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isOwnerEmail =
      cleanEmail === "whitedash99@gmail.com" ||
      cleanEmail === "dragongamingstudio1212@gmail.com" ||
      cleanEmail === "dragonstudiosofficial01@gmail.com" ||
      cleanEmail === "owner@dragonstudios.com";

    if (!isOwnerEmail) {
      return NextResponse.json({ success: false, error: "Only verified Owner emails can use this vault." }, { status: 403 });
    }

    const validCode =
      securityCode === "DRAGON-SUPREME-2026" ||
      securityCode === "DRAGON-OWNER-MASTER" ||
      securityCode === "DragonFounder#2026!";

    if (!validCode) {
      return NextResponse.json({ success: false, error: "Invalid Owner Security Clearance Code." }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);

    const updatedUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        password: passwordHash,
        role: "OWNER",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        isProtected: true,
        permissions: JSON.stringify(["*"]),
      },
      create: {
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        password: passwordHash,
        role: "OWNER",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        isProtected: true,
        permissions: JSON.stringify(["*"]),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: updatedUser.id,
        userEmail: cleanEmail,
        action: "OWNER_PASSWORD_UPDATED_VIA_VAULT",
        resource: "AUTH_IAM",
        details: `Owner password updated securely for ${cleanEmail}`,
      },
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      message: `Master password for ${cleanEmail} updated successfully.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
