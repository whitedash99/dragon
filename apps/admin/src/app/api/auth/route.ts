import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { comparePassword, createAdminSession, destroyAdminSession, getAuthenticatedUser } from "@/lib/auth/auth";
import { isConfiguredOwnerEmail, checkRateLimit, recordSecurityAudit } from "@/lib/auth/security";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      role: auth.user.role,
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

    // 1. CREDENTIALS LOGIN
    if (action === "login" && email && password) {
      const cleanEmail = email.toLowerCase().trim();

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

      // Check configured owner or corporate domain
      const isOwnerAccount = isConfiguredOwnerEmail(cleanEmail);
      const isCorporateDomain = cleanEmail.endsWith("@dragonstudios.com") || isOwnerAccount;

      if (!isCorporateDomain) {
        await recordSecurityAudit({
          userEmail: cleanEmail,
          action: "UNAUTHORIZED_DOMAIN_LOGIN",
          resource: "AUTH_GATEWAY",
          details: `Rejected login attempt from unapproved domain from IP: ${ipAddress}`,
          severity: "MEDIUM",
          ipAddress,
        });
        return NextResponse.json(
          { success: false, error: "Access Denied: Invalid credentials or unapproved account domain." },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      // Account enumeration protection: return uniform error message
      if (!user || user.role === "USER") {
        await recordSecurityAudit({
          userEmail: cleanEmail,
          action: "LOGIN_FAILURE_UNKNOWN_USER",
          resource: "AUTH_SESSION",
          details: `Failed login attempt for non-staff or non-existent account from ${ipAddress}`,
          severity: "LOW",
          ipAddress,
        });
        return NextResponse.json(
          { success: false, error: "Access Denied: Invalid credentials or account disabled." },
          { status: 401 }
        );
      }

      // Status check (ACTIVE only)
      if (user.status !== "ACTIVE" || !user.isActive || user.isDeleted) {
        await recordSecurityAudit({
          userId: user.id,
          userEmail: user.email,
          action: "LOGIN_FAILURE_INACTIVE_USER",
          resource: "AUTH_SESSION",
          details: `Login attempt blocked for account status: ${user.status}`,
          severity: "HIGH",
          ipAddress,
        });
        return NextResponse.json(
          { success: false, error: "Access Denied: Account suspended or disabled. Contact Owner." },
          { status: 403 }
        );
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        await recordSecurityAudit({
          userId: user.id,
          userEmail: user.email,
          action: "LOGIN_FAILURE_INVALID_PASSWORD",
          resource: "AUTH_SESSION",
          details: `Invalid password supplied for ${user.email} from ${ipAddress}`,
          severity: "HIGH",
          ipAddress,
        });
        return NextResponse.json(
          { success: false, error: "Access Denied: Invalid credentials or account disabled." },
          { status: 401 }
        );
      }

      // Device Trust & Fingerprint Registration
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
        }).catch(() => null);
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

      await recordSecurityAudit({
        userId: user.id,
        userEmail: user.email,
        action: "LOGIN_SUCCESS",
        resource: "AUTH_SESSION",
        details: `Staff member authenticated session (${user.role}) from ${ipAddress}`,
        severity: "LOW",
        ipAddress,
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

    // 2. GOOGLE OAUTH POST-VALIDATION
    if (action === "google_login" && email) {
      const cleanEmail = email.toLowerCase().trim();
      const isOwner = isConfiguredOwnerEmail(cleanEmail);
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      if (!user || user.role === "USER" || !user.isActive || user.isDeleted || user.status !== "ACTIVE") {
        if (!isOwner) {
          await recordSecurityAudit({
            userEmail: cleanEmail,
            action: "GOOGLE_LOGIN_DENIED",
            resource: "GOOGLE_OAUTH",
            details: `Unauthorized Google OAuth attempt blocked for ${cleanEmail} from ${ipAddress}`,
            severity: "HIGH",
            ipAddress,
          });

          return NextResponse.json(
            { success: false, error: "ACCESS DENIED: Google account is not approved. Contact an Owner for an invitation." },
            { status: 403 }
          );
        }
      }

      const targetUser = user || (await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          role: "OWNER",
          status: "ACTIVE",
          isProtected: true,
        },
      }));

      await createAdminSession(targetUser.id, ipAddress, userAgent);

      await recordSecurityAudit({
        userId: targetUser.id,
        userEmail: targetUser.email,
        action: "GOOGLE_LOGIN_SUCCESS",
        resource: "GOOGLE_OAUTH",
        details: `Google OAuth login succeeded for ${targetUser.email} (${targetUser.role}) from ${ipAddress}`,
        severity: "LOW",
        ipAddress,
      });

      return NextResponse.json({
        success: true,
        user: { id: targetUser.id, name: targetUser.name, email: targetUser.email, role: targetUser.role },
      });
    }

    // 3. SUPREME OWNER DIRECT 1-CLICK AUTHENTICATION
    if (action === "owner_direct_access" && email) {
      const cleanEmail = email.toLowerCase().trim();

      if (!isConfiguredOwnerEmail(cleanEmail)) {
        await recordSecurityAudit({
          userEmail: cleanEmail,
          action: "UNAUTHORIZED_OWNER_ACCESS_ATTEMPT",
          resource: "AUTH_GATEWAY",
          details: `Rejected owner direct access attempt for non-owner email: ${cleanEmail} from ${ipAddress}`,
          severity: "HIGH",
          ipAddress,
        });

        return NextResponse.json(
          { success: false, error: "Access Denied: Email is not an official supreme owner." },
          { status: 403 }
        );
      }

      // Upsert official owner with god-level permissions
      const ownerUser = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          role: "OWNER",
          status: "ACTIVE",
          isActive: true,
          isProtected: true,
          isDeleted: false,
          permissions: JSON.stringify(["*"]),
          lastLogin: new Date(),
        },
        create: {
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          role: "OWNER",
          status: "ACTIVE",
          isActive: true,
          isProtected: true,
          permissions: JSON.stringify(["*"]),
          securityScore: 100,
        },
      });

      await createAdminSession(ownerUser.id, ipAddress, userAgent);

      await recordSecurityAudit({
        userId: ownerUser.id,
        userEmail: ownerUser.email,
        action: "SUPREME_OWNER_DIRECT_LOGIN",
        resource: "AUTH_GATEWAY",
        details: `Supreme Owner ${ownerUser.email} authenticated via God-Level 1-Click access from ${ipAddress}`,
        severity: "LOW",
        ipAddress,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: ownerUser.id,
          name: ownerUser.name,
          email: ownerUser.email,
          role: ownerUser.role,
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
        });
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
