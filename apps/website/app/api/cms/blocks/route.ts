import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CMS_BLOCKS = [
  {
    key: "homepage.hero",
    category: "Homepage Layout",
    label: "Hero Section (Headline & CTAs)",
    type: "boolean",
    content: "Hero section with mission statement and action buttons",
    isPublished: true,
  },
  {
    key: "homepage.featured_games",
    category: "Homepage Layout",
    label: "Featured Games Showcase",
    type: "boolean",
    content: "Interactive 3D/2D game slider showcasing canonical titles",
    isPublished: true,
  },
  {
    key: "homepage.news",
    category: "Homepage Layout",
    label: "Latest Dispatches & News",
    type: "boolean",
    content: "Studio news, dev dispatches, and engineering updates",
    isPublished: false,
  },
  {
    key: "homepage.discord_realm",
    category: "Homepage Layout",
    label: "Discord & Community Realm Card",
    type: "boolean",
    content: "Discord community invitation card with direct connect button",
    isPublished: false,
  },
  {
    key: "homepage.secondary_game",
    category: "Homepage Layout",
    label: "Secondary Arcade / Web Play Card",
    type: "boolean",
    content: "Reflex Rush and browser-playable game spotlight",
    isPublished: false,
  },
  {
    key: "homepage.newsletter",
    category: "Homepage Layout",
    label: "Newsletter Dispatch Network",
    type: "boolean",
    content: "Email capture box for player dispatches and beta access",
    isPublished: false,
  },
  {
    key: "footer.brand_sitemap",
    category: "Footer Layout",
    label: "Footer Brand & Sitemap",
    type: "boolean",
    content: "Luxury single-color studio footer with copyright and sitemap",
    isPublished: true,
  },
  {
    key: "hero.eyebrow",
    category: "Hero",
    label: "Hero Eyebrow Badge",
    type: "text",
    content: "✦ INDEPENDENT 3D & 2D GAME DEVELOPMENT STUDIO",
    isPublished: true,
  },
  {
    key: "hero.title",
    category: "Hero",
    label: "Hero Main Headline",
    type: "text",
    content: "FORGING WORLDS BEYOND REALITY",
    isPublished: true,
  },
  {
    key: "hero.subheadline",
    category: "Hero",
    label: "Hero Subheadline Description",
    type: "textarea",
    content: "Dragon Studios crafts original 3D & 2D games for PC and Mobile with high-performance gameplay and immersive storytelling.",
    isPublished: true,
  },
  {
    key: "hero.announcement",
    category: "Hero",
    label: "Top Announcement Banner",
    type: "text",
    content: "DRAGON SLAYER 3D & NEON DRIFT — PC & MOBILE BUILDS READY",
    isPublished: true,
  },
  {
    key: "hero.cta_primary",
    category: "Hero",
    label: "Primary Call to Action Button",
    type: "text",
    content: "EXPLORE GAMES",
    isPublished: true,
  },
  {
    key: "hero.cta_secondary",
    category: "Hero",
    label: "Hero Secondary Button",
    type: "text",
    content: "GET LAUNCHER",
    isPublished: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let blocks = await prisma.contentBlock.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    if (blocks.length === 0) {
      blocks = DEFAULT_CMS_BLOCKS as any;
    }

    let filtered = blocks;
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      blocks: filtered,
      total: filtered.length,
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: true,
      blocks: DEFAULT_CMS_BLOCKS,
      total: DEFAULT_CMS_BLOCKS.length,
    });
  }
}
