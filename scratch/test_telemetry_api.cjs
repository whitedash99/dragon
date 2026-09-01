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

async function testApi() {
  console.log("Testing exact queries in api/telemetry/route.ts...");

  try {
    console.log("1. Querying users...");
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
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
    console.log("Users queried successfully:", users.length);

    console.log("2. Querying auditLogs...");
    const auditLogs = await prisma.auditLog.findMany({
      take: 250,
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
    console.log("Audit logs queried successfully:", auditLogs.length);

    console.log("3. Querying devices...");
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
    console.log("Devices queried successfully:", devices.length);

    console.log("ALL QUERIES PASSED WITH ZERO ERRORS!");
  } catch (err) {
    console.error("QUERY ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
