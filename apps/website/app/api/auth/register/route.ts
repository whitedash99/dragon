import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEnterpriseEmail } from "@/lib/email";
import { serializeProfileMetadata, DEFAULT_DRAGON_ID_METADATA, generateCanonicalDragonId } from "@/lib/user-profile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ success: false, error: "Valid email and password (min 6 chars) required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email address already exists." }, { status: 400 });
    }

    const defaultGamerTag = (name || normalizedEmail.split("@")[0]).trim().replace(/\s+/g, "_");
    const hashedPassword = await bcrypt.hash(password, 10);
    const dragonId = generateCanonicalDragonId();

    // Create user in PostgreSQL with unique Golden DragonID and resilient fallback
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          name: name || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: hashedPassword,
          dragonId,
          role: "PLAYER",
        },
      });
    } catch (createErr: any) {
      console.warn("Primary user creation warning, attempting schema fallback:", createErr?.message);
      newUser = await prisma.user.create({
        data: {
          name: name || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: hashedPassword,
          role: "PLAYER",
        },
      });
    }

    // Create default UserProfile with onboarding flags = false
    const initialSettings = serializeProfileMetadata(
      {
        ...DEFAULT_DRAGON_ID_METADATA,
        gamerTag: defaultGamerTag,
      },
      {
        hasCompletedWelcome: false,
        hasCompletedDragonId: false,
      }
    );

    await prisma.userProfile.create({
      data: {
        userId: newUser.id,
        country: "United States",
        language: "en-US",
        theme: "dark",
        notificationSettings: initialSettings,
      },
    }).catch((err) => console.warn("UserProfile initial creation warning:", err));

    // Create session token
    const sessionToken = `dragon_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: newUser.id,
        expiresAt: expires,
      },
    });

    // Send Welcome Email Notification
    sendEnterpriseEmail({
      ticketId: "WELCOME",
      name: newUser.name || "Player",
      email: newUser.email,
      category: "Account Registration",
      subject: "Welcome to DragonID — Official Account Created",
      message: `Welcome to Dragon Studios! Your DragonID account (${newUser.email}) has been successfully created.`,
      priority: "NORMAL",
      status: "OPEN",
    }).catch((e) => console.error("Non-fatal welcome email error:", e));

    const response = NextResponse.json({
      success: true,
      redirectUrl: "/welcome",
      message: "DragonID account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    // Set secure HTTP-only cookie
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
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

