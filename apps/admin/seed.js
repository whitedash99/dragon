const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dragon Platform shared PostgreSQL database...");

  // 1. Seed Owner Account
  const ownerEmail = "owner@dragonstudios.com";
  const ownerHash = await bcrypt.hash("DragonOwner#2026", 10);

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      password: ownerHash,
      role: "OWNER",
      status: "ACTIVE",
    },
    create: {
      email: ownerEmail,
      password: ownerHash,
      name: "Dragon Platform Owner",
      role: "OWNER",
      department: "Executive Leadership",
      status: "ACTIVE",
    },
  });
  console.log(`✓ Owner account ready: ${owner.email}`);

  // 2. Seed Admin Account
  const adminEmail = "admin@dragonstudios.com";
  const adminHash = await bcrypt.hash("DragonAdmin#2026", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHash,
      role: "ADMINISTRATOR",
      status: "ACTIVE",
    },
    create: {
      email: adminEmail,
      password: adminHash,
      name: "Dragon System Admin",
      role: "ADMINISTRATOR",
      department: "Engineering",
      status: "ACTIVE",
    },
  });
  console.log(`✓ Admin account ready: ${admin.email}`);

  // 3. Seed Essential CMS Content Blocks
  const defaultBlocks = [
    {
      key: "hero_headline",
      category: "Homepage",
      label: "Hero Main Headline",
      type: "text",
      content: "FORGING WORLDS BEYOND IMAGINATION",
      isPublished: true,
    },
    {
      key: "hero_subheadline",
      category: "Homepage",
      label: "Hero Subheadline Description",
      type: "textarea",
      content: "We craft AAA interactive experiences that push the boundaries of real-time graphics and cinematic storytelling.",
      isPublished: true,
    },
    {
      key: "announcement_banner",
      category: "Global",
      label: "Top Announcement Banner",
      type: "text",
      content: "🔥 PROJECT DRAGON REAL-TIME ALPHA EXPANSION LIVE NOW — JOIN COMMUNITY ACCESS",
      isPublished: true,
    },
    {
      key: "footer_tagline",
      category: "Footer",
      label: "Footer Studio Tagline",
      type: "textarea",
      content: "Dragon Studios is a premier game development powerhouse. Transporting players into uncharted digital dimensions.",
      isPublished: true,
    },
  ];

  for (const block of defaultBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: { content: block.content },
      create: block,
    });
  }
  console.log("✓ Essential CMS Content Blocks seeded.");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
