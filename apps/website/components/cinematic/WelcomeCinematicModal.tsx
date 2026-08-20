"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  X,
  Flame,
  Zap,
  Compass,
  Crown,
  Sparkles
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";

interface WelcomeCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

const FLASHBACK_SLIDES = [
  {
    id: "embers-of-valyria",
    title: "EMBERS OF VALYRIA",
    subtitle: "Open-World Dark Fantasy Action RPG",
    statusBadge: "✦ THIS IS OUR NEWEST GAME",
    flashbackHeading: "THIS IS OUR NEWEST REVOLUTION",
    tagline: "Carve your legend in ancient dragonfire. Unscripted world events & fluid physical melee combat.",
    palette: "from-blue-900/90 via-[#0a1838]/80 to-[#02040A]/95",
    glow: "rgba(0, 140, 255, 0.7)",
    accentColor: "#00d4ff",
    icon: Flame,
    releaseInfo: "3D Action RPG • PC (.exe) & Android (.apk)",
  },
  {
    id: "neon-drift-overdrive",
    title: "NEON DRIFT: OVERDRIVE",
    subtitle: "Cyberpunk Anti-Gravity Tactical Racing",
    statusBadge: "✦ HIGH-OCTANE CYBER ACTION",
    flashbackHeading: "BREAK THE SOUND BARRIER AT MACH 5",
    tagline: "Defy gravity on vertical highways of Neo-Tokyo with plasma weapons & synthwave reactive audio.",
    palette: "from-cyan-900/90 via-[#051630]/80 to-[#02040A]/95",
    glow: "rgba(0, 240, 255, 0.7)",
    accentColor: "#00f0ff",
    icon: Zap,
    releaseInfo: "Early Access Live • DLSS 3.5 Ready",
  },
  {
    id: "aetheria-void",
    title: "AETHERIA: CHRONICLES OF THE VOID",
    subtitle: "Deep Space Sci-Fi Exploration & Combat",
    statusBadge: "✦ THIS IS YOUR PRE-ORDERED GAME",
    flashbackHeading: "THIS IS YOUR PRE-ORDERED EXPEDITION",
    tagline: "Traverse forbidden rifts, command starfleets, and conquer planetary frontiers in the deep void.",
    palette: "from-indigo-950/90 via-[#080d24]/80 to-[#02040A]/95",
    glow: "rgba(99, 102, 241, 0.7)",
    accentColor: "#818cf8",
    icon: Compass,
    releaseInfo: "Upcoming Masterpiece • Pre-Orders Unlocked",
  },
];

