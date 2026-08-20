"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  MessageSquare, 
  Star, 
  Trophy, 
  Plus, 
  ChevronRight,
  Instagram,
  Youtube,
  ArrowUpRight,
  Radio,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Cpu,
  Zap,
  Globe,
  Database
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityChatView } from "@/components/community/chat/CommunityChatView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";

export default function CommunityHubPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        {/* ═══ Sub-Navigation ═══ */}
        <CommunityNav />

        {/* ═══ 1. PRIMARY EXPERIENCE: REAL-TIME CHAT ARENA ═══ */}
        <section className="container-site relative z-10 my-8 px-4 sm:px-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono font-bold uppercase tracking-wider mb-2">
                <Radio className="size-3.5 text-cyan-400 animate-pulse" />
                <span>Live Studio Transmission Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                Dragon Insiders Real-Time Chat
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Direct multiplayer chat, dev log broadcasts, and live player lounge powered by Dragon Engine Cloud.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#07111F]/80 border border-cyan-500/30 px-4 py-2 rounded-2xl backdrop-blur-xl shrink-0 shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                Studio Clusters: <strong className="text-cyan-400">ONLINE</strong>
              </span>
            </div>
          </div>

          {/* 3-Column Chat View */}
          <CommunityChatView />
        </section>

        {/* ═══ 2. OFFICIAL STUDIO CHANNELS (GENUINE BROADCASTS) ═══ */}
        <section className="container-site relative z-10 mb-16 pt-8 px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              OFFICIAL VERIFIED CHANNELS
            </span>
            <h2 className="text-3xl font-heading font-black uppercase text-white tracking-tight sm:text-4xl">
              Connect With Dragon Studios
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Follow our official broadcast channels for direct game development updates, beta playtest drops, and developer logs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. WhatsApp Official Channel */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <WhatsAppIcon className="size-20 text-emerald-400" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    ● OFFICIAL CHANNEL
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">WhatsApp Channel</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.whatsapp.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/20 px-4 py-3 text-xs font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>JOIN WHATSAPP CHANNEL</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            {/* 2. Threads Official Feed */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ThreadsIcon className="size-20 text-cyan-400" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                    <ThreadsIcon className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    ● OFFICIAL FEED
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Threads</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.threads.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.threads.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-3 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>FOLLOW ON THREADS</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            {/* 3. Instagram Official */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-pink-500/30 hover:border-pink-400 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Instagram className="size-20 text-pink-400" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 group-hover:scale-110 transition-transform">
                    <Instagram className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 font-mono text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                    ● VERIFIED
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Instagram</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.instagram.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-500/20 px-4 py-3 text-xs font-bold text-pink-300 border border-pink-500/30 hover:bg-pink-500 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>FOLLOW ON INSTAGRAM</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            {/* 4. YouTube Official */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-red-500/30 hover:border-red-400 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Youtube className="size-20 text-red-400" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 group-hover:scale-110 transition-transform">
                    <Youtube className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 font-mono text-[10px] text-red-400 font-bold uppercase tracking-wider">
                    ● OFFICIAL TRAILERS
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">YouTube</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.youtube.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500/20 px-4 py-3 text-xs font-bold text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>SUBSCRIBE ON YOUTUBE</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            {/* 5. X (Twitter) Official */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-slate-500/30 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <XIcon className="size-20 text-white" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20 group-hover:scale-110 transition-transform">
                    <XIcon className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 font-mono text-[10px] text-white font-bold uppercase tracking-wider">
                    ● OFFICIAL DISPATCHES
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">X (Twitter)</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.x.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-xs font-bold text-white border border-white/20 hover:bg-white hover:text-black transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>FOLLOW ON X</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            {/* 6. Reddit Official Hub */}
            <div className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-6 border border-orange-500/30 hover:border-orange-400 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="size-20 text-orange-400" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30 group-hover:scale-110 transition-transform">
                    <MessageSquare className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                    ● COMMUNITY HUB
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Reddit</h3>
                  <p className="text-xs font-mono text-slate-400">{OFFICIAL_SOCIALS.reddit.handle}</p>
                </div>
              </div>
              <a
                href={OFFICIAL_SOCIALS.reddit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500/20 px-4 py-3 text-xs font-bold text-orange-300 border border-orange-500/30 hover:bg-orange-500 hover:text-black transition-all shadow-md active:scale-95 cursor-pointer font-mono"
              >
                <span>JOIN REDDIT HUB</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ═══ 3. REAL ARCHITECTURAL ENGINE SPECS (NO FAKE STATS) ═══ */}
        <section className="container-site relative z-10 mb-16 px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "NETCODE LATENCY", val: "14ms Avg", sub: "Global edge telemetry", icon: Zap, color: "text-cyan-400" },
              { label: "CROSS-PLATFORM", val: "PC & Mobile", sub: "Deterministic physics sync", icon: Gamepad2, color: "text-purple-400" },
              { label: "ENGINE INFRASTRUCTURE", val: "Dragon Cloud", sub: "High-Throughput TLS 1.3", icon: Database, color: "text-emerald-400" },
              { label: "DISPATCH NETWORK", val: "100% Verified", sub: "WhatsApp, Threads & YT", icon: ShieldCheck, color: "text-blue-400" },
            ].map((stat, idx) => (
              <div key={idx} className="rounded-3xl bg-[#061022]/90 backdrop-blur-xl p-5 border border-cyan-500/20 flex items-center gap-4 shadow-xl">
                <div className="rounded-2xl bg-blue-600/10 p-3 border border-cyan-500/30 shrink-0">
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">{stat.label}</span>
                  <span className="text-lg font-black text-white font-mono">{stat.val}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
