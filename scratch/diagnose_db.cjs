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

async function run() {
  console.log("=== CHECKING NEON POSTGRESQL DATABASE ===");
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      devices: true,
      sessions: true,
    }
  });
  console.log("Total Users in DB:", users.length);
  for (const u of users) {
    console.log(`- User: ${u.email} | Name: ${u.name} | DragonId: ${u.dragonId} | Role: ${u.role} | Devices: ${u.devices?.length} | Sessions: ${u.sessions?.length}`);
  }

  const auditLogs = await prisma.auditLog.findMany({ take: 20, orderBy: { createdAt: "desc" } });
  console.log("\nTotal Audit Logs in DB:", auditLogs.length);
  for (const a of auditLogs) {
    console.log(`- Audit: ${a.action} | Email: ${a.userEmail} | Details: ${a.details} | IP: ${a.ipAddress} | Created: ${a.createdAt}`);
  }

  const devices = await prisma.userDevice.findMany();
  console.log("\nTotal User Devices in DB:", devices.length);
  for (const d of devices) {
    console.log(`- Device: ${d.deviceId} | UserID: ${d.userId} | Browser: ${d.browser} | OS: ${d.os} | IP: ${d.ipAddress}`);
  }

  await prisma.$disconnect();
}

run().catch(console.error);
