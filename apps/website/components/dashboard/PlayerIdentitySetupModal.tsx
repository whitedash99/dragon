"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Flame,
  Zap,
  Check,
  User,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Radio,
  CheckCircle2,
  Crown,
  Shield,
  Activity,
  Compass,
  Cpu
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { DragonTridentCanvas } from "@/components/cinematic/DragonTridentCanvas";
import { soundFx } from "@/lib/sound-effects";

export interface GodLevelBanner {
  id: string;
  name: string;
  subtitle: string;
  bgClass: string;
  borderGlow: string;
  tag: string;
  icon: any;
  accentColor: string;
}

export const GOD_LEVEL_BANNERS: GodLevelBanner[] = [
  {
    id: "lightning-cyan",
    name: "Obsidian Lightning Overdrive",
    subtitle: "High-Voltage Electric Cyan Dragon Storm",
    bgClass: "bg-gradient-to-r from-[#00f0ff] via-[#0284c7] to-[#020617]",
    borderGlow: "rgba(0, 240, 255, 0.8)",
    tag: "LIGHTNING APEX",
    icon: Zap,
    accentColor: "#00f0ff",
  },
  {
    id: "valyria-fire",
    name: "Embers of Valyria Inferno",
    subtitle: "Mythic Dragonfire Crimson Flame",
    bgClass: "bg-gradient-to-r from-[#dc2626] via-[#7f1d1d] to-[#0a0202]",
    borderGlow: "rgba(239, 68, 68, 0.8)",
    tag: "MYTHIC DRAGONFIRE",
    icon: Flame,
    accentColor: "#ef4444",
  },
  {
    id: "neon-cyber",
    name: "Neo-Tokyo Cyberpulse",
    subtitle: "Anti-Gravity Drift & High-Voltage Neon",
    bgClass: "bg-gradient-to-r from-[#06b6d4] via-[#4338ca] to-[#020617]",
    borderGlow: "rgba(6, 182, 212, 0.8)",
    tag: "CYBERPUNK OVERDRIVE",
    icon: Activity,
    accentColor: "#06b6d4",
  },
  {
    id: "void-space",
    name: "Aetheria Cosmic Void",
    subtitle: "Deep Nebula Plasma & Stellar Rifts",
    bgClass: "bg-gradient-to-r from-[#9333ea] via-[#3b0764] to-[#030712]",
    borderGlow: "rgba(168, 85, 247, 0.8)",
    tag: "COSMIC VOID",
    icon: Compass,
    accentColor: "#c084fc",
  },
  {
    id: "gold-royalty",
    name: "Imperial Golden Sovereign",
    subtitle: "Royal Dragon Emperor Dynasty",
    bgClass: "bg-gradient-to-r from-[#f59e0b] via-[#b45309] to-[#0d0701]",
    borderGlow: "rgba(245, 158, 11, 0.8)",
    tag: "GOLDEN SOVEREIGN",
    icon: Crown,
    accentColor: "#fbbf24",
  },
  {
    id: "glacial-ice",
    name: "Sub-Zero Frost Monarch",
    subtitle: "Glacial Arctic Blizzard Scale Armor",
    bgClass: "bg-gradient-to-r from-[#38bdf8] via-[#0369a1] to-[#021324]",
    borderGlow: "rgba(56, 189, 248, 0.8)",
    tag: "GLACIAL MONARCH",
    icon: Sparkles,
    accentColor: "#38bdf8",
  },
  {
    id: "emerald-venom",
    name: "Toxic Emerald Matrix",
    subtitle: "Nanotech Bio-Plasma Kinetic Energy",
    bgClass: "bg-gradient-to-r from-[#10b981] via-[#064e3b] to-[#021f18]",
    borderGlow: "rgba(16, 185, 129, 0.8)",
    tag: "TOXIC MATRIX",
    icon: Shield,
    accentColor: "#34d399",
  },
  {
    id: "bloodmoon-crimson",
    name: "Bloodmoon Eclipse",
    subtitle: "Dark Scarlet Assassin Blood Moon",
    bgClass: "bg-gradient-to-r from-[#e11d48] via-[#881337] to-[#120206]",
    borderGlow: "rgba(225, 29, 72, 0.8)",
    tag: "BLOODMOON ECLIPSE",
    icon: Flame,
    accentColor: "#f43f5e",
  },
  {
    id: "solar-flare",
    name: "Solar Supernova Surge",
    subtitle: "Molten Solar Flare Core Reactor",
    bgClass: "bg-gradient-to-r from-[#ea580c] via-[#7c2d12] to-[#140602]",
    borderGlow: "rgba(234, 88, 12, 0.8)",
    tag: "SOLAR SUPERNOVA",
    icon: Sparkles,
    accentColor: "#fb923c",
  },
  {
    id: "shadow-phantom",
    name: "Phantom Shadow Katana",
    subtitle: "Ultra-Violet Blade Assassin Dynasty",
    bgClass: "bg-gradient-to-r from-[#6366f1] via-[#1e1b4b] to-[#050508]",
    borderGlow: "rgba(99, 102, 241, 0.8)",
    tag: "SHADOW KATANA",
    icon: Cpu,
    accentColor: "#818cf8",
  },
];

