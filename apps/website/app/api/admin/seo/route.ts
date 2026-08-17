import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const blocks = await prisma.contentBlock.findMany({
      where: { category: "SEO" },
    });
    return NextResponse.json({ success: true, blocks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, label, content } = body;

    if (!key) return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: { content, isPublished: true },
      create: {
        key,
        category: "SEO",
        label: label || key,
        content: content || "",
        isPublished: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_SEO_BLOCK",
        userEmail: "Admin",
        details: `Updated SEO meta tag: ${key}`,
      },
    });

    return NextResponse.json({ success: true, block });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
