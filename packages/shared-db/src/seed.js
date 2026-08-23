const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Neon PostgreSQL 18 foundation for Dragon Studios...");

  const games = [
    {
      slug: "uncharted-drive-beyond",
      title: "Uncharted Drive: Beyond",
      subtitle: "Next-Gen Open Road Driving Simulation",
      genre: "Open Road Simulation",
      status: "OFFICIAL RELEASE",
      year: "2026",
      description: "Experience high-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with next-gen vehicle dynamics.",
      fullDescription: "Uncharted Drive: Beyond brings next-generation vehicle physics, realistic handling dynamics, and volumetric sunset weather cycles to scenic coastal and mountain highway networks.",
      palette: "from-[#ea580c] via-[#431407] to-[#02050E]",
      accentColor: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.5)",
      platforms: "PC (.exe), Android (.apk)",
      tags: "Driving Simulation, Open Highway, Sunset Horizons, Physics Core",
      featured: true,
      heroImage: "/images/uncharted-drive-banner.png"
    },
    {
      slug: "reflex-rush",
      title: "Reflex Rush",
      subtitle: "High-Speed Reflex Reaction Runner",
      genre: "Arcade Reflex",
      status: "LIVE WEB PLAY",
      year: "2026",
      description: "Test your lightning reflexes in pure speed adrenaline gameplay. Dodge obstacles, beat high scores, and master rapid-fire runs live in your browser.",
      fullDescription: "Reflex Rush is an instant-play web arcade runner crafted with high precision input buffering and dynamic rhythm beat obstacles.",
      palette: "from-[#0284c7] via-[#082f49] to-[#02050E]",
      accentColor: "#00f0ff",
      glowColor: "rgba(0, 240, 255, 0.5)",
      platforms: "Web Browser (Live), Mobile Web",
      tags: "Arcade Runner, Reaction Speed, Live Web, Instant Play",
      featured: true,
      heroImage: "/images/uncharted-drive-banner.png"
    }
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game
    });
    console.log(`Upserted game: ${game.title}`);

    const featuresObj = {
      dimension: game.slug === "reflex-rush" ? "2D" : "3D",
      engineVersion: game.slug === "reflex-rush" ? "Dragon Speed Web Core" : "Dragon Driving Engine 3D",
      pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D_Setup.exe",
      pcFileSize: "650 MB",
      mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D.apk",
      mobileFileSize: "120 MB",
      webPlayUrl: game.slug === "reflex-rush" ? "https://reflexrush-dragongamingstudio.netlify.app/" : "",
    };

    await prisma.gameContent.upsert({
      where: { slug: game.slug },
      update: {
        name: game.title,
        subtitle: game.subtitle,
        genre: game.genre,
        status: game.status,
        releaseDate: game.year,
        developer: "Dragon Gaming Studio",
        publisher: "Dragon Interactive",
        engine: game.slug === "reflex-rush" ? "Dragon Speed Web Core" : "Dragon Driving Engine 3D",
        platforms: game.platforms,
        description: game.description,
        bannerUrl: game.heroImage,
        logoUrl: "/images/dragon-logo.jpg",
        features: JSON.stringify(featuresObj),
        isPublished: true,
      },
      create: {
        slug: game.slug,
        name: game.title,
        subtitle: game.subtitle,
        genre: game.genre,
        status: game.status,
        releaseDate: game.year,
        developer: "Dragon Gaming Studio",
        publisher: "Dragon Interactive",
        engine: game.slug === "reflex-rush" ? "Dragon Speed Web Core" : "Dragon Driving Engine 3D",
        platforms: game.platforms,
        description: game.description,
        bannerUrl: game.heroImage,
        logoUrl: "/images/dragon-logo.jpg",
        features: JSON.stringify(featuresObj),
        isPublished: true,
      }
    });
    console.log(`Upserted GameContent: ${game.title}`);
  }

  const userCount = await prisma.user.count();
  const gameCount = await prisma.game.count();
  console.log(`Neon Database ready: ${gameCount} games verified, ${userCount} users registered.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
