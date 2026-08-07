import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, careers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, careers: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const career = await prisma.career.create({
      data: {
        title: body.title,
        department: body.department || "Engineering",
        location: body.location || "Bengaluru / Remote",
        type: body.type || "Full-Time",
        description: body.description || "",
        requirements: body.requirements || "",
        salary: body.salary || "Competitive + Equity",
        status: body.status || "OPEN",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_CAREER",
        userEmail: "Admin",
        details: `Opened position: ${career.title}`,
      },
    });

    return NextResponse.json({ success: true, career });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, department, location, type, description, requirements, salary, status } = body;

    if (!id) return NextResponse.json({ success: false, error: "Career ID required" }, { status: 400 });

    const career = await prisma.career.update({
      where: { id },
      data: {
        title,
        department,
        location,
        type,
        description,
        requirements,
        salary,
        status,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_CAREER",
        userEmail: "Admin",
        details: `Updated position: ${career.title}`,
      },
    });

    return NextResponse.json({ success: true, career });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Career ID required" }, { status: 400 });

    await prisma.career.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_CAREER",
        userEmail: "Admin",
        details: `Deleted career ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
