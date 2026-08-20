const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dragon Platform shared PostgreSQL database...");

  // 1. Seed Owner Accounts
  const ownerList = [
    {
      email: "whitedash99@gmail.com",
      name: "Dragon Platform Owner (WhiteDash)",
      password: "DragonFounder#2026!",
    },
    {
      email: "dragongamingstudio1212@gmail.com",
      name: "Dragon Gaming Studio Owner",
      password: "DragonFounder#2026!",
    },
    {
      email: "owner@dragonstudios.com",
      name: "Dragon Platform Owner",
      password: "DragonOwner#2026",
    },
  ];

  for (const o of ownerList) {
    const ownerHash = await bcrypt.hash(o.password, 10);
    const owner = await prisma.user.upsert({
      where: { email: o.email },
      update: {
        password: ownerHash,
        role: "OWNER",
        status: "ACTIVE",
        isActive: true,
        isProtected: true,
        securityScore: 100,
        permissions: JSON.stringify(["*"]),
      },
      create: {
        email: o.email,
        password: ownerHash,
        name: o.name,
        role: "OWNER",
        department: "Executive Leadership",
        status: "ACTIVE",
        isActive: true,
        isProtected: true,
        permissions: JSON.stringify(["*"]),
      },
    });
    console.log(`✓ Owner account ready: ${owner.email}`);
  }

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
      content: "We craft original 3D & 2D games for PC and Mobile with high-performance graphics and immersive storytelling.",
      isPublished: true,
    },
    {
      key: "announcement_banner",
      category: "Global",
      label: "Top Announcement Banner",
      type: "text",
      content: "🔥 DRAGON SLAYER 3D & NEON DRIFT — PC & MOBILE BUILDS READY",
      isPublished: true,
    },
    {
      key: "footer_tagline",
      category: "Footer",
      label: "Footer Studio Tagline",
      type: "textarea",
      content: "Dragon Studios is an independent game development studio creating original 3D and 2D games for PC and Mobile.",
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

  // 3. Seed Dragon 3D & 2D Games with PC (.exe) & Mobile (.apk) Builds
  const dragonGames = [
    {
      slug: "dragon-slayer-3d",
      name: "Dragon Slayer 3D: Realm of Fire",
      genre: "3D Action RPG • Open World",
      status: "Live Released",
      releaseDate: "2026",
      developer: "Dragon Studios",
      publisher: "Dragon Interactive",
      engine: "Dragon 3D Engine",
      platforms: "PC (.exe), Android (.apk)",
      description: "An epic 3D open-world fantasy action RPG built by Dragon Studios. Battle ancient dragons, forge legendary gear, and explore vast immersive landscapes.",
      isPublished: true,
      features: JSON.stringify({
        dimension: "3D",
        engineVersion: "Dragon Engine v5.4",
        pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D_Setup.exe",
        pcFileSize: "650 MB",
        mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D.apk",
        mobileFileSize: "120 MB",
      }),
      requirements: "PC: Windows 10/11, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM",
    },
    {
      slug: "cyber-drift-3d",
      name: "Cyber Drift 3D: Overdrive",
      genre: "3D Anti-Gravity Racing",
      status: "Live Released",
      releaseDate: "2026",
      developer: "Dragon Studios",
      publisher: "Dragon Interactive",
      engine: "Dragon 3D Engine",
      platforms: "PC (.exe), Android (.apk)",
      description: "High-octane 3D tactical anti-gravity racing on futuristic neon tracks with reactive synthwave audio and 120 FPS high-refresh physics.",
      isPublished: true,
      features: JSON.stringify({
        dimension: "3D",
        engineVersion: "Dragon Engine Ultra",
        pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/CyberDrift3D_Setup.exe",
        pcFileSize: "480 MB",
        mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/CyberDrift3D.apk",
        mobileFileSize: "95 MB",
      }),
      requirements: "PC: Windows 10/11, 8GB RAM, GTX 1050+ | Mobile: Android 9+, 3GB RAM",
    },
    {
      slug: "shadow-ninja-2d",
      name: "Shadow Ninja 2D",
      genre: "2D Action Platformer & Boss Battles",
      status: "Live Released",
      releaseDate: "2026",
      developer: "Dragon Studios",
      publisher: "Dragon Interactive",
      engine: "Dragon 2D Engine",
      platforms: "PC (.exe), Android (.apk)",
      description: "Fast-paced 2D ninja action platformer featuring katana slicing, wall running, intense multi-phase boss fights, and pixel-perfect controls.",
      isPublished: true,
      features: JSON.stringify({
        dimension: "2D",
        engineVersion: "Dragon 2D Engine",
        pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/ShadowNinja2D_Setup.exe",
        pcFileSize: "240 MB",
        mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/ShadowNinja2D.apk",
        mobileFileSize: "65 MB",
      }),
      requirements: "PC: Windows 7/8/10/11, 4GB RAM | Mobile: Android 8+, 2GB RAM",
    },
    {
      slug: "dragon-kingdom-2d",
      name: "Dragon Kingdom Chronicles",
      genre: "2D Fantasy Strategy RPG",
      status: "Early Access",
      releaseDate: "2026",
      developer: "Dragon Studios",
      publisher: "Dragon Interactive",
      engine: "Dragon 2D Engine",
      platforms: "PC (.exe), Android (.apk)",
      description: "Tactical 2D kingdom builder and hero strategy RPG. Defend dragon castles, command magical armies, and conquer enemy territory.",
      isPublished: true,
      features: JSON.stringify({
        dimension: "2D",
        engineVersion: "Dragon 2D Engine",
        pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonKingdom_Setup.exe",
        pcFileSize: "310 MB",
        mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonKingdom.apk",
        mobileFileSize: "80 MB",
      }),
      requirements: "PC: Windows 7/8/10/11, 4GB RAM | Mobile: Android 8+, 2GB RAM",
    },
  ];

  for (const g of dragonGames) {
    await prisma.gameContent.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
    console.log(`✓ Seeded Dragon Game: ${g.name} (${g.slug})`);
  }

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
