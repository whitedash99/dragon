import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

/**
 * Intelligent User-Agent parser to extract OS, Browser, and Device Type
 */
function parseUserAgentDetails(ua?: string | null): {
  browser: string;
  os: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
} {
  if (!ua) {
    return { browser: "Unknown Browser", os: "Unknown OS", deviceType: "Unknown" };
  }

  const str = ua.toLowerCase();

  // 1. Detect Device Type
  let deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";
  if (str.includes("ipad") || str.includes("tablet") || (str.includes("android") && !str.includes("mobi"))) {
    deviceType = "Tablet";
  } else if (str.includes("mobile") || str.includes("iphone") || str.includes("android")) {
    deviceType = "Mobile";
  }

  // 2. Detect OS
  let os = "Unknown OS";
  if (str.includes("windows nt 10.0") || str.includes("windows 10") || str.includes("windows 11")) {
    os = "Windows 11 / 10";
  } else if (str.includes("windows nt 6.3") || str.includes("windows 8.1")) {
    os = "Windows 8.1";
  } else if (str.includes("windows nt 6.1") || str.includes("windows 7")) {
    os = "Windows 7";
  } else if (str.includes("windows")) {
    os = "Windows PC";
  } else if (str.includes("macintosh") || str.includes("mac os x")) {
    os = "macOS";
  } else if (str.includes("iphone")) {
    os = "iOS (iPhone)";
  } else if (str.includes("ipad")) {
    os = "iPadOS (iPad)";
  } else if (str.includes("android")) {
    os = "Android OS";
  } else if (str.includes("linux")) {
    os = "Linux";
  } else if (str.includes("cros")) {
    os = "ChromeOS";
  }

  // 3. Detect Browser
  let browser = "Web Client";
  if (str.includes("edg/") || str.includes("edge/")) {
    browser = "Microsoft Edge";
  } else if (str.includes("opr/") || str.includes("opera/")) {
    browser = "Opera";
  } else if (str.includes("chrome/") && !str.includes("edg/")) {
    browser = "Google Chrome";
  } else if (str.includes("safari/") && !str.includes("chrome/")) {
    browser = "Apple Safari";
  } else if (str.includes("firefox/")) {
    browser = "Mozilla Firefox";
  } else if (str.includes("brave")) {
    browser = "Brave Browser";
  }

  return { browser, os, deviceType };
}

/**
 * Extract country or region hint from IP or Profile
 */
