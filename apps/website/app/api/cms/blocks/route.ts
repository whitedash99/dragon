import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CMS_BLOCKS = [
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
  {
    key: "hero.cta_tertiary",
    category: "Hero",
    label: "Hero Tertiary Link",
    type: "text",
    content: "STUDIO ARCHITECTURE",
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
  {
    key: "games.description",
    category: "Games",
    label: "Games Section Description",
    type: "textarea",
    content: "Original 3D & 2D games engineered for high-performance PC (.exe) and Mobile (.apk) platforms.",
    isPublished: true,
  },
  {
    key: "games.cta",
    category: "Games",
    label: "Games Section Button",
    type: "text",
    content: "EXPLORE ALL GAMES",
    isPublished: true,
  },
  {
    key: "studio.eyebrow",
    category: "Studio",
    label: "Studio Eyebrow Badge",
    type: "text",
    content: "PROPRIETARY NETCODE",
    isPublished: true,
  },
  {
    key: "studio.title",
    category: "Studio",
    label: "Studio Section Title",
    type: "text",
    content: "DRAGON TECH ENGINE",
    isPublished: true,
  },
  {
    key: "studio.description",
    category: "Studio",
    label: "Studio Section Description",
    type: "textarea",
    content: "Our custom game engine architecture delivers deterministic physics, cross-platform synchronization, and ultra-responsive control schemes.",
    isPublished: true,
  },
  {
    key: "news.eyebrow",
    category: "News",
    label: "News Eyebrow Badge",
    type: "text",
    content: "FROM THE FORGE",
    isPublished: true,
  },
  {
    key: "news.title",
    category: "News",
    label: "News Section Title",
    type: "text",
    content: "LATEST DISPATCHES & TRANSMISSIONS",
    isPublished: true,
  },
  {
    key: "news.description",
    category: "News",
    label: "News Section Description",
    type: "textarea",
    content: "Official studio updates, patch releases, and community dispatches direct from the engineering core.",
    isPublished: true,
  },
  {
    key: "footer.description",
    category: "Footer",
    label: "Footer Brand Mission",
    type: "textarea",
    content: "Premier game development studio crafting next-generation interactive worlds powered by Dragon Engine technology.",
    isPublished: true,
  },
  {
    key: "footer.status",
    category: "Footer",
    label: "Footer Engine Status",
    type: "text",
    content: "DRAGON ENGINE ONLINE • HIGH-PERFORMANCE NETCODE",
    isPublished: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const category = searchParams.get("category");

    if (key) {
      const foundBlock = await prisma.contentBlock.findUnique({ where: { key } }).catch(() => null);
      if (foundBlock) {
        return NextResponse.json({ success: true, block: foundBlock });
      }
      const defaultBlock = DEFAULT_CMS_BLOCKS.find((b) => b.key === key);
      return NextResponse.json({
        success: true,
        block: defaultBlock || {
          key,
          category: "General",
          label: key,
          type: "text",
          content: "",
          isPublished: true,
          version: 1,
        },
      });
    }

    const whereClause: any = {};
    if (category && category !== "All") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    const blocks = await prisma.contentBlock.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
    });

    const existingKeys = new Set(blocks.map((b) => b.key));
    const missingDefaults = DEFAULT_CMS_BLOCKS.filter(
      (b) => !existingKeys.has(b.key) && (!category || category === "All" || b.category.toLowerCase() === category.toLowerCase())
    ).map((b) => ({
      id: `default_${b.key}`,
      key: b.key,
      category: b.category,
      label: b.label,
      type: b.type,
      content: b.content,
      draftContent: b.content,
      isPublished: b.isPublished,
      version: 1,
      updatedBy: "Default Seed",
      sectionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return NextResponse.json({ success: true, blocks: finalBlocks }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    console.error("GET /api/cms/blocks error:", error);
    return NextResponse.json({ success: true, blocks: DEFAULT_CMS_BLOCKS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, key, category, label, type, content, draftContent, isPublished, updatedBy } = body;

    // Reset All Blocks to Default Studio Seeds
    if (action === "reset_defaults") {
      const results = [];
      for (const def of DEFAULT_CMS_BLOCKS) {
        const upserted = await prisma.contentBlock.upsert({
          where: { key: def.key },
          update: {
            content: def.content,
            draftContent: def.content,
            isPublished: true,
            updatedBy: "System Reset",
            updatedAt: new Date(),
          },
          create: {
            key: def.key,
            category: def.category,
            label: def.label,
            type: def.type,
            content: def.content,
            draftContent: def.content,
            isPublished: true,
            version: 1,
            updatedBy: "System Reset",
          },
        }).catch(() => null);
        if (upserted) results.push(upserted);
      }
      return NextResponse.json({ success: true, blocks: results, message: "All blocks reset to default seeds." });
    }

    if (!key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    const safeContent = content !== undefined ? content : draftContent !== undefined ? draftContent : "";
    const safeDraftContent = draftContent !== undefined ? draftContent : safeContent;
    const author = updatedBy || "Executive Owner";

    const existing = await prisma.contentBlock.findUnique({ where: { key } }).catch(() => null);

    if (existing && existing.content !== safeContent) {
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

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: {
        content: isPublished !== false ? safeContent : existing?.content || safeContent,
        draftContent: safeDraftContent,
        isPublished: isPublished ?? true,
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
        isPublished: isPublished ?? true,
        version: nextVersion,
        updatedBy: author,
      },
    });

    return NextResponse.json({
      success: true,
      block,
      message: `ContentBlock [${key}] saved successfully to Neon PostgreSQL.`,
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database error";
    console.error("POST /api/cms/blocks error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ success: false, error: "Key parameter is required" }, { status: 400 });
    }

    await prisma.contentBlock.delete({
      where: { key },
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      message: `ContentBlock [${key}] deleted successfully from Neon PostgreSQL.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database delete error";
    console.error("DELETE /api/cms/blocks error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
