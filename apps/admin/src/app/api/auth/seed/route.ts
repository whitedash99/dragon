import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";

export async function POST() {
  try {
    const ownerEmail = "owner@dragonstudios.com";

    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Owner account already exists.",
        email: ownerEmail,
      });
    }

    const hashedPassword = await hashPassword("DragonOwner#2026");

    const ownerUser = await prisma.user.create({
      data: {
        email: ownerEmail,
        password: hashedPassword,
        name: "Dragon Owner",
        role: "OWNER",
        department: "Executive Leadership",
        status: "ACTIVE",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: ownerUser.id,
        userEmail: ownerUser.email,
        action: "OWNER_ACCOUNT_PROVISIONED",
        resource: "USER_SEED",
        details: "Owner account provisioned with bcrypt password hash",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Owner account provisioned successfully.",
      user: {
        email: ownerUser.email,
        role: ownerUser.role,
        defaultPassword: "DragonOwner#2026",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
