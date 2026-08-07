import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllContentBlocks, DEFAULT_CONTENT_BLOCKS } from "@/lib/cms";

// GET: Fetch all content blocks (merged DB + defaults)
export async function GET() {
  try {
    const blocks = await getAllContentBlocks();
    return NextResponse.json({ success: true, blocks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Save, Publish, Auto-save or Reset content blocks
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, key, content, draftContent, category, label, type } = body;

    // 1. Reset all blocks to default seed
    if (action === "reset_all") {
      await prisma.contentBlock.deleteMany({});
      await prisma.contentRevision.deleteMany({});
      const blocks = await getAllContentBlocks();
      return NextResponse.json({ success: true, message: "All content reset to defaults", blocks });
    }

    // 2. Publish all draft changes across all blocks
    if (action === "publish_all") {
      const allBlocks = await prisma.contentBlock.findMany();
      for (const block of allBlocks) {
        if (block.draftContent && block.draftContent !== block.content) {
          // Record version history
          await prisma.contentRevision.create({
            data: {
              blockKey: block.key,
              content: block.content,
              version: block.version,
              changedBy: "Admin",
            },
          });

          await prisma.contentBlock.update({
            where: { id: block.id },
            data: {
              content: block.draftContent,
              isPublished: true,
              version: block.version + 1,
            },
          });
        }
      }
      const updated = await getAllContentBlocks();
      return NextResponse.json({ success: true, message: "All draft changes published live", blocks: updated });
    }

    // 3. Single block action: save / draft / publish / reset / history
    if (!key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    const defaultBlock = DEFAULT_CONTENT_BLOCKS.find((b) => b.key === key);
    const blockCategory = category || defaultBlock?.category || "Homepage";
    const blockLabel = label || defaultBlock?.label || key;
    const blockType = type || defaultBlock?.type || "text";

    const existing = await prisma.contentBlock.findUnique({
      where: { key },
    });

    if (action === "reset_single") {
      const defaultText = defaultBlock?.content || "";
      if (existing) {
        await prisma.contentBlock.update({
          where: { key },
          data: {
            content: defaultText,
            draftContent: defaultText,
            isPublished: true,
            version: existing.version + 1,
          },
        });
      }
      const blocks = await getAllContentBlocks();
      return NextResponse.json({ success: true, message: `Key ${key} reset to default`, blocks });
    }

    if (action === "save_draft") {
      const updated = await prisma.contentBlock.upsert({
        where: { key },
        create: {
          key,
          category: blockCategory,
          label: blockLabel,
          type: blockType,
          content: defaultBlock?.content || draftContent || "",
          draftContent: draftContent || content || "",
          isPublished: false,
          version: 1,
        },
        update: {
          draftContent: draftContent || content,
          isPublished: false,
        },
      });
      return NextResponse.json({ success: true, block: updated });
    }

    // Default action: Immediate Save & Publish
    const newContent = content !== undefined ? content : defaultBlock?.content || "";
    
    let updatedBlock;
    if (existing) {
      // Create version history if content changed
      if (existing.content !== newContent) {
        await prisma.contentRevision.create({
          data: {
            blockKey: existing.key,
            content: existing.content,
            version: existing.version,
            changedBy: "Admin",
          },
        });
      }

      updatedBlock = await prisma.contentBlock.update({
        where: { key },
        data: {
          content: newContent,
          draftContent: newContent,
          isPublished: true,
          version: existing.content !== newContent ? existing.version + 1 : existing.version,
        },
      });
    } else {
      updatedBlock = await prisma.contentBlock.create({
        data: {
          key,
          category: blockCategory,
          label: blockLabel,
          type: blockType,
          content: newContent,
          draftContent: newContent,
          isPublished: true,
          version: 1,
        },
      });
    }

    const blocks = await getAllContentBlocks();
    return NextResponse.json({ success: true, message: "Content updated and published", block: updatedBlock, blocks });
  } catch (error: any) {
    console.error("Error updating CMS content:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
