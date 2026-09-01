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
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, dragonId: true, role: true, loginCount: true, createdAt: true, lastLogin: true }
  });
  console.log("=== USERS IN DATABASE (" + users.length + ") ===");
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}
run();
