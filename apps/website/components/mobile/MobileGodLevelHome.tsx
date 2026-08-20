"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  ArrowRight,
  TrendingUp,
  Users,
  Gamepad2,
  DollarSign,
  ShieldCheck,
  Activity,
  ShoppingBag,
  Send,
  Server,
  User,
  LayoutDashboard,
  PieChart,
  Grid,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Crown,
  Play,
  Monitor,
  Smartphone,
  CheckCircle2,
  LogOut,
  Sliders,
  Flame,
  Zap,
  Radio,
  Clock,
  Instagram,
  Youtube,
  MessageSquare
} from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { useSession, signOut } from "next-auth/react";
import { PlayerIdentitySetupModal } from "@/components/dashboard/PlayerIdentitySetupModal";

interface MobileGodLevelHomeProps {
  onOpenDeck?: () => void;
  onPlayIntro?: () => void;
}

export function MobileGodLevelHome({ onOpenDeck, onPlayIntro }: MobileGodLevelHomeProps) {
  const sessionState = useSession();
  const session = sessionState?.data;
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Owner";
  const userRole = (session?.user as any)?.role || "OWNER";

  const [activeBottomTab, setActiveBottomTab] = useState<"dashboard" | "games" | "analytics" | "menu">("dashboard");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#02040A] text-slate-100 font-sans pb-32 overflow-x-hidden selection:bg-purple-500/30 selection:text-white select-none">
      
      {/* ═══ 1. TOP STATUS & HEADER BAR ═══ */}
      <header className="sticky top-0 z-30 bg-[#02040A]/95 backdrop-blur-2xl px-4 py-3 border-b border-purple-500/20 flex items-center justify-between gap-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        
        {/* Left: Dragon Logo in Glowing Purple Ring + Hamburger Menu */}
        <div className="flex items-center gap-2.5">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <div className="size-8 rounded-full bg-[#030715] flex items-center justify-center">
              <DragonLogoIcon size="xs" className="border-none" />
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#060D24] border border-purple-500/30 text-slate-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
            aria-label="Open Navigation Deck"
          >
            <Menu className="size-4" />
          </button>
        </div>

        {/* Center: Brand Title */}
        <div className="flex flex-col items-center">
          <span className="font-heading font-black text-xs tracking-wider uppercase text-white flex items-center gap-1">
            <span>DRAGON</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400">STUDIO</span>
          </span>
          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
            GAME ENGINE
          </span>
        </div>

        {/* Right: Search, Notification Bell with '3' badge, Profile Avatar with online green dot */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="size-8 rounded-xl bg-[#060D24] border border-purple-500/30 flex items-center justify-center text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
          >
            <Search className="size-3.5" />
          </button>

          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative size-8 rounded-xl bg-[#060D24] border border-purple-500/30 flex items-center justify-center text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
          >
            <Bell className="size-3.5" />
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-purple-600 text-white font-mono text-[8px] font-black flex items-center justify-center shadow-[0_0_8px_#a855f7]">
              3
            </span>
          </button>

          <Link href="/dashboard" className="relative cursor-pointer">
            <div className="size-8 rounded-full bg-gradient-to-tr from-purple-600 via-cyan-400 to-blue-600 p-0.5 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <div className="size-full rounded-full bg-[#050D24] flex items-center justify-center text-white text-xs font-heading font-bold">
                {userName[0].toUpperCase()}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 border-2 border-[#02040A] shadow-[0_0_6px_#10b981]" />
          </Link>
        </div>
      </header>

      {/* Expandable Mobile Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-[#040816] border-b border-purple-500/20"
          >
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search games, dispatches, netcode..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060D24] border border-purple-500/30 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. MAIN SPACIOUS CONTENT AREA ═══ */}
      <main className="px-4 pt-4 space-y-5">
        
        {/* ═══ HERO CARD: 3D DRAGON ARTWORK & OWNER EMPIRE GREETING ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#0e1236]/90 via-[#060A1F]/95 to-[#030612] border border-purple-500/40 p-5 overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.25)] backdrop-blur-xl"
        >
          {/* Volumetric Cosmic Purple Glow */}
          <div aria-hidden="true" className="absolute -top-16 -right-16 size-48 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-16 -left-16 size-48 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2">
            {/* Left Content */}
            <div className="space-y-3 max-w-[58%]">
              <span className="text-[11px] font-sans font-medium text-slate-300 block">
                Welcome back,
              </span>

              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl font-black tracking-tight text-white uppercase font-heading truncate">
                  {userName}
                </h1>
                <Crown className="size-5 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] shrink-0" />
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                You&apos;re in control. Build, manage and dominate.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <Link
                  href="/games"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(147,51,234,0.5)] active:scale-95 transition-all"
                >
                  <Plus className="size-3.5 stroke-[3]" />
                  <span>New Game</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowIdentityModal(true)}
                  className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:text-white active:scale-95 transition-transform"
                  title="Customize Gold & Diamond Identity"
                >
                  <Crown className="size-3.5 text-yellow-400" />
                </button>

                <button
                  type="button"
                  onClick={onPlayIntro}
                  className="p-2 rounded-xl bg-[#081232] border border-cyan-500/30 text-cyan-300 hover:text-white active:scale-95 transition-transform"
                  title="Play 3D Intro"
                >
                  <Play className="size-3.5 fill-cyan-400 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Right: 3D Dragon Illustration with Purple Nebula Aura */}
            <div className="relative size-36 sm:size-44 shrink-0 -mr-2">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-transparent blur-xl pointer-events-none" />
              <Image
                src="/images/dragon_hero_mobile.jpg"
                alt="Dragon Studios 3D Dragon"
                width={180}
                height={180}
                priority
                className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]"
              />
            </div>
          </div>
        </motion.div>

        {/* ═══ 4 HORIZONTAL KPI METRICS WITH SPARKLINES & RADAR SONAR ═══ */}
        <section className="space-y-2">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            
            {/* Metric 1: Total Users */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3.5 rounded-2xl bg-[#060D24]/85 border border-cyan-500/30 backdrop-blur-md space-y-1.5 relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  TOTAL USERS
                </span>
                <div className="size-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                  <Users className="size-3.5" />
                </div>
              </div>

              <div className="text-xl font-black font-mono text-white tracking-tight">
                2.45M
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                <span>↑ 12.5%</span>
                <span className="text-slate-500 font-normal">This Month</span>
              </div>

              {/* Blue Wave Sparkline */}
              <div className="pt-1">
                <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M 0 18 Q 20 6, 40 14 T 80 4 T 100 8"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-[0_0_6px_#00f0ff]"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Metric 2: Active Players */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-3.5 rounded-2xl bg-[#060D24]/85 border border-purple-500/30 backdrop-blur-md space-y-1.5 relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  ACTIVE PLAYERS
                </span>
                <div className="size-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Gamepad2 className="size-3.5" />
                </div>
              </div>

              <div className="text-xl font-black font-mono text-white tracking-tight">
                1.32M
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                <span>↑ 8.2%</span>
                <span className="text-slate-500 font-normal">This Month</span>
              </div>

              {/* Purple Wave Sparkline */}
              <div className="pt-1">
                <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M 0 20 Q 25 10, 50 16 T 85 6 T 100 10"
                    stroke="#a855f7"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-[0_0_6px_#a855f7]"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Metric 3: Revenue / Telemetry */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3.5 rounded-2xl bg-[#060D24]/85 border border-amber-500/30 backdrop-blur-md space-y-1.5 relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  REVENUE
                </span>
                <div className="size-6 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <DollarSign className="size-3.5" />
                </div>
              </div>

              <div className="text-xl font-black font-mono text-white tracking-tight">
                $8.72M
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                <span>↑ 15.3%</span>
                <span className="text-slate-500 font-normal">This Month</span>
              </div>

              {/* Amber Wave Sparkline */}
              <div className="pt-1">
                <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M 0 22 Q 30 14, 60 18 T 90 4 T 100 8"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-[0_0_6px_#f59e0b]"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Metric 4: Server Status (Pulsing Radar Sonar) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-3.5 rounded-2xl bg-[#060D24]/85 border border-emerald-500/30 backdrop-blur-md space-y-1.5 relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  SERVER STATUS
                </span>
                <div className="size-6 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="size-3.5" />
                </div>
              </div>

              <div className="text-xl font-black font-mono text-white tracking-tight">
                99.99%
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>All Systems Operational</span>
              </div>

              {/* Radar Sonar Target Sweep Animation */}
              <div className="pt-1 flex justify-center">
                <div className="relative size-6 flex items-center justify-center">
                  <span className="absolute size-full rounded-full border border-emerald-500/40 animate-ping" style={{ animationDuration: "2.5s" }} />
                  <span className="absolute size-4 rounded-full border border-emerald-500/60" />
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ═══ 3. GAME PLATFORMS / STUDIO FRANCHISES SECTION ═══ */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              GAME PLATFORMS
            </h2>
            <Link
              href="/games"
              className="text-[11px] font-mono font-bold text-purple-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            
            {/* Card 1: DRAGON SLAYER 3D (Red / Crimson Neon Theme) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-3xl bg-gradient-to-r from-[#1c0710]/95 via-[#0b040a]/98 to-[#050816] border border-red-500/40 p-4 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)] active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0 max-w-[62%]">
                  <div className="size-11 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-500/30">
                    <Flame className="size-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-black uppercase text-white font-heading tracking-wide truncate">
                      DRAGON SLAYER 3D
                    </h3>
                    <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                      <span>3D Action RPG</span>
                      <span>•</span>
                      <span className="text-red-400 font-bold">PC & APK</span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-white">
                      120 FPS Native
                    </div>
                  </div>
                </div>

                {/* Right Character Art & Arrow Button */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="relative size-14 sm:size-16 rounded-2xl overflow-hidden border border-red-500/40 shadow-lg">
                    <Image
                      src="/images/dragon_slayer_card.jpg"
                      alt="Dragon Slayer Warrior"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <Link
                    href="/games/dragon-slayer-3d"
                    className="size-9 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-300 group-hover:bg-red-600 group-hover:text-white transition-all shadow-md"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2: CYBER DRIFT 3D (Electric Blue Neon Theme) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative rounded-3xl bg-gradient-to-r from-[#06142a]/95 via-[#03091c]/98 to-[#050816] border border-cyan-500/40 p-4 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0 max-w-[62%]">
                  <div className="size-11 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/30">
                    <Zap className="size-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-black uppercase text-white font-heading tracking-wide truncate">
                      CYBER DRIFT 3D
                    </h3>
                    <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                      <span>Anti-Gravity Racing</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-bold">120 FPS</span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-white">
                      Fast Delta Sync
                    </div>
                  </div>
                </div>

                {/* Right Character Art & Arrow Button */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="relative size-14 sm:size-16 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-lg">
                    <Image
                      src="/images/cyber_drift_card.jpg"
                      alt="Cyber Drift Pilot"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <Link
                    href="/games/cyber-drift-3d"
                    className="size-9 rounded-full bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-md"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 3: SHADOW NINJA 2D (Amber / Gold Neon Theme) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative rounded-3xl bg-gradient-to-r from-[#1c1204]/95 via-[#0c0802]/98 to-[#050816] border border-amber-500/40 p-4 overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0 max-w-[62%]">
                  <div className="size-11 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/30">
                    <Activity className="size-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-black uppercase text-white font-heading tracking-wide truncate">
                      SHADOW NINJA 2D
                    </h3>
                    <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                      <span>2D Platformer</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">Touch RPG</span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-white">
                      Boss Raids Live
                    </div>
                  </div>
                </div>

                {/* Right Character Art & Arrow Button */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="relative size-14 sm:size-16 rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg">
                    <Image
                      src="/images/shadow_ninja_card.jpg"
                      alt="Shadow Ninja Warrior"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <Link
                    href="/games/shadow-ninja-2d"
                    className="size-9 rounded-full bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-md"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ═══ 4. BOTTOM 2 SPLIT WIDGETS (LIVE ACTIVITIES & TOP GAMES) ═══ */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
          
          {/* Widget 1: LIVE ACTIVITIES */}
          <div className="p-4 rounded-3xl bg-[#060D24]/90 border border-purple-500/30 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE ACTIVITIES</span>
              </div>
              <Link href="/dashboard" className="text-[10px] font-mono text-purple-400 hover:text-cyan-300">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { icon: User, label: "New user registered", time: "5 sec ago", color: "text-amber-400" },
                { icon: ShoppingBag, label: "PC .exe build downloaded", time: "21 sec ago", color: "text-purple-400" },
                { icon: Server, label: "Server load optimal (14ms)", time: "1 min ago", color: "text-emerald-400" },
                { icon: Send, label: "Game patch v1.2.4 deployed", time: "5 min ago", color: "text-cyan-400" },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2.5 truncate">
                    <act.icon className={`size-3.5 ${act.color} shrink-0`} />
                    <span className="text-slate-300 truncate text-[11px]">{act.label}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0 font-sans">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: TOP GAMES */}
          <div className="p-4 rounded-3xl bg-[#060D24]/90 border border-cyan-500/30 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="text-xs font-mono font-bold text-white uppercase">
                TOP GAMES
              </div>
              <Link href="/games" className="text-[10px] font-mono text-cyan-400 hover:text-purple-300">
                View All
              </Link>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { name: "Dragon Slayer 3D", stats: "PC & APK Ready", rank: 1, color: "text-red-400", waveColor: "#ef4444" },
                { name: "Cyber Drift 3D", stats: "120 FPS Anti-Grav", rank: 2, color: "text-cyan-400", waveColor: "#00f0ff" },
                { name: "Shadow Ninja 2D", stats: "Action Platformer", rank: 3, color: "text-amber-400", waveColor: "#f59e0b" },
              ].map((g) => (
                <div key={g.rank} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="size-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {g.rank}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-white font-bold text-[11px] truncate">{g.name}</span>
                      <span className="text-[9px] text-slate-400">{g.stats}</span>
                    </div>
                  </div>

                  <svg className="w-12 h-5 overflow-visible shrink-0" viewBox="0 0 50 20" fill="none">
                    <path
                      d="M 0 16 Q 12 4, 25 12 T 50 6"
                      stroke={g.waveColor}
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* ═══ 5. GOD-LEVEL MOBILE FLOATING BOTTOM DOCK WITH ELEVATED CENTER DRAGON EMBLEM ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#030716]/98 border-t border-purple-500/30 backdrop-blur-2xl px-3 py-2 shadow-[0_-15px_40px_rgba(0,0,0,0.95)] flex items-center justify-around select-none">
        
        {/* Tab 1: Dashboard */}
        <Link
          href="/dashboard"
          onClick={() => setActiveBottomTab("dashboard")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeBottomTab === "dashboard" ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeBottomTab === "dashboard" ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <LayoutDashboard className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">DASHBOARD</span>
        </Link>

        {/* Tab 2: Games */}
        <Link
          href="/games"
          onClick={() => setActiveBottomTab("games")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeBottomTab === "games" ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeBottomTab === "games" ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <Gamepad2 className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">GAMES</span>
        </Link>

        {/* CENTER ELEVATED DRAGON CREST BUTTON */}
        <div className="-mt-8">
          <button
            type="button"
            onClick={onPlayIntro || (() => setIsDrawerOpen(true))}
            className="size-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-1 shadow-[0_0_30px_rgba(168,85,247,0.8)] active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title="Dragon Studios Core"
          >
            <div className="size-full rounded-full bg-[#030612] flex items-center justify-center border border-purple-400/60">
              <DragonLogoIcon size="sm" className="border-none drop-shadow-[0_0_8px_#a855f7]" />
            </div>
          </button>
        </div>

        {/* Tab 4: Analytics */}
        <Link
          href="/dashboard"
          onClick={() => setActiveBottomTab("analytics")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeBottomTab === "analytics" ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeBottomTab === "analytics" ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <PieChart className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">ANALYTICS</span>
        </Link>

        {/* Tab 5: Menu / Drawer */}
        <button
          type="button"
          onClick={() => {
            setActiveBottomTab("menu");
            setIsDrawerOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeBottomTab === "menu" ? "text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeBottomTab === "menu" ? "bg-purple-600/25 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
          }`}>
            <Grid className="size-4" />
          </div>
          <span className="text-[9px] font-mono mt-0.5 uppercase tracking-tight">MENU</span>
        </button>

      </div>

      {/* ═══ 6. MOBILE SLIDE-UP 12-MODULE COMMAND DRAWER ═══ */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#02040A]/85 backdrop-blur-xl"
              onClick={() => setIsDrawerOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2.5rem] border-t border-purple-500/40 bg-gradient-to-b from-[#0c0f30] via-[#05081c] to-[#02040A] p-5 pb-10 max-h-[85vh] overflow-y-auto shadow-[0_0_80px_rgba(168,85,247,0.35)] space-y-4 select-none"
            >
              {/* Top Notch & Header */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-1.5 rounded-full bg-purple-500/40" />
                <div className="w-full flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <DragonLogoIcon size="xs" className="border-purple-400/50 shadow-[0_0_10px_#a855f7]" />
                    <span className="font-heading font-black text-sm uppercase tracking-wider text-white">
                      DRAGON COMMAND DECK
                    </span>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-[#081232] border border-purple-500/30 text-slate-300 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* User Profile Banner inside Drawer */}
              <div className="p-3.5 rounded-2xl bg-[#081232]/90 border border-purple-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-sm font-heading">
                    {userName[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate font-heading">
                      {userName}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 truncate">
                      {userRole.toUpperCase()} • All Systems Online
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold uppercase"
                >
                  Dashboard
                </Link>
              </div>

              {/* 12 Quick Module Links */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                {[
                  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                  { label: "Games Library", href: "/games", icon: Gamepad2 },
                  { label: "Downloads Client", href: "/downloads", icon: Smartphone },
                  { label: "Community & Chat", href: "/community", icon: Users },
                  { label: "Studio Tech", href: "/studio", icon: Server },
                  { label: "Careers & Team", href: "/careers", icon: Sparkles },
                  { label: "Player Profile", href: "/profile", icon: User },
                  { label: "Support & Help", href: "/contact", icon: ShieldCheck },
                ].map((mod, i) => (
                  <Link
                    key={i}
                    href={mod.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#060D24] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400/50 hover:bg-purple-950/30 transition-all active:scale-95"
                  >
                    <mod.icon className="size-4 text-purple-400 shrink-0" />
                    <span className="truncate">{mod.label}</span>
                  </Link>
                ))}
              </div>

              {/* Verified Broadcast Channels */}
              <div className="space-y-2 pt-2 border-t border-purple-500/20">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    OFFICIAL BROADCASTS
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    ● VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <a
                    href={OFFICIAL_SOCIALS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Channel"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-all"
                  >
                    <WhatsAppIcon className="size-4" />
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.threads.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Threads Official"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all"
                  >
                    <ThreadsIcon className="size-4" />
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Official"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-pink-500/30 text-pink-400 hover:text-white hover:bg-pink-500/20 transition-all"
                  >
                    <Instagram className="size-4" />
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.youtube.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Official"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                  >
                    <Youtube className="size-4" />
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.x.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X Official"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-white/20 text-white hover:bg-white/10 transition-all"
                  >
                    <XIcon className="size-4" />
                  </a>

                  <a
                    href={OFFICIAL_SOCIALS.reddit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Reddit Official"
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#060D24] border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all"
                  >
                    <MessageSquare className="size-4" />
                  </a>
                </div>
              </div>

              {/* Sign Out Button */}
              {session?.user && (
                <div className="pt-2 border-t border-purple-500/20">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <LogOut className="size-4" />
                    <span>SIGN OUT OF DRAGONID</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* God-Level Player Identity Setup Modal */}
      <PlayerIdentitySetupModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        initialName={userName}
        initialGamerTag={userName}
      />

    </div>
  );
}
