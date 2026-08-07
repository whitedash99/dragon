import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const faqs = await prisma.fAQItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ faqs });
  } catch (error) {
    return NextResponse.json({ faqs: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const faq = await prisma.fAQItem.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || "General",
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
