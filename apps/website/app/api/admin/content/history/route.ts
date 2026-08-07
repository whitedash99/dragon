import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ success: false, error: "Content key is required" }, { status: 400 });
    }

    const history = await prisma.contentRevision.findMany({
      where: { blockKey: key },
      orderBy: { version: "desc" },
    });

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { historyId } = body;

    if (!historyId) {
      return NextResponse.json({ success: false, error: "History record ID is required" }, { status: 400 });
    }

    const historyItem = await prisma.contentRevision.findUnique({
      where: { id: historyId },
    });

    if (!historyItem || !historyItem.blockKey) {
      return NextResponse.json({ success: false, error: "Historical version not found" }, { status: 404 });
    }

    const existing = await prisma.contentBlock.findUnique({
      where: { key: historyItem.blockKey },
    });

    const nextVersion = existing ? existing.version + 1 : historyItem.version + 1;

    const restored = await prisma.contentBlock.upsert({
      where: { key: historyItem.blockKey },
      update: {
        content: historyItem.content,
        draftContent: historyItem.content,
        isPublished: true,
        version: nextVersion,
        updatedBy: "Admin (Restored)",
      },
      create: {
        key: historyItem.blockKey,
        category: "Restored",
        label: historyItem.blockKey,
        type: "text",
        content: historyItem.content,
        draftContent: historyItem.content,
        isPublished: true,
        version: nextVersion,
        updatedBy: "Admin (Restored)",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "RESTORE_CMS_BLOCK_VERSION",
        userEmail: "Admin",
        details: `Restored CMS Block [${historyItem.blockKey}] to historical version ${historyItem.version}`,
      },
    });

    return NextResponse.json({ success: true, block: restored });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
