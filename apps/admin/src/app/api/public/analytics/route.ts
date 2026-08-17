import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, category, userEmail, metadata } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ success: false, error: "Event name is required" }, { status: 400 });
    }

    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        event: event.toUpperCase(),
        category: category || "Public Website",
        userEmail: userEmail || "Visitor",
        ipAddress: clientIp,
        metadata: metadata ? (typeof metadata === "string" ? metadata : JSON.stringify(metadata)) : null,
      },
    });

    return NextResponse.json(
      { success: true, id: analyticsEvent.id },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error logging analytics event";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
