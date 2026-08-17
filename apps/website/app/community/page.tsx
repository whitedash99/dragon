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
  Twitter,
  ArrowUpRight,
  Radio,
  Sparkles,
  ShieldCheck,
  Gamepad2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityChatView } from "@/components/community/chat/CommunityChatView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";

export default function CommunityHubPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        {/* ═══ Sub-Navigation ═══ */}
        <CommunityNav />

        {/* ═══ 1. PRIMARY EXPERIENCE: AAA REAL-TIME CHAT ARENA ═══ */}
        <section className="container-site relative z-10 my-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-[11px] text-cyan-300 font-mono font-bold uppercase tracking-wider mb-2">
                <Radio className="size-3.5 text-cyan-400 animate-pulse" />
                <span>Live Studio Transmission Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                Dragon Insiders Real-Time Chat
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Direct multiplayer chat, dev log broadcasts, and live player lounge powered by Neon PostgreSQL & Ably Realtime.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#07111F]/80 border border-blue-500/20 px-4 py-2 rounded-2xl backdrop-blur-xl shrink-0">
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

        {/* ═══ 2. OFFICIAL STUDIO CHANNELS ═══ */}
        <section className="container-site relative z-10 mb-16 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Official Studio Channels
            </span>
            <h2 className="mt-1 text-3xl font-heading font-black uppercase text-white tracking-tight sm:text-4xl">
              Follow Dragon Studios
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Connect directly with our development teams, watch exclusive game teasers, and join official player discussions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Instagram Card */}
            <div className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 hover:border-pink-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-110 transition-transform">
                    <Instagram className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-pink-400 font-bold">{OFFICIAL_SOCIALS.instagram.followers} Insiders</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
                <p className="text-xs font-mono text-slate-400 mb-4">{OFFICIAL_SOCIALS.instagram.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500/20 px-4 py-2.5 text-xs font-bold text-pink-300 border border-pink-500/30 hover:bg-pink-500 hover:text-white transition-colors"
              >
                <span>Follow on Instagram</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* YouTube Card */}
            <div className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <Youtube className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-red-400 font-bold">{OFFICIAL_SOCIALS.youtube.subscribers} Subs</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">YouTube</h3>
                <p className="text-xs font-mono text-slate-400 mb-4">{OFFICIAL_SOCIALS.youtube.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-2.5 text-xs font-bold text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
              >
                <span>Subscribe on YouTube</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* X (Twitter) Card */}
            <div className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 hover:border-sky-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                    <Twitter className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-sky-400 font-bold">{OFFICIAL_SOCIALS.x.followers} Followers</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">X (Twitter)</h3>
                <p className="text-xs font-mono text-slate-400 mb-4">{OFFICIAL_SOCIALS.x.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500/20 px-4 py-2.5 text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <span>Follow on X</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* Reddit Card */}
            <div className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 hover:border-orange-500/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
                    <MessageSquare className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-orange-400 font-bold">{OFFICIAL_SOCIALS.reddit.members} Members</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Reddit</h3>
                <p className="text-xs font-mono text-slate-400 mb-4">{OFFICIAL_SOCIALS.reddit.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.reddit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500/20 px-4 py-2.5 text-xs font-bold text-orange-300 border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <span>Join Reddit Community</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ═══ 3. STUDIO METRICS ═══ */}
        <section className="container-site relative z-10 mb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Insiders", val: "15,240,000+", sub: "Registered players", icon: Users, color: "text-cyan-400" },
              { label: "Forum Discussions", val: "42,800+", sub: "Threads & dev answers", icon: MessageSquare, color: "text-blue-400" },
              { label: "Verified Reviews", val: "1,250,000+", sub: "95% positive rating", icon: Star, color: "text-cyan-300" },
              { label: "Esports Prize Pools", val: "$250,000 GTD", sub: "Annual tournament series", icon: Trophy, color: "text-cyan-400" },
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 flex items-center gap-4 shadow-lg shadow-black/40">
                <div className="rounded-xl bg-blue-600/10 p-3 border border-blue-500/20 shrink-0">
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <div>
                  <div className="text-xl font-black text-white font-mono">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{stat.sub}</div>
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
