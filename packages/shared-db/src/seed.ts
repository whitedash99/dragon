import { prisma } from "./client";

async function main() {
  console.log("Seeding Neon PostgreSQL 18 foundation for Dragon Studios...");

  const games = [
    {
      slug: "dragon-slayer-3d",
      title: "Dragon Slayer 3D",
      subtitle: "Realm of Fire & Ancient Runes",
      genre: "Action RPG",
      status: "ACTIVE DEVELOPMENT",
      year: "2026",
      description: "An epic high-octane 3D dark fantasy action RPG built with real-time particle dynamics and physical combat netcode.",
      fullDescription: "Ascend the mountain peak of Valyria, forge ancestral dragon-forged steel, and conquer mythical leviathans in high-definition physical rendering.",
      palette: "from-[#dc2626] via-[#450a0a] to-[#02050E]",
      accentColor: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.4)",
      platforms: "PC (.exe), Mobile (.apk), Cross-Play",
      tags: "3D, Action RPG, Dragon Slayer, Ray Tracing",
      featured: true,
      heroImage: "/images/dragon_slayer_card.jpg"
    },
    {
      slug: "cyber-drift-3d",
      title: "Cyber Drift 3D",
      subtitle: "Neo-Tokyo Overdrive",
      genre: "Cyberpunk Racing",
      status: "ALPHA PLAYTEST",
      year: "2026",
      description: "High-velocity futuristic anti-gravity drift racing through neon-soaked cybernetic megacities with custom telemetry.",
      fullDescription: "Master high-speed anti-gravity vector drift mechanics, tune your cyber vehicle chassis, and race against elite syndicate drivers on global leaderboards.",
      palette: "from-[#06b6d4] via-[#082f49] to-[#02050E]",
      accentColor: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.4)",
      platforms: "PC (.exe), Mobile (.apk), Cross-Play",
      tags: "3D, Cyberpunk, Anti-Gravity Racing, Neon",
      featured: true,
      heroImage: "/images/cyber_drift_card.jpg"
    },
    {
      slug: "shadow-ninja-2d",
      title: "Shadow Ninja 2D",
      subtitle: "Clan of the Eclipse",
      genre: "Stealth Action Platformer",
      status: "EARLY ACCESS",
      year: "2026",
      description: "Fast-paced stylized 2D stealth martial arts platformer featuring frame-perfect katana parries and shuriken combat.",
      fullDescription: "Infiltrate feudal celestial fortresses, utilize smoke arts and grapple physics, and defeat rogue warlords across handcrafted pixel-precision arenas.",
      palette: "from-[#a855f7] via-[#2e1065] to-[#02050E]",
      accentColor: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.4)",
      platforms: "PC (.exe), Mobile (.apk), Cross-Play",
      tags: "2D, Stealth, Katana Combat, Martial Arts",
      featured: true,
      heroImage: "/images/shadow_ninja_card.jpg"
    }
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game
    });
    console.log(`Upserted game: ${game.title}`);
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
