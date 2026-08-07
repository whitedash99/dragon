import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const q = searchParams.get("q");

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filtered = users.filter((u) => {
      const matchesSearch = !q || (
        (u.name && u.name.toLowerCase().includes(q.toLowerCase())) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(q.toLowerCase()))
      );
      const matchesRole = !role || role === "All" || u.role === role;
      return matchesSearch && matchesRole;
    });

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
    const adminsCount = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMINISTRATOR" || u.role === "OWNER").length;
    const suspendedCount = users.filter((u) => u.status === "SUSPENDED" || u.status === "DEACTIVATED").length;

    return NextResponse.json({
      success: true,
      users: filtered,
      telemetry: {
        totalUsers,
        activeUsers,
        adminsCount,
        suspendedCount,
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
    const { id, name, email, role, department, status } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: name || undefined,
        role: role || undefined,
        department: department || undefined,
        status: status || undefined,
      },
      create: {
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: "argon2id_hashed_default_pass",
        role: role || "ADMINISTRATOR",
        department: department || "Engineering",
        status: status || "ACTIVE",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: id ? "UPDATE_USER_ROLE" : "PROVISION_USER",
        userEmail: "Admin",
        details: `Saved User: ${user.email} -> Role: ${user.role}`,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      await prisma.user.update({
        where: { id },
        data: { status: "DEACTIVATED" },
      });

      await prisma.auditLog.create({
        data: {
          action: "DEACTIVATE_USER",
          userEmail: "Admin",
          details: `Deactivated User Account: ${user.email}`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "User account deactivated." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