export interface GodLevelAvatar {
  id: string;
  name: string;
  title: string;
  imageSrc: string;
  borderClass: string;
  glowColor: string;
}

export const GOD_LEVEL_AVATARS: GodLevelAvatar[] = [
  {
    id: "obsidian-lightning-dragon",
    name: "Obsidian Lightning Dragon",
    title: "High-Voltage Sovereign",
    imageSrc: "/images/dragon_hero_mobile.jpg",
    borderClass: "border-cyan-400",
    glowColor: "#00f0ff",
  },
  {
    id: "dragonfire-berserker",
    name: "Dragonfire Warrior",
    title: "Crimson Flame Berserker",
    imageSrc: "/images/dragon_slayer_card.jpg",
    borderClass: "border-red-400",
    glowColor: "#ef4444",
  },
  {
    id: "cyber-valkyrie",
    name: "Cyber Drift Pilot",
    title: "Anti-Gravity Mecha Ace",
    imageSrc: "/images/cyber_drift_card.jpg",
    borderClass: "border-cyan-400",
    glowColor: "#06b6d4",
  },
  {
    id: "neo-ninja",
    name: "Shadow Ninja",
    title: "Plasma Blade Assassin",
    imageSrc: "/images/shadow_ninja_card.jpg",
    borderClass: "border-indigo-400",
    glowColor: "#818cf8",
  },
  {
    id: "diamond-archon",
    name: "Diamond Celestial Archon",
    title: "Crystalline Ice Guardian",
    imageSrc: "/images/avatar_diamond_celestial.jpg",
    borderClass: "border-sky-400",
    glowColor: "#38bdf8",
  },
  {
    id: "gold-emperor",
    name: "Cyber Overlord Monarch",
    title: "Imperial Netcode King",
    imageSrc: "/images/avatar_gold_crown_king.jpg",
    borderClass: "border-amber-400",
    glowColor: "#fbbf24",
  },
  {
    id: "solar-dragon",
    name: "Solar Gold Dragon",
    title: "Ascended Electric Sovereign",
    imageSrc: "/images/avatar_solar_gold_dragon.jpg",
    borderClass: "border-amber-400",
    glowColor: "#f59e0b",
  },
  {
    id: "void-sorcerer",
    name: "Void Sorcerer Phantom",
    title: "Cosmic Nebula Mage",
    imageSrc: "/images/avatar_void_sorcerer.jpg",
    borderClass: "border-purple-400",
    glowColor: "#c084fc",
  },
  {
    id: "glacial-dragon",
    name: "Sub-Zero Frostbite Dragon",
    title: "Glacial Dragon Monarch",
    imageSrc: "/images/flying_ice_fire_dragon.jpg",
    borderClass: "border-blue-400",
    glowColor: "#60a5fa",
  },
  {
    id: "bloodmoon-slayer",
    name: "Bloodmoon Slayer",
    title: "Crimson Eclipse Vanguard",
    imageSrc: "/images/dragon_slayer_card.jpg",
    borderClass: "border-rose-500",
    glowColor: "#f43f5e",
  },
];

interface PlayerIdentitySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialGamerTag?: string;
  initialTitle?: string;
  initialBanner?: string;
  initialAvatar?: string;
  initialBio?: string;
  onSaved?: (updatedProfile: any) => void;
}

