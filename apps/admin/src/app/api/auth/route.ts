import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { comparePassword, createAdminSession, getAuthenticatedUser, destroyAdminSession } from "@/lib/auth/auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();

    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
        department: auth.user.department,
        status: auth.user.status,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ authenticated: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    // 1. LOGIN
    if (action === "login" && email && password) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user || user.status !== "ACTIVE") {
        return NextResponse.json({ success: false, error: "Invalid email or account disabled." }, { status: 401 });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, error: "Invalid password credentials." }, { status: 401 });
      }

      const userAgent = req.headers.get("user-agent") || undefined;
      const ipAddress = req.headers.get("x-forwarded-for") || undefined;

      await createAdminSession(user.id, ipAddress, userAgent);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "USER_LOGIN_SUCCESS",
          resource: "AUTH_SESSION",
          details: `User logged in from ${ipAddress || "localhost"}`,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 2. LOGOUT
    if (action === "logout") {
      const auth = await getAuthenticatedUser();
      if (auth) {
        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "USER_LOGOUT",
            resource: "AUTH_SESSION",
            details: "User initiated logout",
          },
        });
      }

      await destroyAdminSession();
      return NextResponse.json({ success: true, message: "Logged out successfully." });
    }

    return NextResponse.json({ success: false, error: "Invalid request payload." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
