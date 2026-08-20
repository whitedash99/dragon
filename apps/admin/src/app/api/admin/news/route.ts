import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, articles: [], error: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser().catch(() => null);
    const userEmail = auth?.user?.email || "Executive Owner";
    const body = await req.json();

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: body.excerpt || "",
        tag: body.tag || "Studio News",
        author: body.author || "Dragon Studios Editorial",
        featured: body.featured ?? false,
        readTime: body.readTime || "4 min read",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_BLOG_ARTICLE",
        userEmail,
        details: `Published blog article: "${article.title}" to Neon PostgreSQL.`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, article, message: "Article created successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser().catch(() => null);
    const userEmail = auth?.user?.email || "Executive Owner";
    const body = await req.json();
    const { id, title, excerpt, tag, author, featured, readTime } = body;

    if (!id) return NextResponse.json({ success: false, error: "Article ID required" }, { status: 400 });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        tag,
        author,
        featured,
        readTime,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_BLOG_ARTICLE",
        userEmail,
        details: `Updated blog article ID: ${article.id}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, article, message: "Article updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser().catch(() => null);
    const userEmail = auth?.user?.email || "Executive Owner";
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Article ID required" }, { status: 400 });

    await prisma.article.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_BLOG_ARTICLE",
        userEmail,
        details: `Deleted blog article ID: ${id} from Neon PostgreSQL.`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
