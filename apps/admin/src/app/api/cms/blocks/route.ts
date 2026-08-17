import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

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
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires cms.edit permission." }, { status: 403 });
    }

    const body = await req.json();
    const { key, category, label, type, content, draftContent, isPublished } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    const safeContent = content !== undefined ? content : draftContent !== undefined ? draftContent : "";
    const safeDraftContent = draftContent !== undefined ? draftContent : safeContent;
    const author = auth.user.email;

    const existing = await prisma.contentBlock.findUnique({ where: { key } });

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

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "COMMIT_CMS_BLOCK",
        details: `Saved CMS Block [${key}] -> Version ${nextVersion} by ${auth.user.email}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

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
