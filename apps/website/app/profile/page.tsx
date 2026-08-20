"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit3,
  Trophy,
  Clock,
  Gamepad2,
  BarChart3,
  Calendar,
  Save,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Flame,
  Zap,
  Compass,
  Crown,
  Play,
  Share2,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Check,
  ChevronRight,
  HardDrive
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { WelcomeCinematicModal } from "@/components/cinematic/WelcomeCinematicModal";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  gamerTag?: string;
  primaryTitle?: string;
  bannerTheme?: string;
  bannerUrl?: string;
  bio?: string;
}

const BANNER_PRESETS = [
  {
    id: "valyria-fire",
    name: "Embers of Valyria",
    subtitle: "Dragonfire Awakening",
    bgClass: "bg-gradient-to-r from-red-600 via-amber-600 to-rose-950",
    glowColor: "rgba(239, 68, 68, 0.4)",
    tag: "DRAGONFIRE",
    icon: Flame,
  },
  {
    id: "neon-cyber",
    name: "Neon Drift",
    subtitle: "Neo-Tokyo Overdrive",
    bgClass: "bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-950",
    glowColor: "rgba(6, 182, 212, 0.4)",
    tag: "CYBERPUNK",
    icon: Zap,
  },
  {
    id: "void-space",
    name: "Aetheria",
    subtitle: "Cosmic Void Horizon",
    bgClass: "bg-gradient-to-r from-purple-700 via-indigo-900 to-slate-950",
    glowColor: "rgba(168, 85, 247, 0.4)",
    tag: "DEEP SPACE",
    icon: Compass,
  },
  {
    id: "gold-dragon",
    name: "Obsidian Gold",
    subtitle: "Supreme Founder Edition",
    bgClass: "bg-gradient-to-r from-amber-600 via-yellow-500 to-stone-950",
    glowColor: "rgba(245, 158, 11, 0.4)",
    tag: "VIP FOUNDER",
    icon: Crown,
  },
];

const GAMER_TITLES = [
  "Dragon Slayer",
  "Valyrian Knight",
  "Cyber Mercenary",
  "Void Walker",
  "Grandmaster Strategist",
  "Founding Pioneer",
  "Apex Legend",
];

const DRAGON_PLAYER_GAMES = [
  {
    id: "embers-of-valyria",
    title: "Embers of Valyria",
    genre: "Open-World Dark Fantasy RPG",
    status: "Beta Access",
    playtime: "48.5 hrs",
    achievements: "18 / 25",
    cloudSave: "Synchronized",
    coverColor: "from-red-600 via-rose-900 to-black",
    tag: "INSTALLED",
  },
  {
    id: "neon-drift-overdrive",
    title: "Neon Drift: Overdrive",
    genre: "Cyberpunk Anti-Gravity Racing",
    status: "Early Access",
    playtime: "32.1 hrs",
    achievements: "14 / 20",
    cloudSave: "Synchronized",
    coverColor: "from-cyan-600 via-blue-900 to-black",
    tag: "READY TO PLAY",
  },
  {
    id: "aetheria-void",
    title: "Aetheria: Chronicles of the Void",
    genre: "Deep Space Sci-Fi Odyssey",
    status: "Pre-Order Deluxe",
    playtime: "Pre-Loaded",
    achievements: "0 / 40",
    cloudSave: "Ready",
    coverColor: "from-purple-600 via-indigo-900 to-black",
    tag: "PRE-ORDERED",
  },
];

