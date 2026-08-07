import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json({ articles: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: body.excerpt || "",
        tag: body.tag || "Studio News",
        author: body.author || "Dragon Studios Editorial",
        featured: body.featured || false,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_ARTICLE",
        userEmail: "Admin",
        details: `Published news article: ${article.title}`,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, excerpt, tag, author, featured } = body;

    if (!id) return NextResponse.json({ success: false, error: "Article ID required" }, { status: 400 });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        tag,
        author,
        featured,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_ARTICLE",
        userEmail: "Admin",
        details: `Updated news article: ${article.title}`,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.article.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_ARTICLE",
        userEmail: "Admin",
        details: `Deleted article ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
