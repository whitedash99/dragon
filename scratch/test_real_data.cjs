const path = require("path");
const fs = require("fs");

const envPath = path.join(__dirname, "../apps/website/.env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}

const { PrismaClient } = require("../packages/shared-db/src/generated/client");
const prisma = new PrismaClient();

function parseUserAgentDetails(ua) {
  if (!ua) return { browser: "Google Chrome", os: "Windows 11 / 10", deviceType: "Desktop" };
  const str = ua.toLowerCase();
  let deviceType = "Desktop";
  if (str.includes("ipad") || str.includes("tablet") || (str.includes("android") && !str.includes("mobi"))) {
    deviceType = "Tablet";
  } else if (str.includes("mobile") || str.includes("iphone") || (str.includes("android") && str.includes("mobi"))) {
    deviceType = "Mobile";
  }
  let os = "Windows 11 / 10";
  if (str.includes("windows nt 10.0") || str.includes("windows 10") || str.includes("windows 11")) os = "Windows 11 / 10";
  else if (str.includes("macintosh") || str.includes("mac os x")) os = "macOS (Apple)";
  else if (str.includes("iphone") || str.includes("ipad")) os = "iOS (Apple iPhone)";
  else if (str.includes("android")) os = "Android Mobile";
  else if (str.includes("linux")) os = "Linux";

  let browser = "Google Chrome";
  if (str.includes("edg/") || str.includes("edge/")) browser = "Microsoft Edge";
  else if (str.includes("chrome/") && !str.includes("edg/")) browser = "Google Chrome";
  else if (str.includes("safari/") && !str.includes("chrome/")) browser = "Apple Safari";
  else if (str.includes("firefox/")) browser = "Mozilla Firefox";

  return { browser, os, deviceType };
}

async function run() {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      devices: { orderBy: { lastUsedAt: "desc" }, take: 10 },
      sessions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const auditLogs = await prisma.auditLog.findMany({
    take: 300,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { profile: true, devices: { take: 3 } }
      }
    }
  });

  const devices = await prisma.userDevice.findMany({
    take: 200,
    orderBy: { lastUsedAt: "desc" },
  });

  const totalUsers = users.length;
  const totalLogins = users.reduce((acc, u) => acc + (u.loginCount || 1), 0);
  const totalDragonIds = users.filter(u => !!u.dragonId).length;
  const totalDevices = devices.length;

  console.log("=== EXACT REAL DB SUMMARY ===");
  console.log({
    totalUsers,
    totalLogins,
    totalDragonIds,
    totalDevices,
    auditLogsCount: auditLogs.length,
  });

  // Calculate OS counts from REAL devices
  const osCounts = {};
  const browserCounts = {};
  for (const d of devices) {
    const parsed = parseUserAgentDetails(d.browser);
    const os = d.os || parsed.os;
    const br = parsed.browser;
    osCounts[os] = (osCounts[os] || 0) + 1;
    browserCounts[br] = (browserCounts[br] || 0) + 1;
  }

  console.log("\n=== REAL OS COUNTS FROM DB ===");
  console.log(osCounts);

  console.log("\n=== REAL BROWSER COUNTS FROM DB ===");
  console.log(browserCounts);

  await prisma.$disconnect();
}

run();
