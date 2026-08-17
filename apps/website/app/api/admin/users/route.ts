import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
      },
    });

    const totalUsers = users.length;
    const adminCount = users.filter((u: any) => u.role === "ADMIN" || u.role === "SUPER_ADMIN" || u.role === "OWNER").length;
    const staffCount = users.filter((u: any) => u.role !== "USER" && u.role !== "PLAYER").length;
    const playerCount = users.filter((u: any) => u.role === "USER" || u.role === "PLAYER").length;

    return NextResponse.json({
      success: true,
      users,
      telemetry: {
        totalUsers,
        adminCount,
        staffCount,
        playerCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: role || "USER",
        emailVerified: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_USER",
        userEmail: "Admin",
        details: `Created User ID: ${user.id} (${user.email}) with role: ${user.role}`,
      },
    });

    return NextResponse.json({ success: true, message: "User created successfully", user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, role, emailVerified, name } = body;

    if (!id) return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        role: role || undefined,
        emailVerified: emailVerified ? new Date() : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_USER",
        userEmail: "Admin",
        details: `Updated role/info for user: ${user.email} -> ${user.role}`,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      await prisma.user.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: "DELETE_USER",
          userEmail: "Admin",
          details: `Deleted user: ${user.email}`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "User permanently deleted." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
