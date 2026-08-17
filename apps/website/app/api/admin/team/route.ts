import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
      include: { department: true },
    });
    return NextResponse.json({ success: true, team });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message, team: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let dept = await prisma.department.findFirst({ where: { name: body.department || "Engineering" } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name: body.department || "Engineering" } });
    }

    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        email: body.email || `team-${Date.now()}@dragonstudios.com`,
        role: body.role || "Senior Game Engineer",
        departmentId: dept.id,
        active: body.active !== undefined ? body.active : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TEAM_MEMBER",
        userEmail: "Admin",
        details: `Added team member: ${member.name}`,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, email, active } = body;

    if (!id) return NextResponse.json({ success: false, error: "Member ID required" }, { status: 400 });

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        email,
        active,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Member ID required" }, { status: 400 });

    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