const STEPS = [
  { id: 1, label: "GAMER NAME", sub: "Choose your callsign", icon: User },
  { id: 2, label: "10 DRAGON AVATARS", sub: "Select your legend", icon: Zap },
  { id: 3, label: "10 BATTLE BANNERS", sub: "Select your aura", icon: Layers },
];

export function PlayerIdentitySetupModal({
  isOpen,
  onClose,
  initialName = "Dragon Slayer",
  initialGamerTag = "DragonWarrior",
  initialBanner = "lightning-cyan",
  initialAvatar = "obsidian-lightning-dragon",
  onSaved,
}: PlayerIdentitySetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [gamerTag, setGamerTag] = useState(initialGamerTag);
  const [displayName, setDisplayName] = useState(initialName);
  const [selectedBannerId, setSelectedBannerId] = useState(initialBanner);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatar);
  const [saving, setSaving] = useState(false);
  const [showGrandReveal, setShowGrandReveal] = useState(false);

  useEffect(() => {
    if (initialGamerTag) setGamerTag(initialGamerTag);
    if (initialName) setDisplayName(initialName);
    if (initialBanner) setSelectedBannerId(initialBanner);
    if (initialAvatar) setSelectedAvatarId(initialAvatar);
  }, [initialGamerTag, initialName, initialBanner, initialAvatar]);

  useEffect(() => {
    if (isOpen) {
      soundFx.playLightningSpark();
    }
  }, [isOpen]);

  const activeBanner = GOD_LEVEL_BANNERS.find((b) => b.id === selectedBannerId) || GOD_LEVEL_BANNERS[0];
  const activeAvatar = GOD_LEVEL_AVATARS.find((a) => a.id === selectedAvatarId) || GOD_LEVEL_AVATARS[0];

  // Autosave helper
  const triggerAutoSave = (updatedFields: { gamerTag?: string; displayName?: string; bannerId?: string; avatarId?: string }) => {
    const nextTag = updatedFields.gamerTag ?? gamerTag;
    const nextName = updatedFields.displayName ?? displayName;
    const nextBanner = updatedFields.bannerId ?? selectedBannerId;
    const nextAvatarObj = GOD_LEVEL_AVATARS.find((a) => a.id === (updatedFields.avatarId ?? selectedAvatarId)) || activeAvatar;

    const payload = {
      name: nextName.trim() || nextTag.trim(),
      gamerTag: nextTag.trim() || nextName.trim(),
      bannerTheme: nextBanner,
      avatar: nextAvatarObj.imageSrc,
      image: nextAvatarObj.imageSrc,
    };

    fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Autosave error:", err));

    if (onSaved) {
      onSaved(payload);
    }
  };

  const goToStep = (targetStep: number) => {
    soundFx.playSlideWhoosh();
    setCurrentStep(targetStep);
  };

  const handleSaveAndComplete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    soundFx.playForgeComplete();

    const profileData = {
      name: displayName.trim() || gamerTag.trim(),
      gamerTag: gamerTag.trim() || displayName.trim(),
      bannerTheme: selectedBannerId,
      avatar: activeAvatar.imageSrc,
      image: activeAvatar.imageSrc,
    };

    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (onSaved) {
        onSaved(profileData);
      }
    } catch (err) {
      console.error("Save identity error:", err);
    } finally {
      setSaving(false);
      setShowGrandReveal(true);
    }
  };

  const handleFinishReveal = () => {
    soundFx.playClick();
    setShowGrandReveal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] h-screen w-screen bg-[#01040D] overflow-y-auto overflow-x-hidden flex flex-col overscroll-contain">
        {/* Ambient Dragon Lightning Canvas */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <DragonTridentCanvas />
        </div>

        {/* Top Electric Cyan Glowing Accent */}
        <div className="fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_30px_#00f0ff] z-40 pointer-events-none" />

        {/* ═══ GRAND 3D REVEAL SHOWCASE SCREEN ═══ */}
        {showGrandReveal ? (
          <div className="relative z-30 min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-8 max-w-2xl mx-auto my-auto">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(0,240,255,0.6)]">
                <CheckCircle2 className="size-4 text-cyan-400" />
                <span>DRAGONID FORGED SUCCESSFULLY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-heading tracking-tight drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]">
                WELCOME, {gamerTag || displayName}!
              </h2>
            </motion.div>

            {/* 3D Floating DragonID Card Showcase */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`w-full rounded-3xl ${activeBanner.bgClass} p-6 sm:p-8 border-2 border-cyan-400 shadow-[0_0_80px_rgba(0,240,255,0.5)] relative overflow-hidden`}
            >
              <div className="flex items-center gap-5">
                <div className={`relative size-24 rounded-2xl overflow-hidden border-2 ${activeAvatar.borderClass} shadow-2xl shrink-0`}>
                  <Image
                    src={activeAvatar.imageSrc}
                    alt={activeAvatar.name}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="inline-block px-3 py-0.5 rounded-full bg-black/60 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider">
                    {activeBanner.tag}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading">
                    {gamerTag || displayName}
                  </h3>
                  <p className="text-xs font-mono text-cyan-200">
                    DRAGON STUDIOS VIP PLAYER
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={handleFinishReveal}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>ENTER PLAYER DASHBOARD</span>
              <ArrowRight className="size-4" />
            </motion.button>
          </div>
        ) : (
          <>
            {/* ═══ CLEAN STICKY HEADER BAR ═══ */}
            <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-4 border-b border-cyan-500/25 bg-[#03091D]/90 backdrop-blur-2xl flex items-center justify-between shadow-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px]">
                  <div className="size-full rounded-2xl bg-[#020614] flex items-center justify-center">
                    <DragonLogoIcon size="sm" className="border-none text-cyan-400 drop-shadow-[0_0_10px_#00f0ff]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black uppercase text-white font-heading tracking-tight">
                    SETUP YOUR DRAGONID
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="flex size-9 items-center justify-center rounded-xl bg-[#061026] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                aria-label="Close setup"
              >
                <X className="size-4" />
              </button>
            </header>

            {/* ═══ MAIN INTERACTIVE SCROLLABLE FORM ═══ */}
            <main className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-36 flex flex-col gap-6">
              {/* LIVE DRAGONID PREVIEW CARD */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-1 mb-2 flex items-center gap-1.5 text-cyan-400">
                  <Radio className="size-3 animate-pulse text-cyan-400" />
                  <span>LIVE DRAGONID CARD PREVIEW (AUTOSAVED)</span>
                </div>

                <div className={`relative rounded-3xl ${activeBanner.bgClass} p-5 sm:p-6 border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.35)] overflow-hidden text-white transition-all duration-500`}>
                  <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                    <div className={`relative size-16 sm:size-20 rounded-2xl overflow-hidden border-2 ${activeAvatar.borderClass} shadow-2xl shrink-0`}>
                      <Image
                        src={activeAvatar.imageSrc}
                        alt={activeAvatar.name}
                        width={80}
                        height={80}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-cyan-400/30 text-[9px] font-mono font-black uppercase tracking-wider text-cyan-300">
                        <activeBanner.icon className="size-3 text-cyan-400" />
                        <span>{activeBanner.tag}</span>
                      </div>

                      <h2 className="text-xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white">
                        {gamerTag || displayName || "DragonWarrior"}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP TABS (3 SIMPLE STEPS) */}
              <div className="grid grid-cols-3 gap-2">
                {STEPS.map((s) => {
                  const isCurrent = currentStep === s.id;
                  const isPast = currentStep > s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goToStep(s.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer relative overflow-hidden ${
                        isCurrent
                          ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.35)] text-white"
                          : isPast
                          ? "bg-[#03091D]/80 border-cyan-500/30 text-cyan-300"
                          : "bg-[#02050E]/60 border-white/10 text-slate-500 hover:border-white/20"
                      }`}
                    >
                      <div className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent ? "bg-cyan-400 text-black font-heading font-black" : "bg-white/10 text-slate-400"
                      }`}>
                        {isPast ? <Check className="size-3.5" /> : s.id}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-heading font-black uppercase tracking-wider truncate">
                          {s.label}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 hidden sm:block truncate">
                          {s.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* STEP CONTENT CONTAINER */}
              <div className="bg-[#03091D]/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 backdrop-blur-2xl shadow-2xl">
                <AnimatePresence mode="wait">
                  {/* STEP 1: GAMER NAME */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -30, rotateY: 5 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 30, rotateY: -5 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-heading font-black uppercase text-white tracking-wide">
                          1. CHOOSE YOUR GAMERTAG
                        </h3>
                        <p className="text-xs text-slate-300 font-sans">
                          Enter your callsign to represent you across all Dragon Studios games.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                            WARRIOR GAMERTAG / CALLSIGN
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={gamerTag}
                              onFocus={() => soundFx.playClick()}
                              onChange={(e) => {
                                setGamerTag(e.target.value);
                                triggerAutoSave({ gamerTag: e.target.value });
                              }}
                              placeholder="e.g. DragonSlayer, ShadowBlade"
                              className="w-full rounded-2xl bg-[#02050E] px-4 py-3.5 text-sm text-white font-mono font-bold border border-cyan-500/30 focus:outline-none focus:border-cyan-400 shadow-inner"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: 10 AVATAR FORGE */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: -30, rotateY: 5 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 30, rotateY: -5 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-heading font-black uppercase text-white tracking-wide">
                          2. SELECT FROM 10 GOD-LEVEL AVATARS
                        </h3>
                        <p className="text-xs text-slate-300 font-sans">
                          Click any avatar to instantly equip it and preview on your DragonID.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                        {GOD_LEVEL_AVATARS.map((av) => {
                          const isSelected = selectedAvatarId === av.id;
                          return (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => {
                                soundFx.playClick();
                                setSelectedAvatarId(av.id);
                                triggerAutoSave({ avatarId: av.id });
                              }}
                              className={`p-3 rounded-2xl border text-left space-y-2 transition-all cursor-pointer relative overflow-hidden ${
                                isSelected
                                  ? "bg-cyan-500/25 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] scale-105"
                                  : "bg-[#02050E]/80 border-white/10 hover:border-cyan-500/40 hover:scale-[1.02]"
                              }`}
                            >
                              <div className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 ${
                                isSelected ? av.borderClass : "border-white/15"
                              }`}>
                                <Image
                                  src={av.imageSrc}
                                  alt={av.name}
                                  fill
                                  className="object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg font-black text-xs">
                                    <Check className="size-3" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-[11px] font-heading font-black uppercase text-white truncate">
                                  {av.name}
                                </div>
                                <div className="text-[9px] font-mono text-slate-400 truncate">
                                  {av.title}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: 10 BATTLE BANNERS */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: -30, rotateY: 5 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 30, rotateY: -5 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-heading font-black uppercase text-white tracking-wide">
                          3. CHOOSE FROM 10 GOD-LEVEL BATTLE BANNERS
                        </h3>
                        <p className="text-xs text-slate-300 font-sans">
                          Click any banner to equip it on your card with instant visual aura.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {GOD_LEVEL_BANNERS.map((bn) => {
                          const isSelected = selectedBannerId === bn.id;
                          const Icon = bn.icon;
                          return (
                            <button
                              key={bn.id}
                              type="button"
                              onClick={() => {
                                soundFx.playClick();
                                setSelectedBannerId(bn.id);
                                triggerAutoSave({ bannerId: bn.id });
                              }}
                              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                                isSelected
                                  ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] scale-102"
                                  : "bg-[#02050E]/80 border-white/10 hover:border-cyan-500/30 hover:scale-[1.01]"
                              }`}
                            >
                              <div className={`h-12 w-full rounded-xl ${bn.bgClass} mb-3 p-2.5 flex items-center justify-between shadow-lg`}>
                                <div className="px-2.5 py-0.5 rounded-full bg-black/70 text-white font-mono text-[9px] font-black uppercase">
                                  {bn.tag}
                                </div>
                                <Icon className="size-4 text-white drop-shadow-[0_0_8px_white]" />
                              </div>

                              <div className="text-xs font-heading font-black uppercase text-white">
                                {bn.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {bn.subtitle}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* STEP NAVIGATION BUTTONS */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => goToStep(currentStep - 1)}
                        className="px-5 py-3 rounded-2xl bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <ArrowLeft className="size-4" />
                        <span>PREVIOUS</span>
                      </button>
                    )}
                  </div>

                  <div>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => goToStep(currentStep + 1)}
                        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>NEXT STEP</span>
                        <ArrowRight className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSaveAndComplete}
                        disabled={saving}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_40px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {saving ? (
                          <span>SAVING DRAGONID...</span>
                        ) : (
                          <>
                            <Zap className="size-4" />
                            <span>SAVE & SHOW DRAGONID →</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </AnimatePresence>
  );
}
