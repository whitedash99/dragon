import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { comparePassword, createAdminSession, destroyAdminSession, getAuthenticatedUser } from "@/lib/auth/auth";
import { sendNewDeviceAlertEmail } from "@dragon/email";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: auth.user,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, deviceId, fingerprint } = body;

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "localhost";

    // 1. STANDARD CREDENTIALS LOGIN
    if (action === "login" && email && password) {
      const cleanEmail = email.toLowerCase().trim();

      const isOwnerAccount =
        cleanEmail === "whitedash99@gmail.com" ||
        cleanEmail === "dragongamingstudio1212@gmail.com" ||
        cleanEmail === "dragonstudiosofficial01@gmail.com" ||
        cleanEmail === "dragonstudiosofficial02@gmail.com" ||
        cleanEmail.includes("owner") ||
        cleanEmail.includes("founder");

      const isAllowedDomain = cleanEmail.endsWith("@dragonstudios.com") || isOwnerAccount;
      if (!isAllowedDomain) {
        await prisma.auditLog.create({
          data: {
            userEmail: cleanEmail,
            action: "DOMAIN_REJECTED",
            resource: "AUTH_GATEWAY",
            details: `Rejected login attempt from unapproved domain (${cleanEmail})`,
          },
        }).catch((e: unknown) => console.warn("AuditLog warning:", e));
        return NextResponse.json({ success: false, error: "Security Guard: Access restricted to @dragonstudios.com domain accounts." }, { status: 403 });
      }

      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (!user) {
        await prisma.auditLog.create({
          data: {
            userEmail: cleanEmail,
            action: "USER_LOGIN_FAILED",
            resource: "AUTH_SESSION",
            details: `Failed login attempt for non-existent email from ${ipAddress}`,
          },
        }).catch((e: unknown) => console.warn("AuditLog warning:", e));
        return NextResponse.json({ success: false, error: "Invalid email credentials or account disabled." }, { status: 401 });
      }

      if (user.role === "USER") {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            userEmail: user.email,
            action: "USER_LOGIN_REJECTED",
            resource: "AUTH_SESSION",
            details: `Website customer account attempted access to Admin OS from ${ipAddress}`,
          },
        }).catch((e: unknown) => console.warn("AuditLog warning:", e));
        return NextResponse.json({ success: false, error: "403 Access Denied: Customer accounts are restricted from Admin OS." }, { status: 403 });
      }

      if (user.status !== "ACTIVE" || !user.isActive || user.isDeleted) {
        return NextResponse.json({ success: false, error: "Account disabled or suspended. Contact Founder or Super Admin." }, { status: 403 });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            userEmail: user.email,
            action: "USER_LOGIN_FAILED",
            resource: "AUTH_SESSION",
            details: `Invalid password credentials for ${user.email} from ${ipAddress}`,
          },
        }).catch((e: unknown) => console.warn("AuditLog warning:", e));
        return NextResponse.json({ success: false, error: "Invalid password credentials." }, { status: 401 });
      }

      // Device Trust & Fingerprint Verification
      const targetDeviceId = deviceId || `dev_${Math.random().toString(36).substring(2, 10)}`;
      const existingDevice = await prisma.userDevice.findUnique({
        where: { deviceId: targetDeviceId },
      }).catch(() => null);

      if (!existingDevice) {
        await prisma.userDevice.create({
          data: {
            userId: user.id,
            deviceId: targetDeviceId,
            browser: userAgent || "Browser",
            ipAddress,
            fingerprint: fingerprint || "device_fp_v1",
            trusted: true,
          },
        }).catch((e: unknown) => console.warn("Device creation warning:", e));

        sendNewDeviceAlertEmail(user.email, {
          ip: ipAddress,
          browser: userAgent || "Standard Browser",
          time: new Date().toLocaleString(),
        }).catch((e: unknown) => console.warn("Email alert warning:", e));
      } else {
        await prisma.userDevice.update({
          where: { id: existingDevice.id },
          data: { lastUsedAt: new Date(), ipAddress },
        }).catch(() => null);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          loginCount: { increment: 1 },
        },
      });

      await createAdminSession(user.id, ipAddress, userAgent);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "USER_LOGIN_SUCCESS",
          resource: "AUTH_SESSION",
          details: `Staff member (${user.role}) authenticated session from ${ipAddress}`,
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

    // 2. GOOGLE OAUTH AUTHORIZATION CHECK
    if (action === "google_login" && email) {
      const cleanEmail = email.toLowerCase().trim();
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      if (!user || user.role === "USER" || !user.isActive || user.isDeleted || user.status !== "ACTIVE") {
        await prisma.auditLog.create({
          data: {
            userEmail: cleanEmail,
            action: "UNAUTHORIZED_GOOGLE_LOGIN_ATTEMPT",
            resource: "GOOGLE_OAUTH",
            details: `Unauthorized Google OAuth login attempt for ${cleanEmail}`,
          },
        });

        return NextResponse.json(
          { success: false, error: "ACCESS DENIED: Random Google accounts are not authorized to access Dragon Admin OS. Contact an Owner for an invitation." },
          { status: 403 }
        );
      }

      await createAdminSession(user.id, ipAddress, userAgent);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: "GOOGLE_LOGIN_SUCCESS",
          resource: "GOOGLE_OAUTH",
          details: `Pre-authorized Google OAuth login succeeded for ${user.email} (${user.role})`,
        },
      });

      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    // 3. LOGOUT
    if (action === "logout") {
      const auth = await getAuthenticatedUser();
      if (auth) {
        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "USER_LOGOUT",
            resource: "AUTH_SESSION",
            details: "Staff member initiated logout",
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
