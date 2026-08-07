import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword, role, department } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address format." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email address already exists." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role || "EDITOR",
        department: department || "Operations",
        status: "ACTIVE",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        userEmail: newUser.email,
        action: "USER_REGISTERED",
        resource: "AUTH_SIGNUP",
        details: `New admin user registered: ${newUser.name} (${newUser.role})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
