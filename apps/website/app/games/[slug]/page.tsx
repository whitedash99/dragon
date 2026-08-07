"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Bookmark, 
  Check, 
  Cpu, 
  Layers, 
  Shield, 
  Sparkles, 
  Flame, 
  BrainCircuit, 
  Globe, 
  Zap, 
  Activity, 
  X, 
  ChevronRight,
  Twitter,
  MessageSquare,
  Youtube,
  Instagram,
  ArrowUpRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { games } from "@/data/content";
import { gameDetailsMap } from "@/data/expandedContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="size-6 text-dragon-400" />,
  BrainCircuit: <BrainCircuit className="size-6 text-amber-400" />,
  Globe: <Globe className="size-6 text-neon-cyan" />,
  Shield: <Shield className="size-6 text-neon-purple" />,
  Zap: <Zap className="size-6 text-neon-pink" />,
  Activity: <Activity className="size-6 text-emerald-400" />,
  Cpu: <Cpu className="size-6 text-neon-cyan" />,
  Sparkles: <Sparkles className="size-6 text-neon-purple" />,
  Layers: <Layers className="size-6 text-dragon-300" />,
};

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const gameDetail = gameDetailsMap[slug];

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [sysReqTab, setSysReqTab] = useState<"minimum" | "recommended">("recommended");

  if (!gameDetail) {
    return notFound();
  }

  const relatedGames = games.filter((g) => g.slug !== slug).slice(0, 2);

  const currentUrl = `https://dragonstudios.com/games/${slug}`;
  const shareText = encodeURIComponent(`Check out ${gameDetail.title} by @DGStudio1212! Powered by Dragon Engine.`);
  const xShareUrl = `https://x.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`;
  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(gameDetail.title)}`;

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pt-20">
        {/* Fullscreen Hero Section */}
        <section className={cn("relative min-h-[85vh] flex flex-col justify-between py-12 bg-gradient-to-br", gameDetail.palette)}>
          {/* Top Nav Back Link */}
          <div className="container-site relative z-10 pt-8">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Games Directory</span>
            </Link>
          </div>

          {/* Hero Main Info */}
          <div className="container-site relative z-10 my-auto py-12">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-md">
                  {gameDetail.genre}
                </span>
                <span className="rounded-full bg-dragon-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-dragon-200 border border-dragon-400/40">
                  {gameDetail.status} • {gameDetail.year}
                </span>
              </div>

              <h1 className="text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8vw leading-[0.85]">
                {gameDetail.title}
              </h1>

              <p className="mt-4 text-xl sm:text-2xl font-semibold text-dragon-200">
                {gameDetail.tagline}
              </p>

              <p className="mt-6 max-w-2xl text-base text-white/80 leading-relaxed sm:text-lg">
                {gameDetail.description}
              </p>

              {/* CTAs Bar */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => setTrailerOpen(true)}
                  variant="glow"
                  size="xl"
                  className="rounded-full gap-3 px-8"
                >
                  <Play className="size-5 fill-current" />
                  <span>Watch Gameplay Reveal</span>
                </Button>

                <Button
                  onClick={() => setWishlisted(!wishlisted)}
                  variant="glass"
                  size="xl"
                  className={cn("rounded-full gap-3 px-8 border-white/20", wishlisted && "bg-emerald-500/20 text-emerald-300 border-emerald-500/40")}
                >
                  {wishlisted ? (
                    <>
                      <Check className="size-5" />
                      <span>Added to Wishlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="size-5" />
                      <span>Wishlist Game</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Social Action Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                <a
                  href={xShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-sky-500/20 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
                >
                  <Twitter className="size-3.5 text-sky-400" />
                  <span>Share on X</span>
                </a>

                <a
                  href={redditShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-orange-500/20 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
                >
                  <MessageSquare className="size-3.5 text-orange-400" />
                  <span>Share on Reddit</span>
                </a>

                <a
                  href={OFFICIAL_SOCIALS.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-red-500/20 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
                >
                  <Youtube className="size-3.5 text-red-400" />
                  <span>Watch Trailer on YouTube</span>
                </a>

                <a
                  href={OFFICIAL_SOCIALS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-pink-500/20 px-4 py-2 text-xs font-bold text-white border border-white/15 transition-colors"
                >
                  <Instagram className="size-3.5 text-pink-400" />
                  <span>Follow Studio</span>
                </a>
              </div>
            </div>
          </div>

          {/* Target Platforms Bar */}
          <div className="container-site relative z-10 pt-4 pb-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Target Platforms: <strong className="text-white">{gameDetail.platforms.join(" • ")}</strong></span>
            <span>Dragon Engine Native</span>
          </div>
        </section>

        {/* Overview & Story Section */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                World Narrative & Premise
              </span>
              <h2 className="mt-3 text-4xl font-black uppercase text-white">
                The World Premise
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {gameDetail.storyOverview}
              </p>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {gameDetail.fullDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Gameplay Features Grid */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Dragon Engine Mechanics
            </span>
            <h2 className="mt-2 text-4xl font-black uppercase text-white">
              Key Gameplay Pillars
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gameDetail.gameplayFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl glass-md p-6 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className="rounded-xl bg-white/5 p-3 w-fit mb-6 border border-white/10">
                  {iconMap[feat.iconName] || <Sparkles className="size-6 text-primary" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* System Requirements Module */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Hardware Benchmarks
              </span>
              <h2 className="mt-2 text-4xl font-black uppercase text-white">
                System Requirements
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full glass-sm p-1.5 border border-white/10">
              <button
                onClick={() => setSysReqTab("minimum")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                  sysReqTab === "minimum" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                Minimum Specs
              </button>
              <button
                onClick={() => setSysReqTab("recommended")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                  sysReqTab === "recommended" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                Recommended Specs
              </button>
            </div>
          </div>

          <div className="rounded-2xl glass-heavy p-8 border border-white/10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Operating System", val: gameDetail.systemRequirements[sysReqTab].os },
                { label: "Processor (CPU)", val: gameDetail.systemRequirements[sysReqTab].cpu },
                { label: "Memory (RAM)", val: gameDetail.systemRequirements[sysReqTab].ram },
                { label: "Graphics (GPU)", val: gameDetail.systemRequirements[sysReqTab].gpu },
                { label: "DirectX API", val: gameDetail.systemRequirements[sysReqTab].directx },
                { label: "Storage Space", val: gameDetail.systemRequirements[sysReqTab].storage },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl bg-black/30 p-5 border border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                  <p className="mt-2 text-sm font-bold text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Games */}
        <section className="container-site relative z-10 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                More Universes
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">
                Related Titles
              </h2>
            </div>
            <Button variant="glass" size="sm" className="rounded-full gap-2" asChild>
              <Link href="/games">
                <span>View All Games</span>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedGames.map((rg) => (
              <div key={rg.id} className="rounded-2xl glass-md p-8 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-dragon-400 uppercase tracking-widest">{rg.genre}</span>
                  <h3 className="text-2xl font-black text-white mt-2">{rg.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{rg.description}</p>
                </div>
                <Button variant="glow" size="sm" className="rounded-full w-fit mt-6" asChild>
                  <Link href={`/games/${rg.slug}`}>Explore Title</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Gameplay Trailer Lightbox Modal */}
      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-5xl rounded-2xl glass-heavy p-6 border border-white/20">
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-6" />
              </button>

              <div className="aspect-video w-full rounded-xl bg-black flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-dragon-600/20 via-black to-neon-purple/20" />
                <div className="relative z-10 text-center p-8">
                  <Play className="size-16 text-dragon-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-black text-white uppercase">{gameDetail.title} — Official Gameplay Trailer</h3>
                  <p className="text-sm text-muted-foreground mt-2">Captured in real time on Dragon Engine (4K 120 FPS Target)</p>
                  <Button onClick={() => setTrailerOpen(false)} variant="glow" size="sm" className="mt-6 rounded-full">
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
