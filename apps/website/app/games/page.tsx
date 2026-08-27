import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Monitor, Smartphone, Download, Gamepad2, Layers, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { GamesCatalogClient } from "./GamesCatalogClient";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export const revalidate = 0; // Dynamic SSR fetching

export default async function GamesPage() {
  let dbGames: any[] = [];
  try {
    const gameContents = await prisma.gameContent.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      include: {
        releases: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (gameContents.length > 0) {
      dbGames = gameContents.map((g) => {
        let customData: any = {};
        try {
          if (g.features && g.features.startsWith("{")) {
            customData = JSON.parse(g.features);
          }
        } catch {}

        const effectiveDesktopPos = g.presentationMode === "MANUAL" && g.manualDesktopPosition
          ? g.manualDesktopPosition
          : (g.aiDesktopPosition || "50% 50%");

        const windowsRelease = g.releases.find((r) => r.platform === "WINDOWS");
        const androidRelease = g.releases.find((r) => r.platform === "ANDROID");

        return {
          id: g.id,
          slug: g.slug,
          title: g.name,
          subtitle: g.subtitle || (customData.dimension === "2D" ? "2D Arcade Game" : "3D Action RPG"),
          genre: g.genre,
          status: g.status,
          year: g.releaseDate || "2026",
          description: g.description,
          dimension: customData.dimension || "3D",
          engineVersion: customData.engineVersion || g.engine,
          bannerUrl: g.bannerUrl,
          effectiveDesktopPosition: effectiveDesktopPos,
          zoomLevel: g.zoomLevel || 1.0,
          overlayIntensity: g.overlayIntensity ?? 0.45,
          pcExeUrl: windowsRelease ? `/api/games/${g.slug}/download?platform=windows` : customData.pcExeUrl,
          pcFileSize: customData.pcFileSize || "650 MB",
          mobileApkUrl: androidRelease ? `/api/games/${g.slug}/download?platform=android` : customData.mobileApkUrl,
          mobileFileSize: customData.mobileFileSize || "120 MB",
          platforms: g.platforms || "PC (.exe), Android (.apk)",
          isFeatured: g.isFeatured,
        };
      });
    }
  } catch (err) {
    console.error("Error loading games from PostgreSQL:", err);
  }

  const fallbackGames = [
    {
      id: "uncharted-drive-beyond",
      slug: "uncharted-drive-beyond",
      title: "UNCHARTED DRIVE: BEYOND",
      subtitle: "Next-Gen Open Road Driving Simulation",
      genre: "Open Road Simulation",
      status: "LIVE OFFICIAL",
      year: "2026",
      dimension: "3D",
      engineVersion: "Dragon 3D Vulkan",
      description: "High-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with ultra-responsive vehicle dynamics.",
      bannerUrl: "/images/uncharted-drive-banner.png",
      effectiveDesktopPosition: "50% 50%",
      platforms: "PC (.exe), Android (.apk)",
      isFeatured: true,
    },
  ];

  const games = dbGames.length > 0 ? dbGames : fallbackGames;

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <Navbar />

      {/* ═══ WORLD 2: CYBER VAULT / HOLOGRAPHIC ARSENAL 3D ATMOSPHERE ═══ */}
      <DragonAtmosphere world="cyber_vault" />

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* ═══ CINEMATIC HERO SECTION ═══ */}
        <div className="relative space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050D24]/90 border border-cyan-500/35 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>ORIGINAL GAME ARSENAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[0.95]">
            ORIGINAL AAA FRANCHISES
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Engineered from the ground up for high-octane 3D simulation and adrenaline 2D arcade precision, powered by Dragon Engine technology.
          </p>
        </div>

        {/* ═══ INTERACTIVE CATALOG WITH GENRE & PLATFORM FILTERS ═══ */}
        <GamesCatalogClient initialGames={games} />

      </main>

      <Footer />
    </div>
  );
}
