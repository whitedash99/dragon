import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pressReleases = await prisma.pressRelease.findMany({
      orderBy: { releaseDate: "desc" },
    });
    return NextResponse.json({ success: true, pressReleases });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, pdfUrl } = body;

    if (!title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });

    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const pressRelease = await prisma.pressRelease.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content: content || "",
        pdfUrl: pdfUrl || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_PRESS_RELEASE",
        userEmail: "Admin",
        details: `Published press release: ${title}`,
      },
    });

    return NextResponse.json({ success: true, pressRelease });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await prisma.pressRelease.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_PRESS_RELEASE",
        userEmail: "Admin",
        details: `Deleted press release ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
