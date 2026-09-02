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

async function inspectUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      dragonId: true,
      role: true,
      provider: true,
      loginCount: true,
      createdAt: true,
      lastLogin: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("=== ALL USERS IN POSTGRESQL (" + users.length + ") ===");
  users.forEach((u, i) => {
    console.log(`${i + 1}. [${u.email}] Name: "${u.name}" | DragonID: "${u.dragonId}" | Role: "${u.role}" | Provider: "${u.provider}" | Logins: ${u.loginCount} | Created: ${u.createdAt.toISOString()}`);
  });

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  console.log("\n=== LATEST AUDIT LOGS (" + auditLogs.length + ") ===");
  auditLogs.forEach((a, i) => {
    console.log(`${i + 1}. [${a.action}] User: ${a.userEmail || a.userId} | Details: "${a.details}" | IP: ${a.ipAddress} | At: ${a.createdAt.toISOString()}`);
  });

  await prisma.$disconnect();
}

inspectUsers().catch(console.error);