export default function ProfilePage() {
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Customization modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGamerTag, setEditGamerTag] = useState("");
  const [editTitle, setEditTitle] = useState("Dragon Slayer");
  const [selectedTheme, setSelectedTheme] = useState("valyria-fire");
  const [customBannerUrl, setCustomBannerUrl] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Welcome cinematic modal
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        setEditName(data.user.name || "");
        setEditGamerTag(data.user.gamerTag || data.user.name || "Player");
        setEditTitle(data.user.primaryTitle || "Dragon Slayer");
        setSelectedTheme(data.user.bannerTheme || "valyria-fire");
        setCustomBannerUrl(data.user.bannerUrl || "");
        setEditBio(data.user.bio || "");
        if (data.tickets) setTickets(data.tickets);
      }
    } catch (e) {
      console.error("Error loading user profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    if (typeof window !== "undefined" && window.location.search.includes("welcome=true")) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          gamerTag: editGamerTag,
          primaryTitle: editTitle,
          bannerTheme: selectedTheme,
          bannerUrl: customBannerUrl,
          bio: editBio,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setIsEditOpen(false);
        fetchProfile();
      }
    } catch (e) {
      console.error("Save profile error", e);
    } finally {
      setSaving(false);
    }
  };

  const activePreset = BANNER_PRESETS.find((p) => p.id === (userData?.bannerTheme || selectedTheme)) || BANNER_PRESETS[0];

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      {/* Welcome Cinematic Modal */}
      <WelcomeCinematicModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/profile");
          }
        }}
        userName={userData?.name || editName}
        userEmail={userData?.email}
      />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12 font-sans select-none">
        
        {/* CUSTOMIZABLE DRAGON GAMER BANNER & HERO HEADER */}
        <section className="container-site relative z-10 mb-10">
          <div className="rounded-3xl glass-heavy overflow-hidden border border-white/20 shadow-2xl relative">
            
            {/* Live Banner Artwork */}
            <div
              className={`h-56 sm:h-72 w-full relative p-6 sm:p-10 flex flex-col justify-between transition-all duration-700 ${
                userData?.bannerUrl
                  ? "bg-cover bg-center"
                  : activePreset.bgClass
              }`}
              style={
                userData?.bannerUrl
                  ? { backgroundImage: `url(${userData.bannerUrl})` }
                  : undefined
              }
            >
              {/* Dynamic Atmospheric Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-black/30" />

              {/* Top Banner Badges & Actions */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#ff1e4b] border border-[#ff1e4b]/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Crown className="size-3.5 text-amber-400" />
                    <span>DRAGONID VIP FOUNDER</span>
                  </span>
                  <span className="hidden sm:inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {activePreset.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWelcomeModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg hover:scale-105 cursor-pointer"
                  >
                    <Play className="size-3.5 text-cyan-400 fill-cyan-400" />
                    <span className="hidden sm:inline">Play Welcome Video</span>
                  </button>

                  <Button
                    onClick={() => setIsEditOpen(true)}
                    variant="solidRed"
                    size="sm"
                    className="gap-2 rounded-xl text-xs font-mono shadow-lg shadow-[#ff1e4b]/30 hover:scale-105 transition-all"
                  >
                    <Edit3 className="size-3.5" />
                    <span>Edit Banner & Gamertag</span>
                  </Button>
                </div>
              </div>

              {/* Bottom Banner Title */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
                    CUSTOM GAMER BANNER: {activePreset.name}
                  </span>
                  <p className="text-xs text-slate-200/80 font-sans italic hidden sm:block">
                    &ldquo;{activePreset.subtitle}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Avatar & Identity Strip */}
            <div className="p-6 sm:p-8 bg-[#050B17]/95 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Avatar with Radiant Glow */}
                <div className="relative">
                  <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-tr from-[#ff1e4b] via-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-[#ff1e4b]/30">
                    <div className="w-full h-full rounded-[22px] bg-[#0A1020] flex items-center justify-center font-black text-white text-3xl font-heading">
                      {userData?.name ? userData.name[0].toUpperCase() : "D"}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-7 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-lg font-mono font-black text-[11px]">
                    LV42
                  </div>
                </div>

                {/* Name, Tag & Rank */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
                      {userData?.name || "Dragon Player"}
                    </h1>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      ONLINE
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 font-bold">
                      @{userData?.gamerTag || "player"}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Trophy className="size-3" />
                      <span>{userData?.primaryTitle || "Dragon Slayer"}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{userData?.email}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Pills (Rockstar Style) */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[90px]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">GAMES</span>
                  <span className="text-lg font-black text-white font-mono">3</span>
                </div>
                <div className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[90px]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">HOURS</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">80.6</span>
                </div>
                <div className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[90px]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">TROPHIES</span>
                  <span className="text-lg font-black text-amber-400 font-mono">32</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY: GAMES LAUNCHER, TROPHY CASE & PASSPORT */}
        <section className="container-site relative z-10 space-y-8">
          
          {/* 1. GAMES LAUNCHER SHOWCASE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="size-5 text-[#ff1e4b]" />
                <h2 className="text-lg font-black uppercase text-white tracking-wider font-heading">
                  PLAYER GAMES LIBRARY & LAUNCHER
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Universal Cloud Save Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DRAGON_PLAYER_GAMES.map((game) => (
                <div
                  key={game.id}
                  className="rounded-3xl bg-[#070E1E]/95 border border-white/15 p-6 space-y-5 hover:border-cyan-500/50 transition-all shadow-xl hover:scale-[1.02] group"
                >
                  <div className={`h-36 rounded-2xl bg-gradient-to-tr ${game.coverColor} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white font-mono text-[9px] font-bold border border-white/20">
                        {game.tag}
                      </span>
                      <HardDrive className="size-4 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">
                        {game.status}
                      </span>
                      <h3 className="text-lg font-black text-white font-heading uppercase">
                        {game.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Playtime:</span>
                      <span className="text-white font-bold">{game.playtime}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Achievements:</span>
                      <span className="text-amber-400 font-bold">{game.achievements}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cloud Save:</span>
                      <span className="text-emerald-400 font-bold">{game.cloudSave}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link
                      href={`/games#${game.id}`}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-black text-xs font-mono uppercase tracking-wider text-center transition-all hover:scale-105 shadow-md shadow-cyan-500/20"
                    >
                      LAUNCH GAME →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. TROPHY & ACHIEVEMENT CASE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Trophy Showcase */}
            <div className="lg:col-span-2 rounded-3xl bg-[#070E1E]/95 border border-white/15 p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="size-5 text-amber-400" />
                  <h3 className="text-base font-black uppercase text-white font-heading">
                    TROPHY & ACHIEVEMENT CASE
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  32 UNLOCKED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Crown className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">Valyrian Dragon Slayer</h4>
                    <span className="text-[10px] text-slate-400 font-sans block">Defeat ancient High Drake in solo combat</span>
                    <span className="text-[9px] font-mono text-amber-400 font-bold uppercase mt-1 inline-block">PLATINUM TROPHY</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Zap className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">Mach 5 Soundbreaker</h4>
                    <span className="text-[10px] text-slate-400 font-sans block">Complete Neo-Tokyo circuit under 55 seconds</span>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase mt-1 inline-block">GOLD TROPHY</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Compass className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">Void Stalker</h4>
                    <span className="text-[10px] text-slate-400 font-sans block">Discover 10 planetary anomalies in Aetheria</span>
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase mt-1 inline-block">GOLD TROPHY</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="size-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">Dragon Studios Founder</h4>
                    <span className="text-[10px] text-slate-400 font-sans block">Active verified DragonID identity platform pass</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase mt-1 inline-block">VERIFIED BADGE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DragonID Passport Card */}
            <div className="rounded-3xl bg-[#070E1E]/95 border border-white/15 p-6 md:p-8 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    DRAGONID PASSPORT
                  </span>
                  <ShieldCheck className="size-4 text-emerald-400" />
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">DragonID Key Hash</span>
                    <span className="text-slate-200 font-bold truncate block">
                      DRG-ID-{userData?.id?.substring(0, 12).toUpperCase() || "7789-V1"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Account Clearance</span>
                    <span className="text-emerald-400 font-bold block">
                      {userData?.role || "VERIFIED PLAYER"} ROOT
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Security Integrity</span>
                    <span className="text-cyan-300 font-bold block">
                      100% Active • Military Encrypted
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-500">
                  Dragon Studios Core Services • Engine v4.0
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* EDIT BANNER & GAMERTAG MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#070E1E] border border-cyan-500/40 rounded-3xl w-full max-w-xl p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Edit3 className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-heading">
                    Customize Gamer Profile & Banner
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Rockstar & Epic Games inspired player customizer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-mono">
              
              {/* 1. Name & GamerTag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">YOUR FIRST / DISPLAY NAME</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Marcus"
                    className="w-full rounded-xl bg-[#030712] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold uppercase text-[10px]">GAMERTAG HANDLE (@)</label>
                  <input
                    type="text"
                    required
                    value={editGamerTag}
                    onChange={(e) => setEditGamerTag(e.target.value)}
                    placeholder="DragonMaster"
                    className="w-full rounded-xl bg-[#030712] px-3.5 py-2.5 text-xs text-cyan-300 border border-slate-700 focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>
              </div>

              {/* 2. Gamer Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">SELECT PRIMARY GAMER TITLE</label>
                <select
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl bg-[#030712] px-3.5 py-2.5 text-xs text-amber-300 border border-slate-700 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  {GAMER_TITLES.map((t) => (
                    <option key={t} value={t} className="bg-[#070E1E] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Official Game Banner Presets */}
              <div className="space-y-2">
                <label className="text-slate-300 font-bold uppercase text-[10px]">SELECT OFFICIAL 3D GAME BANNER</label>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(preset.id);
                        setCustomBannerUrl("");
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        selectedTheme === preset.id && !customBannerUrl
                          ? "bg-white/15 border-cyan-400 shadow-md shadow-cyan-500/20"
                          : "bg-black/50 border-white/10 hover:border-white/20 text-slate-400"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-white block uppercase">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-sans block">
                        {preset.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Custom Banner Image URL */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">OR ENTER CUSTOM BANNER IMAGE URL</label>
                <div className="relative">
                  <ImageIcon className="size-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="url"
                    value={customBannerUrl}
                    onChange={(e) => setCustomBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or wallpaper URL"
                    className="w-full rounded-xl bg-[#030712] pl-9 pr-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                  <span>SAVE CUSTOM GAMER BANNER</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </SceneBackground>
  );
}
