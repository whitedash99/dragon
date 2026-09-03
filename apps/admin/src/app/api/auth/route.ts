import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { comparePassword, createAdminSession, destroyAdminSession, getAuthenticatedUser } from "@/lib/auth/auth";
import { isConfiguredOwnerEmail, checkRateLimit, recordSecurityAudit } from "@/lib/auth/security";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth || auth.user.email.toLowerCase().trim() !== "whitedash99@gmail.com") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      role: "OWNER",
      status: auth.user.status,
      department: auth.user.department,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, deviceId, fingerprint } = body;

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "localhost";

    const identifier = (email || "").trim();
    const cleanEmail = identifier.toLowerCase();

    // 🔒 STRICT SECURITY ISOLATION: ONLY whitedash99@gmail.com is authorized to log in/sign in
    if (action !== "logout") {
      const isAuthorized = cleanEmail === "whitedash99@gmail.com" || cleanEmail === "whitedash99";
      if (!isAuthorized) {
        await recordSecurityAudit({
          userEmail: cleanEmail,
          action: "UNAUTHORIZED_LOGIN_BLOCKED",
          resource: "AUTH_GATEWAY",
          details: `Strict access policy: Only whitedash99@gmail.com is permitted. Blocked: ${cleanEmail}`,
          severity: "HIGH",
          ipAddress,
        }).catch(() => {});

        return NextResponse.json(
          {
            success: false,
            error: "Access Denied: Only whitedash99@gmail.com is authorized to access Dragon Command.",
          },
          { status: 403 }
        );
      }
    }

    // 1. CREDENTIALS LOGIN
    if (action === "login" && email && password) {
      // Rate Limiting: 5 attempts per 15 minutes per IP + Email combination
      const rateLimitKey = `login_${ipAddress}_${cleanEmail}`;
      const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
      if (!rateLimit.allowed) {
        await recordSecurityAudit({
          userEmail: cleanEmail,
          action: "LOGIN_RATE_LIMITED",
          resource: "AUTH_GATEWAY",
          details: `Rate limit triggered for login attempts from IP: ${ipAddress}`,
          severity: "HIGH",
          ipAddress,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Too many failed login attempts. Account temporarily throttled. Please try again in 15 minutes.",
          },
          { status: 429 }
        );
      }

      // Safe, crash-proof lookup for whitedash99@gmail.com (explicit fields prevent missing column errors)
      let user: any = null;
      try {
        user = await prisma.user.findUnique({
          where: { email: "whitedash99@gmail.com" },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            status: true,
            isActive: true,
            isProtected: true,
            department: true,
          },
        });
      } catch (findErr) {
        console.warn("[User Lookup Fallback]:", findErr);
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, email, name, password, role, status, "isActive", "isProtected", department FROM "User" WHERE LOWER(email) = 'whitedash99@gmail.com' LIMIT 1`
        ).catch(() => []);
        user = rows[0] || null;
      }

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Access Denied: User account not found." },
          { status: 401 }
        );
      }

      // Verify Password if set
      if (user.password) {
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
          await recordSecurityAudit({
            userEmail: user.email,
            action: "LOGIN_FAILURE_INVALID_PASSWORD",
            resource: "AUTH_SESSION",
            details: `Invalid password supplied for ${user.email} from ${ipAddress}`,
            severity: "HIGH",
            ipAddress,
          });
          return NextResponse.json(
            { success: false, error: "Access Denied: Invalid credentials." },
            { status: 401 }
          );
        }
      }

      // Device Trust & Fingerprint Registration (catch errors so table differences never block login)
      const targetDeviceId = deviceId || `dev_${Math.random().toString(36).substring(2, 10)}`;
      try {
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
          }).catch(() => null);
        } else {
          await prisma.userDevice.update({
            where: { id: existingDevice.id },
            data: { lastUsedAt: new Date(), ipAddress },
          }).catch(() => null);
        }
      } catch {}

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "OWNER",
            status: "ACTIVE",
            isActive: true,
            isProtected: true,
            lastLogin: new Date(),
          },
        });
      } catch {}

      await createAdminSession(user.id, ipAddress, userAgent);

      await recordSecurityAudit({
        userId: user.id,
        userEmail: user.email,
        action: "LOGIN_SUCCESS",
        resource: "AUTH_SESSION",
        details: `Supreme Owner authenticated session from ${ipAddress}`,
        severity: "LOW",
        ipAddress,
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name || "Tanish sharma",
          email: user.email,
          role: "OWNER",
        },
      });
    }

    // 2. GOOGLE OAUTH POST-VALIDATION
    if (action === "google_login" && email) {
      if (cleanEmail !== "whitedash99@gmail.com") {
        return NextResponse.json(
          { success: false, error: "Access Denied: Only whitedash99@gmail.com is authorized." },
          { status: 403 }
        );
      }

      let targetUser: any = null;
      try {
        targetUser = await prisma.user.upsert({
          where: { email: "whitedash99@gmail.com" },
          update: {
            role: "OWNER",
            status: "ACTIVE",
            isActive: true,
            isProtected: true,
            lastLogin: new Date(),
          },
          create: {
            email: "whitedash99@gmail.com",
            name: "Tanish sharma",
            role: "OWNER",
            status: "ACTIVE",
            isActive: true,
            isProtected: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
      } catch (err) {
        console.warn("[Google Login Fallback]:", err);
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, name, email, role FROM "User" WHERE LOWER(email) = 'whitedash99@gmail.com' LIMIT 1`
        ).catch(() => []);
        targetUser = rows[0] || { id: "owner_whitedash99", name: "Tanish sharma", email: "whitedash99@gmail.com", role: "OWNER" };
      }

      await createAdminSession(targetUser.id, ipAddress, userAgent);

      await recordSecurityAudit({
        userId: targetUser.id,
        userEmail: targetUser.email,
        action: "GOOGLE_LOGIN_SUCCESS",
        resource: "GOOGLE_OAUTH",
        details: `Google OAuth login succeeded for Supreme Owner: ${targetUser.email}`,
        severity: "LOW",
        ipAddress,
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        user: { id: targetUser.id, name: targetUser.name, email: targetUser.email, role: "OWNER" },
      });
    }

    // 3. SUPREME OWNER DIRECT 1-CLICK AUTHENTICATION
    if (action === "owner_direct_access") {
      let ownerUser: any = null;
      try {
        ownerUser = await prisma.user.upsert({
          where: { email: "whitedash99@gmail.com" },
          update: {
            role: "OWNER",
            status: "ACTIVE",
            isActive: true,
            isProtected: true,
            isDeleted: false,
            lastLogin: new Date(),
          },
          create: {
            email: "whitedash99@gmail.com",
            name: "Tanish sharma",
            role: "OWNER",
            status: "ACTIVE",
            isActive: true,
            isProtected: true,
            securityScore: 100,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
          },
        });
      } catch (upsertErr) {
        console.warn("[Owner Direct Access Upsert Fallback]:", upsertErr);
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, email, name, role, status FROM "User" WHERE LOWER(email) = 'whitedash99@gmail.com' LIMIT 1`
        ).catch(() => []);
        ownerUser = rows[0] || { id: "owner_whitedash99", name: "Tanish sharma", email: "whitedash99@gmail.com", role: "OWNER" };
      }

      await createAdminSession(ownerUser.id, ipAddress, userAgent);

      await recordSecurityAudit({
        userId: ownerUser.id,
        userEmail: ownerUser.email,
        action: "SUPREME_OWNER_DIRECT_LOGIN",
        resource: "AUTH_GATEWAY",
        details: `Supreme Owner whitedash99@gmail.com authenticated via God-Level 1-Click access from ${ipAddress}`,
        severity: "LOW",
        ipAddress,
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        user: {
          id: ownerUser.id,
          name: ownerUser.name || "Tanish sharma",
          email: "whitedash99@gmail.com",
          role: "OWNER",
        },
      });
    }

    // 4. LOGOUT
    if (action === "logout") {
      const auth = await getAuthenticatedUser();
      if (auth) {
        await recordSecurityAudit({
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "LOGOUT",
          resource: "AUTH_SESSION",
          details: `Staff member logged out from session`,
          severity: "LOW",
          ipAddress,
        }).catch(() => {});
      }

      await destroyAdminSession();
      return NextResponse.json({ success: true, message: "Logged out successfully." });
    }

    return NextResponse.json({ success: false, error: "Invalid request payload." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
