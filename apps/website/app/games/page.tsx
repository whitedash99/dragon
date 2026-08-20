import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Monitor, Smartphone, Download, Gamepad2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Dynamic SSR fetching

export default async function GamesPage() {
  let dbGames: any[] = [];
  try {
    const gameContents = await prisma.gameContent.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (gameContents.length > 0) {
      dbGames = gameContents.map((g) => {
        let customData: any = {};
        try {
          if (g.features && g.features.startsWith("{")) {
            customData = JSON.parse(g.features);
          }
        } catch {}

        return {
          id: g.id,
          slug: g.slug,
          title: g.name,
          subtitle: customData.dimension === "2D" ? "2D Dragon Game" : "3D Dragon Game",
          genre: g.genre,
          status: g.status,
          year: g.releaseDate || "2026",
          description: g.description,
          dimension: customData.dimension || "3D",
          engineVersion: customData.engineVersion || (customData.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
          pcExeUrl: customData.pcExeUrl || "",
          pcFileSize: customData.pcFileSize || "650 MB",
          mobileApkUrl: customData.mobileApkUrl || "",
          mobileFileSize: customData.mobileFileSize || "120 MB",
          platforms: g.platforms || "PC (.exe), Android (.apk)",
        };
      });
    }
  } catch (err) {
    console.error("Error loading games from PostgreSQL:", err);
  }

  // Fallback defaults if database is unreachable
  const gamesList = dbGames.length > 0 ? dbGames : [
    {
      id: "g-1",
      slug: "dragon-slayer-3d",
      title: "Dragon Slayer 3D: Realm of Fire",
      subtitle: "3D Open-World Action RPG",
      genre: "3D Action RPG",
      status: "Live Released",
      year: "2026",
      dimension: "3D",
      engineVersion: "Dragon 3D Engine",
      description: "An epic 3D open-world fantasy action RPG built by Dragon Studios. Battle ancient dragons, forge legendary gear, and explore vast immersive landscapes.",
      pcExeUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D_Setup.exe",
      pcFileSize: "650 MB",
      mobileApkUrl: "https://dragongamingstudios.vercel.app/downloads/DragonSlayer3D.apk",
      mobileFileSize: "120 MB",
      platforms: "PC (.exe), Android (.apk)",
    },
  ];

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-28 pt-20 sm:pt-28">
        {/* Page Hero Banner */}
        <section className="container-site relative pt-10 pb-12 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 border-b border-white/10 space-y-6 sm:space-y-12 px-4 sm:px-6">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-blue-600/15 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="size-3.5 sm:size-4 text-amber-400" />
              <span>DRAGON 3D & 2D GAMES SHOWCASE</span>
            </div>

            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] font-heading">
              EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">UNIVERSES</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              From 3D open-world dark fantasy to high-velocity anti-gravity racing. Every Dragon Studios title is engineered natively on Dragon Engine for high frame-rate fidelity on PC and Mobile.
            </p>
          </div>
        </section>

        {/* Live Games Portfolio Grid */}
        <section className="container-site relative z-10 pt-10 sm:pt-16 px-4 sm:px-6">
          <div className="grid gap-6 md:gap-10 md:grid-cols-2">
            {gamesList.map((game: any) => (
              <div
                key={game.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#060D22]/90 backdrop-blur-xl p-5 sm:p-8 lg:p-12 border border-blue-500/20 transition-all duration-500 hover:border-cyan-400/50 overflow-hidden shadow-2xl space-y-6 sm:space-y-8"
              >
                {/* Top Badges */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      game.dimension === "2D" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    }`}>
                      {game.dimension || "3D"} GAME
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                      {game.genre}
                    </span>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase text-emerald-400 border border-emerald-500/30">
                    {game.status}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="relative z-10 space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-tight font-heading">
                    {game.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                    <Gamepad2 className="size-3.5 text-cyan-400" />
                    <span>{game.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans pt-1">
                    {game.description}
                  </p>
                </div>

                {/* Download Actions (PC & Mobile Buttons) */}
                <div className="relative z-10 pt-4 sm:pt-6 border-t border-white/10 space-y-2 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {game.pcExeUrl ? (
                      <a
                        href={game.pcExeUrl}
                        download
                        className="p-3 rounded-xl bg-blue-600/20 hover:bg-cyan-500 hover:text-black border border-blue-500/40 text-cyan-300 font-bold transition-all flex items-center justify-between active:scale-95"
                      >
                        <div className="flex items-center gap-2">
                          <Monitor className="size-4" />
                          <span>PC (.EXE)</span>
                        </div>
                        <span className="text-[10px] opacity-80">{game.pcFileSize || "650 MB"}</span>
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="size-4" />
                          <span>PC (.EXE)</span>
                        </div>
                        <span className="text-[10px]">SOON</span>
                      </div>
                    )}

                    {game.mobileApkUrl ? (
                      <a
                        href={game.mobileApkUrl}
                        download
                        className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-emerald-300 font-bold transition-all flex items-center justify-between active:scale-95"
                      >
                        <div className="flex items-center gap-2">
                          <Smartphone className="size-4" />
                          <span>MOBILE (.APK)</span>
                        </div>
                        <span className="text-[10px] opacity-80">{game.mobileFileSize || "120 MB"}</span>
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="size-4" />
                          <span>MOBILE (.APK)</span>
                        </div>
                        <span className="text-[10px]">SOON</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Release Horizon */}
        <section className="container-site relative z-10 pt-16 sm:pt-24 px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:gap-4 border-b border-white/10 pb-6 sm:pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                PRODUCTION HORIZON
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading">
                RELEASE ROADMAP (2026 – 2028)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans leading-relaxed">
              Target launch windows for upcoming 3D & 2D games created by Dragon Studios.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-3 pt-6 sm:pt-8">
            {[
              { year: "2026", title: "Dragon Slayer 3D & Cyber Drift", desc: "3D Open-world RPG & anti-gravity racer entering live public rollout with PC & Mobile builds." },
              { year: "2027", title: "Shadow Ninja 2D", desc: "2D action platformer global tournament edition." },
              { year: "2028", title: "Dragon Kingdom Chronicles", desc: "Flagship 2D fantasy strategy RPG worldwide expansion." },
            ].map((item) => (
              <div key={item.year} className="p-5 sm:p-6 rounded-2xl bg-[#060D22]/80 border border-blue-500/20 space-y-2 backdrop-blur-md">
                <span className="text-2xl font-black font-mono text-cyan-400">{item.year}</span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase">{item.title}</h3>
                <p className="text-xs text-slate-400 font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
