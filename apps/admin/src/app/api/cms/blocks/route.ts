import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { triggerWebsiteRevalidation } from "@/lib/sync/revalidate-website";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CMS_BLOCKS = [
  // ═══ HOMEPAGE LAYOUT SECTIONS (ON / OFF BLOCKS) ═══
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
    isPublished: false, // Default OFF as requested
  },
  {
    key: "homepage.discord_realm",
    category: "Homepage Layout",
    label: "Discord & Community Realm Card",
    type: "boolean",
    content: "Discord community invitation card with direct connect button",
    isPublished: false, // Default OFF as requested
  },
  {
    key: "homepage.secondary_game",
    category: "Homepage Layout",
    label: "Secondary Arcade / Web Play Card",
    type: "boolean",
    content: "Reflex Rush and browser-playable game spotlight",
    isPublished: false, // Default OFF as requested
  },
  {
    key: "homepage.newsletter",
    category: "Homepage Layout",
    label: "Newsletter Dispatch Network",
    type: "boolean",
    content: "Email capture box for player dispatches and beta access",
    isPublished: false, // Default OFF as requested
  },
  {
    key: "footer.brand_sitemap",
    category: "Footer Layout",
    label: "Footer Brand & Sitemap",
    type: "boolean",
    content: "Luxury single-color studio footer with copyright and sitemap",
    isPublished: true,
  },

  // ═══ CONTENT TEXT BLOCKS ═══
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
    label: "Hero Primary Button",
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
  {
    key: "games.eyebrow",
    category: "Games",
    label: "Games Eyebrow Badge",
    type: "text",
    content: "OUR PORTFOLIO",
    isPublished: true,
  },
  {
    key: "games.title",
    category: "Games",
    label: "Games Section Title",
    type: "text",
    content: "ORIGINAL FRANCHISES",
    isPublished: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let blocks = await prisma.contentBlock.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    // Auto-seed defaults if database is empty
    if (blocks.length === 0) {
      console.log("[CMS Blocks] Seeding initial layout and content blocks into Neon PostgreSQL...");
      for (const def of DEFAULT_CMS_BLOCKS) {
        await prisma.contentBlock.create({
          data: {
            key: def.key,
            category: def.category,
            label: def.label,
            type: def.type,
            content: def.content,
            isPublished: def.isPublished,
            version: 1,
            updatedBy: "System Seeder",
          },
        }).catch(() => null);
      }

      blocks = await prisma.contentBlock.findMany({
        orderBy: [{ category: "asc" }, { key: "asc" }],
      });
    }

    let filtered = blocks;
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((b) => 
        b.key.toLowerCase().includes(q) ||
        b.label.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q)
      );
    }

    const categories = Array.from(new Set(blocks.map((b) => b.category)));

    return NextResponse.json({
      success: true,
      blocks: filtered,
      total: blocks.length,
      activeCount: blocks.filter((b) => b.isPublished).length,
      disabledCount: blocks.filter((b) => !b.isPublished).length,
      categories: ["All", ...categories],
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const overallStart = Date.now();
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { key, content, draftContent, isPublished, category, label, type } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ success: false, error: "ContentBlock key is required." }, { status: 400 });
    }

    const author = auth.user.email || "Admin";
    const safeContent = content !== undefined ? String(content) : "";
    const safeDraftContent = draftContent !== undefined ? String(draftContent) : null;

    const existing = await prisma.contentBlock.findUnique({ where: { key } });

    if (existing && existing.content !== safeContent && isPublished !== false) {
      await prisma.contentRevision.create({
        data: {
          blockKey: key,
          version: existing.version,
          content: existing.content,
          changedBy: author,
        },
      }).catch((e) => console.warn("Revision creation warning:", e));
    }

    const nextVersion = existing ? existing.version + 1 : 1;

    const dbStart = Date.now();
    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: {
        content: isPublished !== false ? safeContent : existing?.content || safeContent,
        draftContent: safeDraftContent,
        isPublished: isPublished !== undefined ? isPublished : true,
        category: category || existing?.category || "General",
        label: label || existing?.label || key,
        type: type || existing?.type || "text",
        version: nextVersion,
        updatedBy: author,
        updatedAt: new Date(),
      },
      create: {
        key,
        category: category || "General",
        label: label || key,
        type: type || "text",
        content: safeContent,
        draftContent: safeDraftContent,
        isPublished: isPublished !== undefined ? isPublished : true,
        version: nextVersion,
        updatedBy: author,
      },
    });
    const dbDurationMs = Date.now() - dbStart;

    // Trigger website revalidation
    const revalResult = await triggerWebsiteRevalidation({
      tags: ["cms-blocks", "homepage"],
      paths: ["/"],
    });

    const totalDurationMs = Date.now() - overallStart;

    return NextResponse.json({
      success: true,
      block,
      telemetry: {
        dbMs: dbDurationMs,
        cacheMs: revalResult.durationMs,
        totalMs: totalDurationMs,
        revalidated: revalResult.success,
      },
      message: `Block [${key}] saved successfully.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ success: false, error: "Key parameter is required" }, { status: 400 });
    }

    await prisma.contentBlock.delete({
      where: { key },
    }).catch(() => null);

    await triggerWebsiteRevalidation({
      tags: ["cms-blocks", "homepage"],
      paths: ["/"],
    });

    return NextResponse.json({
      success: true,
      message: `Block [${key}] deleted successfully.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database delete error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
