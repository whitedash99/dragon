import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const key = searchParams.get("key");

    if (key) {
      const block = await prisma.contentBlock.findUnique({ where: { key } });
      return NextResponse.json({ success: true, block }, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      });
    }

    const blocks = await prisma.contentBlock.findMany({
      where: category && category !== "All" ? { category } : undefined,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, blocks }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, category, label, type, content, isPublished, updatedBy } = body;

    if (!key || !content) {
      return NextResponse.json({ success: false, error: "Key and content are required" }, { status: 400 });
    }

    const existing = await prisma.contentBlock.findUnique({ where: { key } });

    if (existing) {
      await prisma.contentRevision.create({
        data: {
          blockKey: key,
          version: existing.version,
          content: existing.content,
          changedBy: updatedBy || "Admin",
        },
      });
    }

    const nextVersion = existing ? existing.version + 1 : 1;

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: {
        content: isPublished !== false ? content : existing?.content || content,
        draftContent: content,
        isPublished: isPublished ?? true,
        version: nextVersion,
        updatedBy: updatedBy || "Admin",
      },
      create: {
        key,
        category: category || "General",
        label: label || key,
        type: type || "text",
        content,
        draftContent: content,
        isPublished: isPublished ?? true,
        version: nextVersion,
        updatedBy: updatedBy || "Admin",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "COMMIT_CMS_BLOCK",
        userEmail: updatedBy || "Admin",
        details: `Saved CMS Block [${key}] -> Version ${nextVersion}`,
      },
    });

    // On-Demand Revalidation & Cache Invalidation Across Public Routes
    try {
      revalidatePath("/", "layout");
      revalidateTag("cms-blocks");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ success: true, block }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
