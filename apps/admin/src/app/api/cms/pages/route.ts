import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const pages = await prisma.page.findMany({
      where: status && status !== "ALL" ? { status } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        sections: {
          include: {
            blocks: true,
          },
        },
        seoData: true,
      },
    });

    const totalPages = pages.length;
    const publishedPages = pages.filter((p) => p.status === "PUBLISHED").length;
    const draftPages = pages.filter((p) => p.status === "DRAFT").length;

    return NextResponse.json({
      success: true,
      pages,
      metrics: {
        totalPages,
        publishedPages,
        draftPages,
      },
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
    const { title, slug, category, status, content } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const page = await prisma.page.create({
      data: {
        title,
        slug: safeSlug,
        category: category || "General",
        status: status || "PUBLISHED",
        author: auth.user.email,
      },
    });

    const section = await prisma.pageSection.create({
      data: {
        pageId: page.id,
        title: "Hero Section",
        order: 1,
      },
    });

    await prisma.contentBlock.create({
      data: {
        key: `page.${page.slug}.hero`,
        category: page.category,
        label: `${page.title} Hero Block`,
        type: "hero",
        content: content || `Welcome to ${page.title}`,
        sectionId: section.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "CREATE_CMS_PAGE",
        resource: "CMS",
        details: `Created Page: ${page.title} (${page.slug})`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, page });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires cms.edit permission." }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, status, category } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
    }

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title: title || undefined,
        status: status || undefined,
        category: category || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "UPDATE_CMS_PAGE",
        resource: "CMS",
        details: `Updated Page: ${updated.title} -> Status: ${updated.status}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, page: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires cms.edit permission." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
    }

    const page = await prisma.page.findUnique({ where: { id } });
    if (page) {
      await prisma.page.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "DELETE_CMS_PAGE",
          resource: "CMS",
          details: `Deleted Page: ${page.title} (${page.slug})`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
