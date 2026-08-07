import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blockKey = searchParams.get("key");

    if (!blockKey) {
      return NextResponse.json({ success: false, error: "Block key is required" }, { status: 400 });
    }

    const history = await prisma.contentRevision.findMany({
      where: { blockKey },
      orderBy: { version: "desc" },
    });

    return NextResponse.json({ success: true, history });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { revisionId } = body;

    if (!revisionId) {
      return NextResponse.json({ success: false, error: "Revision ID is required" }, { status: 400 });
    }

    const revision = await prisma.contentRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || !revision.blockKey) {
      return NextResponse.json({ success: false, error: "Revision record not found" }, { status: 404 });
    }

    const blockKey = revision.blockKey;
    const existing = await prisma.contentBlock.findUnique({ where: { key: blockKey } });
    const nextVersion = existing ? existing.version + 1 : revision.version + 1;

    const restoredBlock = await prisma.contentBlock.upsert({
      where: { key: blockKey },
      update: {
        content: revision.content,
        draftContent: revision.content,
        isPublished: true,
        version: nextVersion,
        updatedBy: "Admin (Restored)",
      },
      create: {
        key: blockKey,
        category: "Restored",
        label: blockKey,
        type: "text",
        content: revision.content,
        draftContent: revision.content,
        isPublished: true,
        version: nextVersion,
        updatedBy: "Admin (Restored)",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "RESTORE_CMS_REVISION",
        userEmail: "Admin",
        details: `Restored CMS Block [${blockKey}] to version ${revision.version}`,
      },
    });

    return NextResponse.json({ success: true, block: restoredBlock });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
