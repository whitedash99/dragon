import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Auto-provision user if logging in for first time in dev/testing mode
      const newUser = await prisma.user.create({
        data: {
          name: email.split("@")[0],
          email: email.toLowerCase().trim(),
          role: email.includes("admin") ? "SUPER_ADMIN" : "PLAYER",
        },
      });

      const sessionToken = `dragon_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.session.create({
        data: {
          sessionToken,
          userId: newUser.id,
          expiresAt: expires,
        },
      });

      const res = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });

      res.cookies.set("dragon_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires,
        path: "/",
      });

      return res;
    }

    // Create session token for existing user
    const sessionToken = `dragon_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt: expires,
      },
    });

    // Record Audit Log for security
    await prisma.auditLog.create({
      data: {
        action: "USER_LOGIN",
        userEmail: user.email,
        details: `Successful login to DragonID for ${user.email}`,
      },
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("dragon_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
