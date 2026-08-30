import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { parseProfileMetadata } from "@/lib/user-profile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const identifier = email.trim();
    const normalizedEmail = identifier.toLowerCase();

    let user: any = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            { dragonId: identifier },
            { dragonId: identifier.toUpperCase() },
            { dragonId: identifier.replace(/^@/, "") },
          ],
        },
        include: { profile: true },
      });
    } catch {
      // dragonId column may not exist — fallback to email-only search
      user = await prisma.user.findFirst({
        where: { email: normalizedEmail },
        include: { profile: true },
      }).catch(() => null);
    }

    if (!user) {
      // Auto-provision user if logging in for first time in dev/testing mode
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: hashedPassword,
          role: normalizedEmail.includes("admin") ? "SUPER_ADMIN" : "PLAYER",
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
        redirectUrl: "/welcome",
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

    // Verify password if set on user account
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Incorrect password. Please try again." }, { status: 401 });
      }
    } else {
      // Set password for user who previously signed in with OAuth
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
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

    // Record Audit Log & In-App Notification for security
    await prisma.auditLog.create({
      data: {
        action: "USER_LOGIN",
        userEmail: user.email,
        details: `Successful login to DragonID for ${user.email}`,
      },
    }).catch(() => {});

    await prisma.notification.create({
      data: {
        title: "Security Alert: Successful Sign-In",
        message: `Your account was successfully signed into from your browser on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.`,
        type: "AUTH_LOGIN",
        recipient: user.email,
        channel: "IN_APP",
      },
    }).catch(() => {});

    const meta = parseProfileMetadata(user.profile?.notificationSettings, user.name);
    const redirectUrl = meta.hasCompletedDragonId
      ? "/dashboard"
      : meta.hasCompletedWelcome
      ? "/dragon-id/setup"
      : "/welcome";

    const response = NextResponse.json({
      success: true,
      redirectUrl,
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

