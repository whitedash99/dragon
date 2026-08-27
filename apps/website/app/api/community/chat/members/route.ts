import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        image: true,
        role: true,
        department: true,
        lastLogin: true,
        profile: {
          select: {
            notificationSettings: true,
          },
        },
      },
      orderBy: [
        { role: "asc" },
        { lastLogin: "desc" },
      ],
      take: 50,
    });

    const members = users.map((u) => {
      let gamerTag = u.name;
      let primaryTitle = "Dragon Operative";
      if (u.profile?.notificationSettings) {
        try {
          const meta = JSON.parse(u.profile.notificationSettings);
          if (meta.gamerTag) gamerTag = meta.gamerTag;
          if (meta.primaryTitle) primaryTitle = meta.primaryTitle;
        } catch {}
      }

      return {
        clientId: u.id,
        userId: u.id,
        name: gamerTag || u.name || u.email.split("@")[0],
        email: u.email,
        role: u.role,
        department: u.department || primaryTitle,
        avatar: u.avatar || u.image,
        status: "ONLINE" as const,
      };
    });

    return NextResponse.json({
      success: true,
      members,
      total: members.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch community members" },
      { status: 500 }
    );
  }
}