export function WelcomeCinematicModal({
  isOpen,
  onClose,
  userName = "Dragon Warrior",
  userEmail = "",
}: WelcomeCinematicModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [stage, setStage] = useState<"INTRO_3D" | "SLIDESHOW">("INTRO_3D");
  const [flicker, setFlicker] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasFinishedRef = useRef(false);

  const firstName = (userName || userEmail || "Commander").split(" ")[0].split("@")[0];

  // Stage 1: 3D Emblem Reveal & Welcome Title for 2.8s
  useEffect(() => {
    if (!isOpen) {
      hasFinishedRef.current = false;
      return;
    }
    setStage("INTRO_3D");
    setSlideIndex(0);
    hasFinishedRef.current = false;

    // Cinematic Audio Sub-bass and Lightning Strike on Video Open
    soundFx.playCinematicSubDrop();
    soundFx.playLightningSpark();

    const timer = setTimeout(() => {
      soundFx.playSlideWhoosh();
      setStage("SLIDESHOW");
    }, 2800);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Stage 2: Play EXACTLY ONCE (Slide 0 -> 1 -> 2 -> Teleport to Dashboard)
  useEffect(() => {
    if (!isOpen || stage !== "SLIDESHOW" || hasFinishedRef.current) return;

    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => {
        if (prevIndex >= FLASHBACK_SLIDES.length - 1) {
          clearInterval(interval);
          hasFinishedRef.current = true;
          // Finish and teleport automatically to dashboard
          setTimeout(() => {
            soundFx.playForgeComplete();
            onClose();
          }, 2600);
          return prevIndex;
        }

        soundFx.playSlideWhoosh();
        setFlicker(true);
        setTimeout(() => setFlicker(false), 200);
        return prevIndex + 1;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isOpen, stage, onClose]);

  // 3D Dark Blue & Deep Black Particle Warp Field Engine
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars: { x: number; y: number; z: number; o: number }[] = [];
    const numStars = 300;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        o: Math.random() * 0.9 + 0.1,
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(2, 4, 10, 0.28)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 6.5;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 280 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.7, (1 - star.z / width) * 3.8);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${star.o * (1 - star.z / width)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSlide = FLASHBACK_SLIDES[slideIndex] || FLASHBACK_SLIDES[0];
  const IconComponent = currentSlide.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-[#02040A] overflow-hidden font-sans select-none"
      >
        {/* 3D Particle Space Warp */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Volumetric Dark Blue & Black Cosmic Atmosphere */}
        <div
          className="absolute inset-0 opacity-60 transition-all duration-700 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at 50% 35%, ${currentSlide.glow} 0%, rgba(3, 10, 28, 0.85) 45%, rgba(2, 4, 10, 0.98) 75%)`,
          }}
        />

        {/* Laser Light Sweeps */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[180px] pointer-events-none z-0" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[180px] pointer-events-none z-0" />

        {/* Holographic Scanline & Flickering Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] transition-opacity duration-100 ${
            flicker ? "opacity-90" : "opacity-35"
          }`}
        />

        {/* Top Control Bar with Official Dragon Crest Logo */}
        <div className="absolute top-6 inset-x-6 sm:inset-x-12 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <DragonLogoIcon size="md" className="shadow-[0_0_25px_rgba(0,240,255,0.5)] border-cyan-400/60" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                DRAGON STUDIOS CINEMATICS
              </span>
              <span className="text-xs text-white font-bold tracking-tight">
                3D & 2D Interactive Showcase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#060D20]/80 hover:bg-blue-900/40 text-white text-xs font-mono font-bold transition-all cursor-pointer backdrop-blur-md border border-cyan-500/30 flex items-center gap-1.5 shadow-lg shadow-blue-950/50"
            >
              <span>Skip Intro</span>
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: 3D DRAGON CREST & TITLE REVEAL (DARK BLUE & DEEP BLACK)          */}
        {/* ========================================================================= */}
        {stage === "INTRO_3D" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(12px)" }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6 max-w-4xl px-6 relative z-20"
          >
            {/* Center Giant 3D Dragon Logo Reveal */}
            <motion.div
              initial={{ scale: 0.5, rotateY: -30, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="p-3 rounded-3xl bg-gradient-to-b from-[#0e214d] via-[#05112e] to-[#02050f] border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.7)]">
                <DragonLogoIcon size="xl" className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/60 bg-[#05102a]/80 px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.4)]"
            >
              <Crown className="size-4 text-amber-400 animate-pulse" />
              <span>DRAGONID SECURE AUTHENTICATION CONFIRMED</span>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white font-heading drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
                WELCOME TO <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(0,240,255,0.8)]">
                  DRAGON STUDIOS
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
                Welcome back, <span className="text-cyan-300 font-bold">{firstName}</span>! Initializing your player command deck...
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: 3D SLIDESHOW & FLASHBACK GAME SHOWCASE (PLAYS ONCE)              */}
        {/* ========================================================================= */}
        {stage === "SLIDESHOW" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl px-6 relative z-20 space-y-6"
          >
            {/* Slide Progress Indicator Bar */}
            <div className="flex items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                <Sparkles className="size-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>DRAGON STUDIOS GAMES SHOWCASE</span>
              </div>

              {/* Progress Bars */}
              <div className="flex items-center gap-2">
                {FLASHBACK_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === slideIndex
                        ? "w-10 bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                        : idx < slideIndex
                        ? "w-4 bg-emerald-400/80"
                        : "w-4 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main 3D Slideshow Banner Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 60, rotateY: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -60, rotateY: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="rounded-3xl bg-gradient-to-b from-[#05112e]/95 via-[#030a1c]/98 to-[#02040A] border-2 border-cyan-500/40 p-5 sm:p-10 shadow-[0_20px_90px_rgba(0,10,35,0.9)] backdrop-blur-2xl relative overflow-hidden"
              >
                {/* Dynamic Dark Blue Atmosphere Glow */}
                <div
                  className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-70"
                  style={{ background: currentSlide.glow }}
                />

                <div className="relative z-10 space-y-4 sm:space-y-6">
                  {/* Flashback Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/20">
                    <IconComponent className="size-3.5 sm:size-4" style={{ color: currentSlide.accentColor }} />
                    <span>{currentSlide.statusBadge}</span>
                  </div>

                  {/* Title & Flashback Headline */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-[11px] sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest">
                      {currentSlide.subtitle}
                    </h3>
                    <h2 className="text-2xl sm:text-6xl font-black uppercase text-white tracking-tight font-heading drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] break-words">
                      {currentSlide.title}
                    </h2>
                    <p className="text-sm sm:text-xl font-black text-cyan-300 font-heading uppercase pt-0.5 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                      &ldquo;{currentSlide.flashbackHeading}&rdquo;
                    </p>
                    <p className="text-xs sm:text-base text-slate-300 font-sans max-w-2xl pt-1 leading-relaxed">
                      {currentSlide.tagline}
                    </p>
                  </div>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                    <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 sm:size-4 text-emerald-400" />
                      <span>{currentSlide.releaseInfo}</span>
                    </div>
                    <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-cyan-200 text-[10px] sm:text-xs font-mono font-bold">
                      PC (.exe) • Mobile (.apk)
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Teleport CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2">
              <div className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-2">
                <Zap className="size-3.5 sm:size-4 text-cyan-400" />
                <span>Signed in as <strong className="text-white">{userName || userEmail}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  soundFx.playForgeComplete();
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs font-mono uppercase tracking-widest shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SETUP DRAGONID & ENTER DASHBOARD →</span>
                <ArrowRight className="size-4 text-black" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
