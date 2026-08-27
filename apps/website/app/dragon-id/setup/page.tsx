"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
  Cpu
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
          if (data.onboarding?.hasCompletedDragonId) {
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
        }
      } catch (err) {
        console.warn("Initial onboarding load warning:", err);
      }
    }
    loadInitial();
  }, [router]);

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
    setAvailabilityReason("");

    try {
      const res = await fetch(`/api/user/dragon-id/check?handle=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.available) {
        setAvailabilityState("AVAILABLE");
        setAvailabilityReason("Dragon ID is available!");
      } else {
        setAvailabilityState("TAKEN");
        setAvailabilityReason(data.reason || "Dragon ID is taken");
      }
    } catch {
      setAvailabilityState("INVALID");
      setAvailabilityReason("Error validating handle");
    }
  }, []);

  const handleHandleChange = (val: string) => {
    const sanitized = val.replace(/[^a-zA-Z0-9_-]/g, "");
    setGamerTag(sanitized);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      checkHandleAvailability(sanitized);
    }, 400);
  };

  const activeAvatar =
    GOD_LEVEL_AVATARS.find((a) => a.id === selectedAvatarId) || GOD_LEVEL_AVATARS[0];
  const activeBanner =
    GOD_LEVEL_BANNERS.find((b) => b.id === selectedBannerId) || GOD_LEVEL_BANNERS[0];

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
      }, 1750);

      setTimeout(() => {
        setActivationStage("COMPLETE");
        window.location.href = "/dashboard";
      }, 2400);
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
        {activationStage !== "IDLE" && (
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
                    <span>DRAGON ID FORGED</span>
                  </motion.div>
                  <p className="text-xs font-mono text-slate-300 tracking-widest uppercase block">
                    ACCESS GRANTED • ENTERING COMMAND CENTER...
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
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
              Create the identity that represents you across Dragon Gaming Studios.
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
          MANDATORY STEP 2 OF 2
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-8 space-y-8">
        {/* Error Notification */}
        {saveError && (
          <div className="rounded-2xl bg-red-500/20 border border-red-500/40 p-4 text-xs text-red-200 flex items-center gap-3 font-mono">
            <AlertCircle className="size-5 text-red-400 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* LIVE 3D DRAGON ID CARD (PREVIEW)                                  */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(0,229,255,0.35)] relative overflow-hidden transition-all duration-300 ${activeBanner.bgClass}`}
          >
            {/* Watermark Emblem */}
            <div className="absolute right-4 top-4 opacity-15 pointer-events-none">
              <DragonLogoIcon size="xl" className="w-36 h-36 text-white" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-200">
                DRAGON GAMING STUDIOS
              </div>

              <div className="flex items-center gap-5">
                {/* Avatar with glowing ring */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 ${activeAvatar.borderClass} shadow-[0_0_25px_rgba(0,229,255,0.6)]`}
                >
                  <Image src={activeAvatar.imageSrc} alt={activeAvatar.name} fill className="object-cover" />
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    <Sparkles className="size-3 text-cyan-400" />
                    <span>{activeBanner.tag}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading truncate">
                    {displayName || "Dragon Slayer"}
                  </h3>

                  <p className="text-xs sm:text-sm font-mono text-cyan-200 font-bold truncate">
                    @{gamerTag.replace(/^@/, "") || "operative"}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-300">
                    <Award className="size-3.5" />
                    <span>{primaryTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Configuration Tabs */}
        <div className="rounded-3xl bg-[#03091D]/90 border-2 border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
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
              1. Identity & Callsign
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
              2. 8 Mythic Avatars
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

          {/* Tab 1: Identity Inputs */}
          {activeTab === "IDENTITY" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      onChange={(e) => handleHandleChange(e.target.value)}
                      placeholder="operative"
                      className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-8 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.4)] font-mono transition-all"
                    />
                  </div>

                  {/* Live Availability Status */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono">
                    {availabilityState === "CHECKING" && (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Loader2 className="size-3 animate-spin" />
                        <span>CHECKING AVAILABILITY...</span>
                      </span>
                    )}
                    {availabilityState === "AVAILABLE" && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-emerald-400" />
                        <span>AVAILABLE</span>
                      </span>
                    )}
                    {availabilityState === "TAKEN" && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="size-3 text-rose-400" />
                        <span>TAKEN</span>
                      </span>
                    )}
                    {availabilityState === "INVALID" && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="size-3 text-amber-400" />
                        <span>{availabilityReason}</span>
                      </span>
                    )}
                    {availabilityState === "IDLE" && (
                      <span className="text-slate-500">3–20 alphanumeric chars.</span>
                    )}
                  </div>
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] font-mono text-cyan-400">Step 1 of 3: Identity established</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("AVATARS");
                    soundFx.playClick();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>NEXT: CHOOSE AVATAR →</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Avatars */}
          {activeTab === "AVATARS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
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
                      className={`relative p-2.5 rounded-2xl bg-[#02050E] border transition-all text-left cursor-pointer ${
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("IDENTITY");
                    soundFx.playClick();
                  }}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("BANNERS");
                    soundFx.playClick();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/50 text-pink-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>NEXT: CHOOSE BANNER →</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Banners */}
          {activeTab === "BANNERS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
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
                      className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${b.bgClass} ${
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

              <div className="flex items-center justify-start pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("AVATARS");
                    soundFx.playClick();
                  }}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  ← BACK TO AVATARS
                </button>
              </div>
            </div>
          )}

          {/* Save Error Alert */}
          {saveError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-400 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Master Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-xs font-mono text-slate-400">
              Identity ready for permanent registration on Dragon Core.
            </div>

            <button
              type="button"
              onClick={handleForge}
              disabled={saving}
              className="w-full sm:w-auto min-h-[52px] px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#1685FF] to-[#7C3CFF] text-[#020617] font-black text-xs sm:text-sm font-mono uppercase tracking-widest shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{saving ? "FORGING IDENTITY IN POSTGRESQL..." : "FORGE MY DRAGON ID →"}</span>
              <ArrowRight className="size-4 text-[#020617]" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 text-center text-[10px] font-mono text-slate-500">
        DRAGON GAMING STUDIOS • UNIVERSAL PLAYER IDENTITY SYSTEM
      </footer>
    </div>
  );
}
