import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const key = searchParams.get("key");

    if (key) {
      const block = await prisma.contentBlock.findUnique({
        where: { key },
      });
      return NextResponse.json({ success: true, block }, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      });
    }

    const blocks = await prisma.contentBlock.findMany({
      where: category && category !== "All" ? { category } : { isPublished: true },
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
    const { key, category, label, type, content, draftContent, isPublished, updatedBy } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    const safeContent = content !== undefined ? content : draftContent !== undefined ? draftContent : "";
    const safeDraftContent = draftContent !== undefined ? draftContent : safeContent;
    const author = updatedBy || "Dragon Studio Admin";

    const existing = await prisma.contentBlock.findUnique({ where: { key } });
    const nextVersion = existing ? existing.version + 1 : 1;

    if (existing && existing.content !== safeContent) {
      await prisma.contentRevision.create({
        data: {
          blockKey: key,
          version: existing.version,
          content: existing.content,
          changedBy: author,
        },
      }).catch((e: unknown) => console.warn("Revision creation warning:", e));
    }

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: {
        content: isPublished !== false ? safeContent : existing?.content || safeContent,
        draftContent: safeDraftContent,
        isPublished: isPublished ?? true,
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
        version: 1,
        updatedBy: author,
      },
    });

    return NextResponse.json({ success: true, block }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
