import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Monitor, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Dynamic SSR fetching

export default async function GamesPage() {
  let dbGames: any[] = [];
  try {
    dbGames = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error loading games from PostgreSQL:", err);
  }

  // Fallback defaults if database has 0 games
  const gamesList = dbGames.length > 0 ? dbGames : [
    {
      id: "g-1",
      slug: "embers-of-valyria",
      title: "Embers of Valyria",
      subtitle: "Open-World Dark Fantasy RPG",
      genre: "Action RPG",
      status: "Coming 2027",
      year: "2027",
      description: "Carve your path through a realm consumed by dragon flame. High-stakes melee combat, physical magic reactivity, and unscripted world events powered by Dragon Engine 4.0.",
      palette: "from-dragon-600 via-rose-950 to-black",
      platforms: "PC, PS5, Xbox Series X",
    },
    {
      id: "g-2",
      slug: "neon-drift-overdrive",
      title: "Neon Drift: Overdrive",
      subtitle: "Cyberpunk Anti-Gravity Racing",
      genre: "Arcade Racing",
      status: "In Development",
      year: "2026",
      description: "Break the sound barrier on vertical track highways in Neo-Tokyo. Customized hyper-vehicles, plasma weapons, and dynamic synthwave audio reactive tracks.",
      palette: "from-cyan-600 via-purple-950 to-black",
      platforms: "PC, PS5, Switch 2",
    },
  ];

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-28">
        {/* Page Hero Banner */}
        <section className="container-site relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/10 space-y-12">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff1e4b]/30 bg-[#ff1e4b]/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#ff1e4b]">
              <Sparkles className="size-4 text-amber-400" />
              <span>AAA PORTFOLIO SHOWCASE</span>
            </div>

            <h1 className="text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl text-white leading-[0.9] font-heading">
              EXPLORE <span className="text-[#ff1e4b]">UNIVERSES</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-2xl">
              From open-world dark fantasy to high-velocity anti-gravity racing. Every Dragon Studios title is engineered natively on Dragon Engine for uncompromised 120 FPS fidelity.
            </p>
          </div>
        </section>

        {/* Live Games Portfolio Grid */}
        <section className="container-site relative z-10 pt-16">
          <div className="grid gap-10 md:grid-cols-2">
            {gamesList.map((game: any) => (
              <div
                key={game.id}
                className="group relative flex flex-col justify-between rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 transition-all duration-500 hover:border-[#ff1e4b]/50 overflow-hidden shadow-2xl space-y-8"
              >
                {/* Top Badges */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                      {game.genre}
                    </span>
                    <span className="rounded-full bg-[#ff1e4b]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ff1e4b] border border-[#ff1e4b]/30">
                      {game.year}
                    </span>
                  </div>

                  <span className="rounded-full bg-black/60 px-3.5 py-1 text-xs font-bold uppercase text-emerald-400 border border-emerald-500/30">
                    {game.status}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="relative z-10 space-y-3">
                  <h2 className="text-4xl font-black uppercase tracking-tight text-white group-hover:text-[#ff1e4b] transition-colors sm:text-5xl leading-none font-heading">
                    {game.title}
                  </h2>
                  {game.subtitle && (
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                      {game.subtitle}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans pt-2">
                    {game.description}
                  </p>
                </div>

                {/* Bottom Details & CTA */}
                <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="size-4 text-[#ff1e4b]" />
                    <span className="font-bold text-white">{typeof game.platforms === "string" ? game.platforms : game.platforms?.join(" • ") || "PC, PS5, Xbox"}</span>
                  </div>

                  <Button variant="solidRed" size="sm" className="rounded-xl px-6 gap-2" asChild>
                    <Link href={`/games/${game.slug}`}>
                      <span>VIEW GAME DETAILS</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Release Timeline Roadmap Section */}
        <section className="container-site relative z-10 mt-32 pt-20 border-t border-white/10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b]">
                PRODUCTION HORIZON
              </span>
              <h2 className="text-3xl font-black uppercase text-white sm:text-4xl font-heading">
                RELEASE ROADMAP (2026 – 2028)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md font-sans leading-relaxed">
              Target launch windows for upcoming AAA titles natively optimized for Dragon Engine.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { year: "2026", title: "Blacksite Zero & Neon Drift", desc: "Co-op extraction shooter & arcade racer entering closed alpha & release rollout." },
              { year: "2027", title: "Embers of Valyria", desc: "Flagship open-world action RPG global worldwide launch." },
              { year: "2028", title: "Chronos Protocol", desc: "Sci-fi dual-timeline temporal action title currently in pre-production." },
            ].map((node) => (
              <div key={node.year} className="rounded-3xl glass-heavy p-8 border border-white/15 space-y-3 shadow-xl">
                <div className="flex items-center gap-3 font-mono">
                  <Calendar className="size-5 text-[#ff1e4b]" />
                  <span className="text-3xl font-black text-white">{node.year}</span>
                </div>
                <h3 className="text-lg font-bold text-amber-400 font-heading uppercase tracking-wide">{node.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{node.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
