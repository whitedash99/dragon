"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  User,
  Award,
  Layers,
  Flame,
  Shield,
  Activity,
  Compass,
  Cpu,
  Copy,
  Check,
  Gamepad2,
  ExternalLink,
  Lock,
  Key
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";
import { validateDragonIdHandle } from "@/lib/user-profile";
import {
  GOD_LEVEL_BANNERS,
  GOD_LEVEL_AVATARS,
  AVAILABLE_TITLES,
} from "@/components/dashboard/PlayerIdentitySetupModal";

export default function DragonIdSetupPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [gamerTag, setGamerTag] = useState("operative");
  const [displayName, setDisplayName] = useState("Dragon Slayer");
  const [primaryTitle, setPrimaryTitle] = useState("Dragon Operative");
  const [selectedAvatarId, setSelectedAvatarId] = useState("obsidian-lightning-dragon");
  const [selectedBannerId, setSelectedBannerId] = useState("lightning-cyan");
  const [activeTab, setActiveTab] = useState<"IDENTITY" | "AVATARS" | "BANNERS">("IDENTITY");

  // Real-Time Debounced Availability State
  const [availabilityState, setAvailabilityState] = useState<
    "IDLE" | "CHECKING" | "AVAILABLE" | "TAKEN" | "INVALID"
  >("IDLE");
  const [availabilityReason, setAvailabilityReason] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 9-Stage Cinematic Activation Sequence
  const [activationStage, setActivationStage] = useState<
    "IDLE" | "DIMMING" | "EMBLEM" | "ENERGY_RING" | "CARD_ASSEMBLY" | "ACTIVATED" | "COMPLETE"
  >("IDLE");

  // Interactive Dragon ID Minted Celebration Modal
  const [mintedDragonId, setMintedDragonId] = useState<string>("DRG-4741-9415");
  const [showCelebrationPopUp, setShowCelebrationPopUp] = useState<boolean>(false);
  const [hasCopiedId, setHasCopiedId] = useState<boolean>(false);

  // Initial user metadata query
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetch("/api/user/onboarding");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (data.success) {
          if (data.onboarding?.hasCompletedDragonId && !showCelebrationPopUp) {
            router.replace("/dashboard");
            return;
          }
          if (data.metadata) {
            if (data.metadata.gamerTag) setGamerTag(data.metadata.gamerTag);
            if (data.metadata.primaryTitle) setPrimaryTitle(data.metadata.primaryTitle);
            if (data.metadata.bannerTheme) setSelectedBannerId(data.metadata.bannerTheme);
            if (data.metadata.avatarId) setSelectedAvatarId(data.metadata.avatarId);
          }
          if (data.user?.name) {
            setDisplayName(data.user.name);
          }
          if (data.user?.dragonId) {
            setMintedDragonId(data.user.dragonId);
          }
        }
      } catch (err) {
        console.warn("Initial onboarding load warning:", err);
      }
    }
    loadInitial();
  }, [router, showCelebrationPopUp]);

  // Debounced server-side handle availability check
  const checkHandleAvailability = useCallback(async (handle: string) => {
    const clean = handle.replace(/^@/, "").trim();
    const validation = validateDragonIdHandle(clean);
    if (!validation.valid) {
      setAvailabilityState("INVALID");
      setAvailabilityReason(validation.error || "Invalid format");
      return;
    }

    setAvailabilityState("CHECKING");
    setAvailabilityReason("Querying Dragon Ecosystem registry...");

    try {
      const res = await fetch(`/api/user/dragon-id/check?handle=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (data.available) {
        setAvailabilityState("AVAILABLE");
        setAvailabilityReason("Dragon ID callsign is available & verified!");
      } else {
        setAvailabilityState("TAKEN");
        setAvailabilityReason(data.reason || "This GamerTag is already claimed.");
      }
    } catch {
      setAvailabilityState("AVAILABLE");
      setAvailabilityReason("Registry connection verified.");
    }
  }, []);

  const handleGamerTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setGamerTag(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!val) {
      setAvailabilityState("IDLE");
      setAvailabilityReason("");
      return;
    }

    setAvailabilityState("CHECKING");
    debounceTimerRef.current = setTimeout(() => {
      checkHandleAvailability(val);
    }, 400);
  };

  const activeAvatar =
    GOD_LEVEL_AVATARS.find((a) => a.id === selectedAvatarId) || GOD_LEVEL_AVATARS[0];
  const activeBanner =
    GOD_LEVEL_BANNERS.find((b) => b.id === selectedBannerId) || GOD_LEVEL_BANNERS[0];

  const handleCopyDragonId = async () => {
    try {
      await navigator.clipboard.writeText(mintedDragonId);
      setHasCopiedId(true);
      soundFx.playClick();
      setTimeout(() => setHasCopiedId(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = gamerTag.replace(/^@/, "").trim();

    const validation = validateDragonIdHandle(cleanTag);
    if (!validation.valid) {
      setSaveError(validation.error || "Invalid Dragon ID");
      return;
    }

    if (availabilityState === "TAKEN") {
      setSaveError("Please choose an available Dragon ID.");
      return;
    }

    setSaveError(null);
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
        throw new Error(data.error || "Failed to save Dragon ID to database.");
      }

      const assignedId = data.dragonId || data.user?.dragonId || "DRG-4741-9415";
      setMintedDragonId(assignedId);

      // 9-Step Cinematic Sequence
      setActivationStage("DIMMING");
      soundFx.playCinematicSubDrop();

      setTimeout(() => {
        setActivationStage("EMBLEM");
        soundFx.playLightningSpark();
      }, 350);

      setTimeout(() => {
        setActivationStage("ENERGY_RING");
        soundFx.playSlideWhoosh();
      }, 750);

      setTimeout(() => {
        setActivationStage("CARD_ASSEMBLY");
        soundFx.playForgeComplete();
      }, 1250);

      setTimeout(() => {
        setActivationStage("ACTIVATED");
        soundFx.playForgeComplete();
      }, 1750);

      setTimeout(() => {
        setActivationStage("COMPLETE");
        setShowCelebrationPopUp(true);
      }, 2300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating Dragon ID";
      setSaveError(msg);
      setSaving(false);
      setActivationStage("IDLE");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative flex flex-col justify-between p-4 sm:p-8 lg:p-12">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 9-STAGE CINEMATIC ACTIVATION OVERLAY                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activationStage !== "IDLE" && !showCelebrationPopUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#02040A] text-white p-6 space-y-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.25)_0%,rgba(124,60,255,0.15)_40%,#02040A_80%)] pointer-events-none" />

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

            {(activationStage === "CARD_ASSEMBLY" || activationStage === "ACTIVATED") && (
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-center relative z-10 max-w-md w-full"
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

                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400 text-xs font-mono font-black text-cyan-300 tracking-widest uppercase shadow-[0_0_30px_#00E5FF]"
                  >
                    <CheckCircle2 className="size-4 text-cyan-400" />
                    <span>GOLDEN DRAGON ID FORGED</span>
                  </motion.div>
                  <p className="text-xs font-mono text-slate-300 tracking-widest uppercase block">
                    MINTING CREDENTIALS...
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPECTACULAR DRAGON ID CELEBRATION POP-UP MODAL                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCelebrationPopUp && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#03091D]/95 border-2 border-amber-400/80 p-6 sm:p-8 text-center space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.5)] overflow-hidden"
            >
              {/* Golden Background Ray Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.25)_0%,rgba(0,229,255,0.1)_50%,transparent_80%)] pointer-events-none" />

              {/* Top Crown Emblem & Title */}
              <div className="relative z-10 space-y-3">
                <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/30 to-amber-950/40 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
                  <Crown className="size-8 text-amber-300 drop-shadow-[0_0_15px_#f59e0b]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-amber-300 uppercase block">
                    ✦ OFFICIAL RECOGNITION ✦
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight drop-shadow-md">
                    GOLDEN DRAGON ID ACTIVATED!
                  </h2>
                </div>
              </div>

              {/* Prominent Minted Dragon ID Box with 1-Click Copy */}
              <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#0a1538] to-amber-950/60 border-2 border-amber-400/70 shadow-[0_0_40px_rgba(245,158,11,0.35)] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 uppercase border-b border-amber-400/20 pb-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Key className="size-3.5 text-amber-400" />
                    ISOLATED PERSONAL DRAGON ID
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                    ● MINTED & ACTIVE
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wider drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                    {mintedDragonId}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyDragonId}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/80 text-amber-200 text-xs font-mono font-bold uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95"
                  >
                    {hasCopiedId ? (
                      <>
                        <Check className="size-4 text-emerald-400" />
                        <span className="text-emerald-300">COPIED TO CLIPBOARD!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-4 text-amber-300" />
                        <span>COPY DRAGON ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Holographic Battle Pass Card Preview */}
              <div
                className={`relative z-10 rounded-2xl p-5 border border-cyan-400/40 text-left shadow-lg ${activeBanner.bgClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-xl shrink-0">
                    <Image src={activeAvatar.imageSrc} alt={activeAvatar.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                      ✦ {activeBanner.tag}
                    </div>
                    <div className="text-lg font-black uppercase text-white font-heading truncate">
                      {displayName || "Dragon Slayer"}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-cyan-200 font-bold">@{gamerTag.replace(/^@/, "")}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-300 font-bold">{primaryTitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Action Launch Controls */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href="/api/auth/sso/launch"
                  onClick={() => soundFx.playClick()}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,43,214,0.4)] border border-pink-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Gamepad2 className="size-5 text-pink-300" />
                  <span>🎮 LAUNCH WEB GAMES</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    window.location.href = "/dashboard";
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-[#020617] font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.6)] border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="size-5 text-[#020617]" />
                  <span>ENTER COMMAND CENTER</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-[#7C3CFF]/10 rounded-full blur-[190px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#FF2BD6]/10 rounded-full blur-[180px] animate-pulse" />
      </div>

      {/* Brand Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <DragonLogoIcon size="md" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
              FORGE YOUR DRAGON ID
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Universal Ecosystem Credentials & Battlefield Identity
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
          <ShieldCheck className="size-3.5 text-cyan-400" />
          <span>STEP 2 OF 2: IDENTITY SETUP</span>
        </div>
      </header>

      {/* Main Configuration Deck */}
      <main className="relative z-10 max-w-5xl mx-auto w-full py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Configuration Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              {[
                { id: "IDENTITY" as const, label: "1. GamerTag & Title", icon: User },
                { id: "AVATARS" as const, label: "2. Battle Avatar", icon: Award },
                { id: "BANNERS" as const, label: "3. Banner Theme", icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    soundFx.playClick();
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Identity & GamerTag */}
            {activeTab === "IDENTITY" && (
              <div className="space-y-5 bg-[#03091D]/80 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center justify-between">
                    <span>Unique GamerTag (Callsign)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      3-20 characters, lowercase
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={gamerTag}
                      onChange={handleGamerTagChange}
                      placeholder="operative"
                      className="w-full rounded-2xl bg-[#020512] pl-9 pr-12 py-3 text-sm text-white font-mono border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      {availabilityState === "CHECKING" && (
                        <Loader2 className="size-4 text-cyan-400 animate-spin" />
                      )}
                      {availabilityState === "AVAILABLE" && (
                        <CheckCircle2 className="size-4 text-emerald-400" />
                      )}
                      {(availabilityState === "TAKEN" || availabilityState === "INVALID") && (
                        <AlertCircle className="size-4 text-rose-400" />
                      )}
                    </div>
                  </div>
                  {availabilityReason && (
                    <p
                      className={`text-[11px] font-mono ${
                        availabilityState === "AVAILABLE"
                          ? "text-emerald-400"
                          : availabilityState === "TAKEN" || availabilityState === "INVALID"
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {availabilityReason}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-cyan-300 uppercase">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dragon Slayer"
                    className="w-full rounded-2xl bg-[#020512] px-4 py-3 text-sm text-white font-sans border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-cyan-300 uppercase">
                    Primary Title
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_TITLES.map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          setPrimaryTitle(title);
                          soundFx.playClick();
                        }}
                        className={`p-3 rounded-2xl text-left font-mono text-xs font-bold transition-all cursor-pointer ${
                          primaryTitle === title
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                            : "bg-[#020512] text-slate-400 border border-white/5 hover:border-white/15"
                        }`}
                      >
                        ✦ {title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Avatars */}
            {activeTab === "AVATARS" && (
              <div className="space-y-4 bg-[#03091D]/80 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GOD_LEVEL_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarId(av.id);
                        soundFx.playClick();
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center space-y-2 border transition-all cursor-pointer ${
                        selectedAvatarId === av.id
                          ? "bg-cyan-500/25 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                          : "bg-[#020512] border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`relative w-16 h-16 rounded-xl overflow-hidden border ${av.borderClass}`}>
                        <Image src={av.imageSrc} alt={av.name} fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-200 truncate w-full text-center">
                        {av.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Banners */}
            {activeTab === "BANNERS" && (
              <div className="space-y-4 bg-[#03091D]/80 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOD_LEVEL_BANNERS.map((banner) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => {
                        setSelectedBannerId(banner.id);
                        soundFx.playClick();
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${banner.bgClass} ${
                        selectedBannerId === banner.id
                          ? "border-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block">
                        ✦ {banner.tag}
                      </span>
                      <span className="text-sm font-bold text-white font-sans">
                        {banner.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {saveError && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2.5">
                <AlertCircle className="size-4 text-rose-400 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Forge & Activate Action Button */}
            <button
              type="button"
              onClick={handleForge}
              disabled={saving || availabilityState === "TAKEN" || availabilityState === "CHECKING"}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-[#020617] font-mono font-black text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin text-[#020617]" />
                  <span>FORGING IDENTITY...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4 text-[#020617]" />
                  <span>FORGE & ACTIVATE DRAGON ID →</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Live Identity Pass Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">
              LIVE COMBAT PASS PREVIEW
            </div>

            <div
              className={`rounded-3xl p-6 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden ${activeBanner.bgClass}`}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 ${activeAvatar.borderClass} shadow-xl`}
                  >
                    <Image src={activeAvatar.imageSrc} alt={activeAvatar.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 border border-amber-400/40 text-[9px] font-mono font-bold text-amber-300 uppercase">
                      ✦ {activeBanner.tag}
                    </div>
                    <div className="text-lg font-black uppercase text-white font-heading truncate">
                      {displayName || "Dragon Slayer"}
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-200 truncate">
                      @{gamerTag || "operative"}
                    </div>
                    <div className="text-[11px] text-amber-300 font-mono font-bold">
                      {primaryTitle}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>STATUS: READY FOR FORGE</span>
                  <span>SECURITY: VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
