import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  parseProfileMetadata,
  serializeProfileMetadata,
  validateDragonIdHandle,
  generateCanonicalDragonId,
} from "@/lib/user-profile";
import { registerBrowserInstallation } from "@/lib/installation-server";
import { INSTALLATION_COOKIE_NAME } from "@/lib/installation";

export const dynamic = "force-dynamic";

async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Method 1: Check dragon_session cookie
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      try {
        const session = await prisma.session.findUnique({
          where: { sessionToken },
          include: { user: { include: { profile: true } } },
        });
        if (session && session.user) {
          return session.user;
        }
      } catch (err) {
        console.warn("Session token user lookup fallback:", err);
      }
    }

    // Method 2: NextAuth Google session
    const authSession = await getServerSession(authOptions).catch(() => null);
    if (authSession?.user?.email) {
      const normalizedEmail = authSession.user.email.toLowerCase().trim();
      try {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { profile: true },
        });
        if (user) return user;
      } catch (err) {
        console.warn("User email lookup fallback:", err);
        // Fallback: minimal user object if DB query failed
        return {
          id: (authSession.user as any)?.id || "user-google",
          name: authSession.user.name || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          image: authSession.user.image,
          role: (authSession.user as any)?.role || "PLAYER",
          createdAt: new Date(),
          profile: null,
        } as any;
      }
    }
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const metadata = parseProfileMetadata(user.profile?.notificationSettings, user.name);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dragonId: user.dragonId || null,
        image: user.image || user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
      metadata,
      onboarding: {
        hasCompletedWelcome: metadata.hasCompletedWelcome,
        hasCompletedDragonId: metadata.hasCompletedDragonId,
        step: metadata.onboardingStep,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { step, gamerTag, displayName, primaryTitle, bannerTheme, avatar, bio } = body;

    const currentMetadata = parseProfileMetadata(user.profile?.notificationSettings, user.name);
    const now = new Date().toISOString();

    if (step === "WELCOME_COMPLETE") {
      const updatedMetadataString = serializeProfileMetadata(currentMetadata, {
        hasCompletedWelcome: true,
        welcomeCompletedAt: now,
      });

      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          notificationSettings: updatedMetadataString,
        },
        create: {
          userId: user.id,
          bio: "Dragon Studios Player & VIP Member",
          notificationSettings: updatedMetadataString,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "WELCOME_COMPLETED",
          resource: "ONBOARDING",
          details: `User ${user.email} completed cinematic welcome walkthrough`,
        },
      }).catch((e: unknown) => console.warn("AuditLog creation warning:", e));

      const response = NextResponse.json({
        success: true,
        message: "Welcome experience marked as completed.",
        step: "DRAGON_ID_FORGE",
        redirectUrl: "/dragon-id/setup",
      });

      response.cookies.set("dragon_welcome_completed", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    if (step === "INSTALLATION_CONFIRMED") {
      // User with existing Dragon ID on a fresh browser confirms/activates the new installation
      if (!user.dragonId) {
        return NextResponse.json({ success: false, error: "No existing Dragon ID found to confirm." }, { status: 400 });
      }

      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const userAgent = req.headers.get("user-agent") || undefined;
      const installationToken = await registerBrowserInstallation(user.id, userAgent, ip);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "INSTALLATION_ACTIVATED",
          resource: "DEVICE_INSTALLATION",
          details: `User ${user.email} activated existing Dragon ID ${user.dragonId} on new browser installation`,
          ipAddress: ip,
        },
      }).catch(() => {});

      const response = NextResponse.json({
        success: true,
        message: "Dragon ID installation activated on this browser.",
        step: "COMPLETED",
        redirectUrl: "/dashboard",
        dragonId: user.dragonId,
        user: {
          id: user.id,
          name: user.name,
          dragonId: user.dragonId,
        },
      });

      // Set long-lived installation marker cookie (Layer 3)
      response.cookies.set(INSTALLATION_COOKIE_NAME, installationToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: "/",
      });

      return response;
    }

    if (step === "DRAGON_ID_COMPLETE") {
      // Validate Dragon ID / handle
      const targetTag = (gamerTag || displayName || currentMetadata.gamerTag || "Player").trim();
      const validation = validateDragonIdHandle(targetTag);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }

      // Generate canonical golden DragonID if not already assigned
      const canonicalDragonId = user.dragonId || generateCanonicalDragonId(targetTag);

      const updatedMetadataString = serializeProfileMetadata(currentMetadata, {
        hasCompletedWelcome: true,
        hasCompletedDragonId: true,
        dragonIdCompletedAt: now,
        gamerTag: targetTag,
        primaryTitle: primaryTitle || currentMetadata.primaryTitle || "Dragon Operative",
        bannerTheme: bannerTheme || currentMetadata.bannerTheme || "lightning-cyan",
        avatarId: avatar || currentMetadata.avatarId,
      });

      // Update User name, image, and dragonId
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: (displayName || targetTag).trim(),
          image: avatar ? String(avatar) : undefined,
          avatar: avatar ? String(avatar) : undefined,
          dragonId: canonicalDragonId,
        },
      });

      // Upsert UserProfile
      const updatedProfile = await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          bio: bio || user.profile?.bio || "Dragon Studios Player & VIP Member",
          notificationSettings: updatedMetadataString,
        },
        create: {
          userId: user.id,
          bio: bio || "Dragon Studios Player & VIP Member",
          notificationSettings: updatedMetadataString,
        },
      });

      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const userAgent = req.headers.get("user-agent") || undefined;
      const installationToken = await registerBrowserInstallation(user.id, userAgent, ip);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "DRAGON_ID_FORGED",
          resource: "DRAGON_ID",
          details: `User ${user.email} forged Dragon ID: GamerTag='${targetTag}', DragonID='${canonicalDragonId}', Title='${primaryTitle || "Dragon Operative"}'`,
          ipAddress: ip,
        },
      }).catch((e: unknown) => console.warn("AuditLog creation warning:", e));

      const response = NextResponse.json({
        success: true,
        message: "Dragon ID successfully forged and activated.",
        step: "COMPLETED",
        redirectUrl: "/dashboard",
        dragonId: canonicalDragonId,
        user: {
          id: user.id,
          name: (displayName || targetTag).trim(),
          dragonId: canonicalDragonId,
          gamerTag: targetTag,
          avatar: avatar || currentMetadata.avatarId,
        },
        metadata: parseProfileMetadata(updatedProfile.notificationSettings, displayName || targetTag),
      });

      // Set long-lived installation marker cookie (Layer 3)
      response.cookies.set(INSTALLATION_COOKIE_NAME, installationToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: "/",
      });

      response.cookies.set("dragon_welcome_completed", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });

      response.cookies.set("dragon_dragonid_completed", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid onboarding step action." }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
