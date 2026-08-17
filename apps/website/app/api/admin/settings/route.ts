import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, description } = body;

    if (!key) return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_SYSTEM_SETTING",
        userEmail: "Admin",
        details: `Updated setting: ${key} = ${value}`,
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
