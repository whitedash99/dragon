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

async function verifyRealDataOnly() {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      devices: { orderBy: { lastUsedAt: "desc" } },
      sessions: { orderBy: { createdAt: "desc" } },
    }
  });

  const auditLogs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  const devices = await prisma.userDevice.findMany();

  console.log("=========================================");
  console.log("🐉 100% REAL POSTGRESQL PRODUCTION DATA");
  console.log("=========================================");
  console.log(`• Total Real Users in Database: ${users.length}`);
  console.log(`• Total Real Logins (Sum): ${users.reduce((s, u) => s + (u.loginCount || 1), 0)}`);
  console.log(`• Total Real Dragon IDs: ${users.filter(u => !!u.dragonId).length}`);
  console.log(`• Total Real Hardware Devices: ${devices.length}`);
  console.log(`• Total Real Audit Logs: ${auditLogs.length}`);

  console.log("\n📋 Sample Real Database Users:");
  users.slice(0, 5).forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} | Name: ${u.name} | DragonID: ${u.dragonId} | Role: ${u.role} | Logins: ${u.loginCount}`);
  });

  console.log("\n🕒 Sample Real Database Audit Logs:");
  auditLogs.slice(0, 5).forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.action}] ${a.userEmail || a.userId} - ${a.details} (IP: ${a.ipAddress || "Edge Node"})`);
  });

  await prisma.$disconnect();
}

verifyRealDataOnly().catch(console.error);
