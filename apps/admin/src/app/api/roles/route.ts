import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
      include: { permissions: true },
    });

    return NextResponse.json({ success: true, roles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "SUPER_ADMIN", "BREAK_GLASS"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Requires Executive privileges." }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Role name is required" }, { status: 400 });
    }

    const role = await prisma.role.upsert({
      where: { name: name.toUpperCase().trim() },
      update: {
        description: description || undefined,
        updatedAt: new Date(),
      },
      create: {
        name: name.toUpperCase().trim(),
        description: description || `Custom ${name} role`,
        isCustom: true,
      },
    });

    if (Array.isArray(permissions)) {
      // Re-create permissions
      await prisma.permission.deleteMany({ where: { roleId: role.id } });
      await prisma.permission.createMany({
        data: permissions.map((p: { action: string; resource: string }) => ({
          roleId: role.id,
          action: p.action,
          resource: p.resource,
          granted: true,
        })),
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "UPDATE_ROLE_PERMISSIONS",
        resource: role.name,
        details: `Saved role permissions for ${role.name}`,
      },
    });

    return NextResponse.json({ success: true, role });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
