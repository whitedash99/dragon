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
  Cpu,
  Award,
  AlertCircle
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";
import { validateDragonIdHandle } from "@/lib/user-profile";

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
    bgClass: "bg-gradient-to-r from-[#00E5FF] via-[#0284c7] to-[#020617]",
    borderGlow: "rgba(0, 229, 255, 0.8)",
    tag: "LIGHTNING APEX",
    icon: Zap,
    accentColor: "#00E5FF",
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
    bgClass: "bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#020617]",
    borderGlow: "rgba(0, 229, 255, 0.8)",
    tag: "CYBERPUNK OVERDRIVE",
    icon: Activity,
    accentColor: "#00E5FF",
  },
  {
    id: "void-space",
    name: "Aetheria Cosmic Void",
    subtitle: "Deep Nebula Plasma & Stellar Rifts",
    bgClass: "bg-gradient-to-r from-[#7C3CFF] via-[#3b0764] to-[#030712]",
    borderGlow: "rgba(124, 60, 255, 0.8)",
    tag: "COSMIC VOID",
    icon: Compass,
    accentColor: "#A855F7",
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
    bgClass: "bg-gradient-to-r from-[#00FFC6] via-[#064e3b] to-[#021f18]",
    borderGlow: "rgba(0, 255, 198, 0.8)",
    tag: "TOXIC MATRIX",
    icon: Shield,
    accentColor: "#00FFC6",
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
    glowColor: "#00E5FF",
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
    glowColor: "#00E5FF",
  },
  {
    id: "neo-ninja",
    name: "Shadow Ninja",
    title: "Plasma Blade Assassin",
    imageSrc: "/images/shadow_ninja_card.jpg",
    borderClass: "border-purple-400",
    glowColor: "#A855F7",
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
    glowColor: "#A855F7",
  },
];

export const AVAILABLE_TITLES = [
  "Dragon Operative",
  "Apex Dragon Champion",
  "Vulkan Architect",
  "Cyber Phantom",
  "Valyrian Knight",
  "Shadow Sovereign",
  "Grandmaster Vanguard",
];

interface PlayerIdentitySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialGamerTag?: string;
  initialTitle?: string;
  initialBanner?: string;
  initialAvatar?: string;
  onSaved?: (updatedProfile: any) => void;
}

