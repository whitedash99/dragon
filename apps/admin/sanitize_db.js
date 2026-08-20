const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Sanitizing all database ContentBlock entries in PostgreSQL...");

  const allBlocks = await prisma.contentBlock.findMany();
  console.log(`Found ${allBlocks.length} content blocks in DB.`);

  const cleanMap = {
    "hero.eyebrow": "✦ INDEPENDENT 3D & 2D GAME DEVELOPMENT STUDIO",
    "hero.announcement": "DRAGON SLAYER 3D & NEON DRIFT — PC & MOBILE BUILDS READY",
    "hero.title": "FORGING WORLDS BEYOND REALITY",
    "hero_headline": "FORGING WORLDS BEYOND REALITY",
    "hero.subheadline": "Dragon Studios crafts original 3D & 2D games for PC and Mobile with high-performance gameplay and immersive storytelling.",
    "hero_subheadline": "Dragon Studios crafts original 3D & 2D games for PC and Mobile with high-performance gameplay and immersive storytelling.",
    "hero.cta_primary": "EXPLORE GAMES",
    "hero.cta_secondary": "JOIN LIVE COMMUNITY",
    "hero.cta_tertiary": "CAREERS & WORKFORCE",
    "announcement_banner": "🔥 DRAGON SLAYER 3D & NEON DRIFT — PC & MOBILE BUILDS READY",
    "footer_tagline": "Dragon Studios is an independent game development studio creating original 3D and 2D games for PC and Mobile.",
    "footer.tagline": "Dragon Studios is an independent game development studio creating original 3D and 2D games for PC and Mobile.",
    "careers.lead": "We're looking for curious, autonomous engineers, artists, and designers who want to craft world-class 3D and 2D games without industrial crunch.",
    "seo.default_title": "Dragon Studios | 3D & 2D Game Development Studio",
    "seo.description": "Dragon Studios - Independent Game Development Studio creating immersive worlds powered by Dragon Engine.",
    "seo.keywords": "Dragon Studios, Game Studio, 3D Games, 2D Games, Dragon Engine, Embers of Valyria",
  };

  for (const [key, cleanContent] of Object.entries(cleanMap)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: { content: cleanContent },
      create: {
        key,
        category: key.startsWith("hero") ? "Hero" : key.startsWith("seo") ? "SEO Metadata" : "Global",
        label: key,
        type: key.includes("subheadline") || key.includes("lead") || key.includes("tagline") || key.includes("description") ? "textarea" : "text",
        content: cleanContent,
        isPublished: true,
      },
    });
    console.log(`✓ Cleaned block: ${key} -> "${cleanContent.substring(0, 40)}..."`);
  }

  // Also do a general regex pass on all other blocks that might contain 'AAA' or 'Triple'
  const remaining = await prisma.contentBlock.findMany();
  for (const b of remaining) {
    if (/\bAAA\b/i.test(b.content) || /Triple\s*L/i.test(b.content) || /blockbuster\s*AAA/i.test(b.content)) {
      const sanitized = b.content
        .replace(/blockbuster\s*AAA/gi, "original 3D & 2D")
        .replace(/\bAAA\b/gi, "3D & 2D")
        .replace(/Triple\s*L/gi, "3D & 2D")
        .trim();
      await prisma.contentBlock.update({
        where: { id: b.id },
        data: { content: sanitized },
      });
      console.log(`✓ Sanitized regex block: ${b.key} -> "${sanitized.substring(0, 40)}..."`);
    }
  }

  console.log("🎉 Database content blocks successfully sanitized with zero AAA/fake data!");
}

main()
  .catch((e) => {
    console.error("Error sanitizing DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
