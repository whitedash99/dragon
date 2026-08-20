import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gameContents = await prisma.gameContent.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsedGames = gameContents.map((g) => {
      let customData: any = {};
      try {
        if (g.features && g.features.startsWith("{")) {
          customData = JSON.parse(g.features);
        }
      } catch {}

      return {
        id: g.id,
        slug: g.slug,
        name: g.name,
        title: g.name,
        genre: g.genre,
        status: g.status,
        releaseDate: g.releaseDate,
        engine: g.engine,
        dimension: customData.dimension || "3D",
        engineVersion: customData.engineVersion || (customData.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
        pcExeUrl: customData.pcExeUrl || "https://dragongamingstudios.vercel.app/downloads/DragonGame_PC_Setup.exe",
        pcFileSize: customData.pcFileSize || "650 MB",
        mobileApkUrl: customData.mobileApkUrl || "https://dragongamingstudios.vercel.app/downloads/DragonGame_Android.apk",
        mobileFileSize: customData.mobileFileSize || "120 MB",
        description: g.description,
        isPublished: g.isPublished,
      };
    });

    return NextResponse.json({ success: true, games: parsedGames });
  } catch (error) {
    console.error("[Games API Error]:", error);
    return NextResponse.json({ success: false, games: [] });
  }
}
