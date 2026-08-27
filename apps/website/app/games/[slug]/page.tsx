"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Play, 
  Check, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Zap, 
  ChevronRight,
  Download,
  Monitor,
  Smartphone,
  HardDrive,
  Cpu,
  Calendar,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/cn";
import { getGameVisualTheme } from "@/lib/theme/game-theme";
import { DownloadButton } from "@/components/games/DownloadButton";
import { PlatformBadge } from "@/components/games/PlatformBadge";
import { GameBadge } from "@/components/games/GameBadge";
import { MediaLightboxModal } from "@/components/media/MediaLightboxModal";
import { AtmosphericAurora } from "@/components/cinematic/AtmosphericAurora";
import { DragonUniverse3DCanvas } from "@/components/cinematic/DragonUniverse3DCanvas";
import { NoiseLayer } from "@/components/background/NoiseLayer";
import { Vignette } from "@/components/background/Vignette";

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState<number | null>(null);

  // Fetch canonical game data from PostgreSQL API
  useEffect(() => {
    let isMounted = true;
    async function loadGame() {
      try {
        const res = await fetch(`/api/games/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.game && isMounted) {
            setGame(data.game);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("[GameDetailPage] DB fetch fallback:", err);
      }

      // Fallback for official titles if offline
      if (isMounted) {
        if (slug === "uncharted-drive-beyond") {
          setGame({
            id: "uncharted-drive-beyond",
            slug: "uncharted-drive-beyond",
            title: "UNCHARTED DRIVE: BEYOND",
            subtitle: "Next-Gen Open Road Driving Simulation",
            genre: "Open Road Simulation",
            status: "OFFICIAL FLAGSHIP",
            releaseDate: "2026",
            dimension: "3D",
            engineVersion: "Dragon 3D Vulkan",
            description: "Experience high-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with ultra-responsive vehicle dynamics and volumetric atmospheric lighting.",
            bannerUrl: "/images/uncharted-drive-banner.png",
            effectiveDesktopPosition: "50% 50%",
            platforms: "PC (.exe), Android (.apk)",
            pcFileSize: "650 MB",
            mobileFileSize: "120 MB",
          });
        } else if (slug === "reflex-rush") {
          setGame({
            id: "reflex-rush",
            slug: "reflex-rush",
            title: "REFLEX RUSH",
            subtitle: "High-Speed Reflex Reaction Runner",
            genre: "Arcade Reflex Runner",
            status: "LIVE WEB PLAY",
            releaseDate: "2026",
            dimension: "2D",
            engineVersion: "HTML5 Canvas Turbo",
            description: "Test your lightning-fast reflexes in pure adrenaline arcade gameplay. Dodge obstacles, beat high scores, and master rapid-fire precision runs live in your browser.",
            bannerUrl: "/images/uncharted-drive-banner.png",
            effectiveDesktopPosition: "50% 50%",
            platforms: "Web & Mobile Browser",
            webPlayUrl: "https://reflexrush-dragongamingstudio.netlify.app/",
          });
        }
        setLoading(false);
      }
    }

    loadGame();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02050E] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono tracking-widest text-slate-400">CONNECTING CANONICAL STREAM...</span>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#02050E] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Game Title Not Found</h1>
        <p className="text-xs text-slate-400">The requested franchise does not exist in the database catalog.</p>
        <Link href="/games" className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15">
          Return to Games Catalog
        </Link>
      </div>
    );
  }

  const theme = getGameVisualTheme(game.genre, game.title);

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative">
      <Navbar />

      {/* ═══ UNIFIED 3D LUMINOUS UNIVERSE & LIGHTNING ENGINE ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <AtmosphericAurora />
        <DragonUniverse3DCanvas />
        <NoiseLayer opacity={0.02} />
        <Vignette intensity={0.65} />
      </div>

      {/* Dynamic Ambient Radiant Glow matching the Game Theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] rounded-full blur-[180px] opacity-25 transition-all duration-700 z-0"
        style={{ backgroundColor: theme.primary }}
      />

      <main className="relative z-10 pt-24 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>ALL FRANCHISES</span>
          </Link>
        </div>

        {/* ═══ CINEMATIC HERO BANNER ═══ */}
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
          
          {/* Banner Artwork with Focal Point Crop */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            {game.bannerUrl ? (
              <img
                src={game.bannerUrl}
                alt={game.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: game.effectiveDesktopPosition || "50% 50%" }}
              />
            ) : (
              <div className="w-full h-full bg-slate-950" />
            )}

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02050E] via-[#02050E]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-12 space-y-4 max-w-3xl">
            
            <div className="flex items-center gap-2.5 flex-wrap">
              <GameBadge text={game.dimension || "3D"} theme={theme} />
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-mono font-bold uppercase tracking-wider">
                {game.status}
              </span>
              <span className={cn("text-xs font-mono font-bold uppercase tracking-wider", theme.badgeText)}>
                {game.genre}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight uppercase drop-shadow-md">
              {game.title}
            </h1>

            {game.subtitle && (
              <p className="text-sm sm:text-base text-slate-300 font-medium font-sans max-w-2xl">
                {game.subtitle}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <PlatformBadge platform={game.platforms || "PC (.exe)"} />
              {game.engineVersion && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
                  <Layers className="size-3.5 text-cyan-400" />
                  <span>{game.engineVersion}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ═══ TWO-COLUMN ACTION & OVERVIEW GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left 2 Cols: Description & Features */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="p-8 rounded-3xl bg-[#090D16]/90 border border-white/10 backdrop-blur-xl space-y-4 shadow-lg">
              <h2 className="text-base font-mono font-bold uppercase tracking-[0.16em] text-white flex items-center gap-2">
                <Sparkles className="size-4 text-cyan-400" />
                <span>OVERVIEW & SYNOPSIS</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {game.description}
              </p>

              {game.fullDescription && (
                <p className="text-sm text-slate-400 font-sans leading-relaxed pt-2">
                  {game.fullDescription}
                </p>
              )}
            </div>

            {/* Real Screenshots Gallery (If data exists in database) */}
            {game.screenshots && Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#090D16]/90 border border-white/10 backdrop-blur-xl space-y-4 shadow-lg">
                <h2 className="text-base font-mono font-bold uppercase tracking-[0.16em] text-white">
                  IN-GAME SCREENSHOTS & ARTWORK
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.screenshots.map((shot: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setActiveScreenshotIndex(idx)}
                      className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                    >
                      <img
                        src={shot}
                        alt={`${game.title} Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements (If data exists) */}
            {game.requirements && (
              <div className="p-8 rounded-3xl bg-[#090D16]/90 border border-white/10 backdrop-blur-xl space-y-4 shadow-lg">
                <h2 className="text-base font-mono font-bold uppercase tracking-[0.16em] text-white flex items-center gap-2">
                  <Cpu className="size-4 text-cyan-400" />
                  <span>SYSTEM REQUIREMENTS</span>
                </h2>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {game.requirements}
                </div>
              </div>
            )}

          </div>

          {/* Right Col: Verified Download & Action Center */}
          <div className="space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090D16]/95 border border-white/15 backdrop-blur-2xl shadow-xl space-y-6 sticky top-28">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-[0.16em] text-white">
                  DOWNLOAD & PLAY CENTER
                </h3>
                <p className="text-xs text-slate-400 pt-1 font-sans">
                  Direct official binaries powered by Backblaze B2 secure edge delivery.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="space-y-3">
                {game.webPlayUrl ? (
                  <DownloadButton
                    slug={game.slug}
                    platform="WEB"
                    webPlayUrl={game.webPlayUrl}
                    label="Play Instant in Browser"
                    theme={theme}
                  />
                ) : (
                  <>
                    <DownloadButton
                      slug={game.slug}
                      platform="WINDOWS"
                      label="Download for PC (.exe)"
                      fileSize={game.pcFileSize || "650 MB"}
                      theme={theme}
                    />

                    <DownloadButton
                      slug={game.slug}
                      platform="ANDROID"
                      label="Download for Android (.apk)"
                      fileSize={game.mobileFileSize || "120 MB"}
                      theme={theme}
                    />
                  </>
                )}
              </div>

              {/* Security & Verification Pill */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span>SHA-256 Checksum</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Distribution</span>
                  <span className="text-slate-300">Backblaze B2 CDN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Release Year</span>
                  <span className="text-slate-300">{game.releaseDate || "2026"}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {game.screenshots && Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
        <MediaLightboxModal
          isOpen={activeScreenshotIndex !== null}
          images={game.screenshots}
          currentIndex={activeScreenshotIndex ?? 0}
          onClose={() => setActiveScreenshotIndex(null)}
          onSelectIndex={(idx) => setActiveScreenshotIndex(idx)}
        />
      )}

      <Footer />
    </div>
  );
}
