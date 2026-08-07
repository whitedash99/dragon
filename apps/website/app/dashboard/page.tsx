"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Download, 
  Gamepad2, 
  Trophy, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Bell,
  Cloud,
  ChevronRight, 
  User, 
  BarChart3,
  Check
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const [platform, setPlatform] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlatform = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/platform");
      const json = await res.json();
      if (json.success) setPlatform(json.platform);
    } catch (e) {
      console.error("Fetch platform error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchPlatform();
    });
    return () => { isMounted = false; };
  }, []);

  const player = platform?.player;

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <DashboardNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12 font-mono text-xs">
        {/* Welcome Player Banner */}
        <section className="container-site relative z-10 mb-12">
          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 overflow-hidden relative">
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ff1e4b] via-purple-600 to-sky-400" 
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Profile Overview */}
              <div className="flex items-center gap-6">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff1e4b] to-purple-600 text-2xl font-black text-white shadow-xl border border-white/20 shrink-0 font-heading">
                  {player?.name ? player.name[0] : "D"}
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-[#ff1e4b] px-2 py-0.5 text-[9px] font-bold text-white shadow">
                    Lvl {player?.level || 42}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl font-heading">
                      WELCOME, {loading ? "COMMANDER..." : player?.name}
                    </h1>
                    <span className="rounded-full bg-[#ff1e4b]/20 px-3 py-1 text-xs font-bold text-[#ff1e4b] border border-[#ff1e4b]/30">
                      {player?.rank || "DRAGON COMMANDER"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground font-sans">
                    DragonID: {player?.email} • Global Rank: {player?.globalRank}
                  </p>
                </div>
              </div>

              {/* Right Quick Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="solidRed" size="lg" className="rounded-xl gap-2 px-6 text-xs font-bold uppercase" asChild>
                  <Link href="/games">
                    <Play className="size-4 fill-current" />
                    <span>LAUNCH GAME LIBRARY</span>
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="rounded-xl gap-2 px-6 border-white/20 text-xs font-bold uppercase" asChild>
                  <Link href="/downloads">
                    <Download className="size-4 text-[#ff1e4b]" />
                    <span>LAUNCHER DOWNLOADS</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container-site relative z-10 mb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-heavy p-6 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">TOTAL PLAYTIME</span>
              <p className="text-3xl font-black text-white">{player?.hoursPlayed || 328} <span className="text-sm">HRS</span></p>
              <span className="text-[10px] text-[#ff1e4b] block">Across All Dragon Titles</span>
            </div>

            <div className="rounded-2xl glass-heavy p-6 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">ACHIEVEMENTS UNLOCKED</span>
              <p className="text-3xl font-black text-amber-400">{player?.achievementsUnlocked || 84} / {player?.totalAchievements || 100}</p>
              <span className="text-[10px] text-muted-foreground block">84% Completion Rate</span>
            </div>

            <div className="rounded-2xl glass-heavy p-6 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">CLOUD SAVE STATUS</span>
              <p className="text-3xl font-black text-emerald-400">SYNCD</p>
              <span className="text-[10px] text-emerald-300 block">3 Active Game Backup Slots</span>
            </div>

            <div className="rounded-2xl glass-heavy p-6 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold">DRAGONID SECURITY</span>
              <p className="text-3xl font-black text-sky-400">PROTECTED</p>
              <span className="text-[10px] text-sky-300 block">2FA & Encrypted Session</span>
            </div>
          </div>
        </section>

        {/* Game Library & Cloud Saves Row */}
        <section className="container-site relative z-10 mb-16 grid gap-8 lg:grid-cols-12">
          {/* Game Library */}
          <div className="lg:col-span-8 rounded-3xl glass-heavy p-6 border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2 font-heading">
                <Gamepad2 className="size-4 text-[#ff1e4b]" />
                <span>OWNED GAMES & LAUNCHER INSTALLS</span>
              </span>
              <Link href="/games" className="text-xs font-bold text-[#ff1e4b] hover:underline flex items-center gap-1">
                <span>VIEW ALL GAMES</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading games library...</div>
              ) : platform?.library?.map((g: any) => (
                <div key={g.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase font-heading">{g.title}</h3>
                    <span className="text-[10px] text-muted-foreground">{g.hoursPlayed} hrs played • Last played {g.lastPlayed}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {g.updateAvailable && (
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                        PATCH UPDATE AVAILABLE
                      </span>
                    )}
                    <Button variant="solidRed" size="sm" className="rounded-xl text-[11px] h-8 gap-1.5" asChild>
                      <Link href={`/games/${g.slug}`}>
                        <Play className="size-3 fill-current" />
                        <span>LAUNCH</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Saves */}
          <div className="lg:col-span-4 rounded-3xl glass-heavy p-6 border border-white/15 space-y-4">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-2 font-heading">
              <Cloud className="size-4 text-sky-400" />
              <span>CLOUD SAVE HISTORY</span>
            </span>

            <div className="space-y-3">
              {platform?.cloudSaves?.map((cs: any) => (
                <div key={cs.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{cs.game}</span>
                    <span className="text-emerald-400">{cs.size}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">{cs.slot}</span>
                  <span className="text-[9px] text-sky-300 block">{cs.device} • {cs.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications & Announcements */}
        <section className="container-site relative z-10 mb-16">
          <div className="rounded-3xl glass-heavy p-6 border border-white/15 space-y-4">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-2 font-heading">
              <Bell className="size-4 text-[#ff1e4b]" />
              <span>SYSTEM NOTIFICATIONS & SUPPORT ALERTS</span>
            </span>

            <div className="grid gap-3 sm:grid-cols-3">
              {platform?.notifications?.map((n: any) => (
                <div key={n.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[9px] font-bold text-[#ff1e4b] uppercase">{n.type} • {n.time}</span>
                  <h4 className="text-xs font-bold text-white font-heading">{n.title}</h4>
                  <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