export function PlayerIdentitySetupModal({
  isOpen,
  onClose,
  initialName = "Dragon Slayer",
  initialGamerTag = "operative",
  initialTitle = "Dragon Operative",
  initialBanner = "lightning-cyan",
  initialAvatar = "obsidian-lightning-dragon",
  onSaved,
}: PlayerIdentitySetupModalProps) {
  const [gamerTag, setGamerTag] = useState(initialGamerTag);
  const [displayName, setDisplayName] = useState(initialName);
  const [primaryTitle, setPrimaryTitle] = useState(initialTitle);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatar);
  const [selectedBannerId, setSelectedBannerId] = useState(initialBanner);
  const [activeTab, setActiveTab] = useState<"IDENTITY" | "AVATARS" | "BANNERS">("IDENTITY");
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // 9-Step Cinematic Activation Sequence
  const [activationStage, setActivationStage] = useState<
    "IDLE" | "DIMMING" | "EMBLEM" | "ENERGY_RING" | "CARD_ASSEMBLY" | "ACTIVATED" | "COMPLETE"
  >("IDLE");

  useEffect(() => {
    if (initialGamerTag) setGamerTag(initialGamerTag);
    if (initialName) setDisplayName(initialName);
    if (initialTitle) setPrimaryTitle(initialTitle);
    if (initialBanner) setSelectedBannerId(initialBanner);
    if (initialAvatar) setSelectedAvatarId(initialAvatar);
  }, [initialGamerTag, initialName, initialTitle, initialBanner, initialAvatar]);

  const activeAvatar =
    GOD_LEVEL_AVATARS.find((a) => a.id === selectedAvatarId) || GOD_LEVEL_AVATARS[0];
  const activeBanner =
    GOD_LEVEL_BANNERS.find((b) => b.id === selectedBannerId) || GOD_LEVEL_BANNERS[0];

  const handleSaveAndActivate = async () => {
    const cleanTag = gamerTag.replace(/^@/, "").trim();
    const validation = validateDragonIdHandle(cleanTag);
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid Dragon ID format");
      return;
    }

    setValidationError(null);
    setSaving(true);
    soundFx.playClick();

    try {
      const payload = {
        step: "DRAGON_ID_COMPLETE",
        name: displayName.trim() || cleanTag,
        displayName: displayName.trim() || cleanTag,
        gamerTag: cleanTag,
        primaryTitle: primaryTitle || "Dragon Operative",
        bannerTheme: selectedBannerId,
        avatar: activeAvatar.imageSrc,
        image: activeAvatar.imageSrc,
      };

      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize Dragon ID.");
      }

      // Step 1: DIMMING & EMBLEM
      setActivationStage("DIMMING");
      soundFx.playCinematicSubDrop();

      setTimeout(() => {
        setActivationStage("EMBLEM");
        soundFx.playLightningSpark();
      }, 350);

      // Step 2: ENERGY_RING
      setTimeout(() => {
        setActivationStage("ENERGY_RING");
        soundFx.playSlideWhoosh();
      }, 750);

      // Step 3: CARD_ASSEMBLY
      setTimeout(() => {
        setActivationStage("CARD_ASSEMBLY");
        soundFx.playForgeComplete();
      }, 1250);

      // Step 4: ACTIVATED
      setTimeout(() => {
        setActivationStage("ACTIVATED");
      }, 1750);

      // Step 5: COMPLETE & Enter Dashboard
      setTimeout(() => {
        setActivationStage("COMPLETE");
        if (onSaved) onSaved(data.metadata || data.user);
        onClose();
      }, 2400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving Dragon ID";
      setValidationError(msg);
      setSaving(false);
      setActivationStage("IDLE");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] flex items-center justify-center bg-[#02040A]/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto select-none font-sans"
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 9-STAGE CINEMATIC ACTIVATION SEQUENCE OVERLAY                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {activationStage !== "IDLE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-[#02040A] text-white p-6 space-y-6 overflow-hidden"
            >
              {/* Converging Neon Grid Aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.25)_0%,rgba(124,60,255,0.15)_40%,#02040A_80%)] pointer-events-none" />

              {/* Stage 1-2: Emblem Glow */}
              {(activationStage === "DIMMING" || activationStage === "EMBLEM") && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 rounded-full bg-[#03091D]/90 border-2 border-cyan-400 shadow-[0_0_80px_#00E5FF] relative z-10"
                >
                  <DragonLogoIcon size="xl" className="w-28 h-28 drop-shadow-[0_0_35px_#00E5FF]" />
                </motion.div>
              )}

              {/* Stage 3: Rotating Energy Ring */}
              {activationStage === "ENERGY_RING" && (
                <motion.div
                  initial={{ rotate: -180, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1.1, opacity: 1 }}
                  exit={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative p-12 rounded-full border-4 border-dashed border-cyan-400 shadow-[0_0_100px_#00E5FF] z-10 flex items-center justify-center"
                >
                  <DragonLogoIcon size="xl" className="w-24 h-24 text-cyan-300" />
                </motion.div>
              )}

              {/* Stage 4-5: Card Assembly & "DRAGON ID ACTIVATED" */}
              {(activationStage === "CARD_ASSEMBLY" || activationStage === "ACTIVATED") && (
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5 text-center relative z-10 max-w-md w-full"
                >
                  <div
                    className={`w-full rounded-3xl p-6 border-2 border-cyan-400 shadow-[0_0_60px_rgba(0,229,255,0.7)] ${activeBanner.bgClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-2xl shrink-0">
                        <Image src={activeAvatar.imageSrc} alt={activeAvatar.name} fill className="object-cover" />
                      </div>
                      <div className="text-left space-y-1 overflow-hidden">
                        <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                          ✦ {activeBanner.tag}
                        </div>
                        <div className="text-xl font-black uppercase text-white font-heading truncate">
                          {displayName || "Dragon Slayer"}
                        </div>
                        <div className="text-xs font-mono font-bold text-cyan-200 truncate">
                          @{gamerTag.replace(/^@/, "")}
                        </div>
                        <div className="text-[11px] text-amber-300 font-mono font-bold">
                          {primaryTitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400 text-xs font-mono font-black text-cyan-300 tracking-widest uppercase shadow-[0_0_30px_#00E5FF]"
                  >
                    <CheckCircle2 className="size-4 text-cyan-400" />
                    <span>DRAGON ID ACTIVATED</span>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Multi-Neon Backdrop Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[#FF2BD6]/10 rounded-full blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#03091D]/95 border-2 border-cyan-500/40 p-6 sm:p-10 space-y-8 shadow-[0_0_60px_rgba(0,229,255,0.25)] overflow-hidden"
        >
          {/* Top Multi-Neon Line */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6]"
          />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/40">
                <Crown className="size-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
                  DRAGON ID FORGE
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Configure your universal gaming identity, callsign, and combat banner.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Validation Feedback */}
          {validationError && (
            <div className="rounded-xl bg-red-500/15 border border-red-500/40 p-3 text-xs text-red-300 flex items-center gap-2 font-mono">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* CENTER 3D DRAGON IDENTITY CARD (HERO PREVIEW)                       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex justify-center">
            <div
              className={`w-full max-w-md rounded-2xl p-6 relative overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(0,229,255,0.35)] transition-all duration-300 ${activeBanner.bgClass}`}
            >
              {/* Card Holographic Watermark */}
              <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
                <DragonLogoIcon size="lg" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* 3D Avatar Frame with Neon Ring */}
                <div
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 ${activeAvatar.borderClass} shadow-[0_0_20px_rgba(0,229,255,0.5)]`}
                >
                  <Image
                    src={activeAvatar.imageSrc}
                    alt={activeAvatar.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Identity Text */}
                <div className="space-y-1 overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    <Sparkles className="size-3 text-cyan-400" />
                    <span>{activeBanner.tag}</span>
                  </div>

                  <h3 className="text-lg font-black uppercase text-white font-heading truncate">
                    {displayName || "Dragon Operative"}
                  </h3>

                  <p className="text-xs font-mono text-cyan-300 font-bold truncate">
                    @{gamerTag.replace(/^@/, "") || "operative"}
                  </p>

                  <p className="text-[11px] font-mono text-amber-300 font-bold truncate">
                    {primaryTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (IDENTITY / AVATARS / BANNERS) */}
          <div className="flex items-center justify-center gap-2 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab("IDENTITY");
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === "IDENTITY"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Identity & Title
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("AVATARS");
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === "AVATARS"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. 8 Avatars
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("BANNERS");
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === "BANNERS"
                  ? "bg-pink-500/20 text-pink-300 border border-pink-400/50 shadow-[0_0_15px_rgba(255,43,214,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3. 7 Combat Banners
            </button>
          </div>

          {/* Tab 1: Real Form Input Fields */}
          {activeTab === "IDENTITY" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Dragon ID / Callsign
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={gamerTag.replace(/^@/, "")}
                    onChange={(e) => setGamerTag(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                    placeholder="operative"
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-8 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.4)] font-mono transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  3–20 alphanumeric chars.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dragon Slayer"
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-11 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.4)] font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Player Title
                </label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-amber-400" />
                  <select
                    value={primaryTitle}
                    onChange={(e) => setPrimaryTitle(e.target.value)}
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-11 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.4)] font-mono transition-all cursor-pointer"
                  >
                    {AVAILABLE_TITLES.map((title) => (
                      <option key={title} value={title} className="bg-[#02050E] text-white">
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 8 Mythic Avatars */}
          {activeTab === "AVATARS" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {GOD_LEVEL_AVATARS.map((av) => {
                const isSelected = av.id === selectedAvatarId;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarId(av.id);
                      soundFx.playClick();
                    }}
                    className={`relative p-2.5 rounded-2xl bg-[#02050E] border transition-all text-left group cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-105"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <Image src={av.imageSrc} alt={av.name} fill className="object-cover" />
                    </div>
                    <div className="text-[10px] font-bold text-white truncate font-mono">{av.name}</div>
                    <div className="text-[9px] text-cyan-400 truncate font-mono">{av.title}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: 7 Battle Banners */}
          {activeTab === "BANNERS" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {GOD_LEVEL_BANNERS.map((b) => {
                const isSelected = b.id === selectedBannerId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBannerId(b.id);
                      soundFx.playClick();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${b.bgClass} ${
                      isSelected
                        ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-[1.02]"
                        : "border-white/15 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-white font-heading">{b.name}</span>
                      <span className="text-[9px] font-mono font-bold text-cyan-200 px-2 py-0.5 rounded bg-black/60">
                        {b.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-sans mt-0.5">{b.subtitle}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveAndActivate}
              disabled={saving}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#1685FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black uppercase tracking-widest shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{saving ? "FORGING IDENTITY..." : "INITIALIZE & ACTIVATE DRAGON ID →"}</span>
              <ArrowRight className="size-4 text-[#020617]" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
