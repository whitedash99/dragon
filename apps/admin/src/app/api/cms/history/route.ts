import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

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
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires cms.edit permission." }, { status: 403 });
    }

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
        updatedBy: `${auth.user.email} (Restored)`,
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
        updatedBy: `${auth.user.email} (Restored)`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "RESTORE_CMS_REVISION",
        resource: "CMS",
        details: `Restored CMS Block [${blockKey}] to version ${revision.version}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, block: restoredBlock });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