function resolveLocationHint(ip?: string | null, profileCountry?: string | null): string {
  if (profileCountry && profileCountry !== "Unknown") {
    return profileCountry;
  }
  if (!ip) return "Global Network";
  if (ip === "127.0.0.1" || ip === "::1") return "Localhost / Dev Node";
  if (ip.startsWith("192.168.") || ip.startsWith("10.")) return "Private LAN";
  return "Worldwide Web";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterAction = searchParams.get("action") || "ALL";
    const searchQuery = searchParams.get("q")?.toLowerCase().trim() || "";
    const limit = parseInt(searchParams.get("limit") || "250", 10);

    // 1. Fetch Users with full relational data
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { lastLogin: "desc" },
      include: {
        profile: true,
        devices: {
          orderBy: { lastUsedAt: "desc" },
          take: 10,
        },
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    // 2. Fetch Live Audit Logs for authentication & security events
    const auditLogs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
            devices: {
              orderBy: { lastUsedAt: "desc" },
              take: 3,
            },
          },
        },
      },
    });

    // 3. Fetch User Devices
    const devices = await prisma.userDevice.findMany({
      take: 200,
      orderBy: { lastUsedAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // 4. Synthesize Live Chronological Events Feed
    const events: Array<{
      id: string;
      action: string;
      category: "SIGN_UP" | "SIGN_IN" | "DRAGON_ID" | "DEVICE" | "SECURITY" | "ONBOARDING";
      user: {
        id: string;
        name: string;
        email: string;
        dragonId: string | null;
        image: string | null;
        role: string;
        status: string;
        gamerTag: string;
        primaryTitle: string;
        bannerTheme: string;
        loginCount: number;
        createdAt: string;
        lastLogin: string | null;
      };
      device: {
        browser: string;
        os: string;
        deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
        trusted: boolean;
        ipAddress: string;
        rawUserAgent?: string;
      };
      location: string;
      details: string;
      createdAt: string;
    }> = [];

    // Parse audit logs into structured events
    for (const log of auditLogs) {
      const user = log.user;
      const userEmail = log.userEmail || user?.email || "Unknown User";
      const userName = user?.name || userEmail.split("@")[0];

      let parsedMeta: any = {};
      if (user?.profile?.notificationSettings) {
        try {
          parsedMeta = JSON.parse(user.profile.notificationSettings);
        } catch {}
      }

      // Extract device from matching user device or session
      const primaryDevice = user?.devices?.[0];
      const uaInfo = parseUserAgentDetails(primaryDevice?.browser);

      // Determine category
      let category: "SIGN_UP" | "SIGN_IN" | "DRAGON_ID" | "DEVICE" | "SECURITY" | "ONBOARDING" = "SIGN_IN";
      if (log.action.includes("REGISTER") || log.action.includes("SIGN_UP") || log.details?.includes("registration")) {
        category = "SIGN_UP";
      } else if (log.action.includes("DRAGON_ID")) {
        category = "DRAGON_ID";
      } else if (log.action.includes("DEVICE") || log.action.includes("INSTALLATION")) {
        category = "DEVICE";
      } else if (log.action.includes("WELCOME") || log.action.includes("ONBOARDING")) {
        category = "ONBOARDING";
      } else if (log.action.includes("SECURITY") || log.action.includes("AUTH_FAILURE")) {
        category = "SECURITY";
      }

      const ip = log.ipAddress || primaryDevice?.ipAddress || "127.0.0.1";
      const location = resolveLocationHint(ip, primaryDevice?.country || user?.profile?.country);

      events.push({
        id: log.id,
        action: log.action,
        category,
        user: {
          id: user?.id || log.userId || "usr_anonymous",
          name: userName,
          email: userEmail,
          dragonId: user?.dragonId || null,
          image: user?.image || user?.avatar || null,
          role: user?.role || "PLAYER",
          status: user?.status || "ACTIVE",
          gamerTag: parsedMeta.gamerTag || userName,
          primaryTitle: parsedMeta.primaryTitle || "Dragon Operative",
          bannerTheme: parsedMeta.bannerTheme || "lightning-cyan",
          loginCount: user?.loginCount || 1,
          createdAt: user?.createdAt?.toISOString() || log.createdAt.toISOString(),
          lastLogin: user?.lastLogin?.toISOString() || null,
        },
        device: {
          browser: primaryDevice?.browser || uaInfo.browser,
          os: primaryDevice?.os || uaInfo.os,
          deviceType: uaInfo.deviceType,
          trusted: primaryDevice?.trusted ?? true,
          ipAddress: ip,
          rawUserAgent: primaryDevice?.browser || undefined,
        },
        location,
        details: log.details || `${log.action} recorded for ${userEmail}`,
        createdAt: log.createdAt.toISOString(),
      });
    }

    // 5. Structure Player Directory Dossiers (A-to-Z directory)
    const players = users.map((u) => {
      let meta: any = {};
      if (u.profile?.notificationSettings) {
        try {
          meta = JSON.parse(u.profile.notificationSettings);
        } catch {}
      }

      const activeDevices = u.devices.map((d) => {
        const parsed = parseUserAgentDetails(d.browser);
        return {
          id: d.id,
          deviceId: d.deviceId,
          browser: d.browser || parsed.browser,
          os: d.os || parsed.os,
          deviceType: parsed.deviceType,
          ipAddress: d.ipAddress || "127.0.0.1",
          country: d.country || u.profile?.country || "Global",
          trusted: d.trusted,
          lastUsedAt: d.lastUsedAt.toISOString(),
        };
      });

      const activeSessions = u.sessions.map((s) => {
        const parsed = parseUserAgentDetails(s.userAgent);
        return {
          id: s.id,
          sessionToken: s.sessionToken,
          ipAddress: s.ipAddress || "127.0.0.1",
          userAgent: s.userAgent || parsed.browser,
          expiresAt: s.expiresAt.toISOString(),
          createdAt: s.createdAt.toISOString(),
        };
      });

      return {
        id: u.id,
        name: u.name || u.email.split("@")[0],
        email: u.email,
        dragonId: u.dragonId || null,
        image: u.image || u.avatar || null,
        role: u.role,
        status: u.status,
        provider: u.provider || "google",
        department: u.department || "Player Base",
        loginCount: u.loginCount || 1,
        emailVerified: u.emailVerified?.toISOString() || null,
        createdAt: u.createdAt.toISOString(),
        lastLogin: u.lastLogin?.toISOString() || u.createdAt.toISOString(),
        gamerTag: meta.gamerTag || u.name || "Player",
        primaryTitle: meta.primaryTitle || "Dragon Operative",
        bannerTheme: meta.bannerTheme || "lightning-cyan",
        hasCompletedWelcome: Boolean(meta.hasCompletedWelcome),
        hasCompletedDragonId: Boolean(u.dragonId || meta.hasCompletedDragonId),
        country: u.profile?.country || "United States",
        devices: activeDevices,
        sessions: activeSessions,
      };
    });

    // 6. Calculate Top-Level Telemetry Aggregations
    const totalUsers = users.length;
    const totalLogins = users.reduce((acc, curr) => acc + (curr.loginCount || 1), 0);
    const totalDragonIds = users.filter((u) => Boolean(u.dragonId)).length;
    const totalActiveDevices = devices.length;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const signInsLast24h = auditLogs.filter(
      (l) => l.createdAt >= oneDayAgo && (l.action.includes("AUTH") || l.action.includes("LOGIN") || l.action.includes("SIGN_IN"))
    ).length;

    // Breakdown charts data
    const osCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const actionCounts: Record<string, number> = {};

    for (const e of events) {
      // OS breakdown
      const osKey = e.device.os || "Unknown OS";
      osCounts[osKey] = (osCounts[osKey] || 0) + 1;

      // Browser breakdown
      const browserKey = e.device.browser || "Unknown Browser";
      browserCounts[browserKey] = (browserCounts[browserKey] || 0) + 1;

      // Country breakdown
      const countryKey = e.location || "Global";
      countryCounts[countryKey] = (countryCounts[countryKey] || 0) + 1;

      // Action breakdown
      actionCounts[e.action] = (actionCounts[e.action] || 0) + 1;
    }

    // 7. Apply Filters to Events
    let filteredEvents = events;
    if (filterAction !== "ALL") {
      filteredEvents = filteredEvents.filter((e) => e.category === filterAction || e.action === filterAction);
    }
    if (searchQuery) {
      filteredEvents = filteredEvents.filter((e) => {
        return (
          e.user.email.toLowerCase().includes(searchQuery) ||
          e.user.name.toLowerCase().includes(searchQuery) ||
          (e.user.dragonId && e.user.dragonId.toLowerCase().includes(searchQuery)) ||
          e.device.ipAddress.includes(searchQuery) ||
          e.device.os.toLowerCase().includes(searchQuery) ||
          e.device.browser.toLowerCase().includes(searchQuery) ||
          e.location.toLowerCase().includes(searchQuery) ||
          e.action.toLowerCase().includes(searchQuery) ||
          e.details.toLowerCase().includes(searchQuery)
        );
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers,
        totalLogins,
        totalDragonIds,
        totalActiveDevices,
        signInsLast24h,
        osCounts,
        browserCounts,
        countryCounts,
        actionCounts,
      },
      events: filteredEvents,
      players,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Telemetry Error";
    console.error("[API Telemetry] Error:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
