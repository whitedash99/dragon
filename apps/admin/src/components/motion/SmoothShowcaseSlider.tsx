"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Gamepad2, Play, Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  gradient: string;
  glowColor: string;
  stats: { label: string; value: string }[];
  href: string;
}

const SHOWCASE_SLIDES: SlideItem[] = [
  {
    id: "slide-embers",
    title: "Dragon Slayer 3D: Realm of Fire",
    subtitle: "3D Open-World Fantasy RPG powered by Dragon 3D Engine",
    category: "3D GAME SHOWCASE",
    badge: "FEATURED GAME",
    gradient: "from-amber-600 via-pink-600 to-purple-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    stats: [
      { label: "Status", value: "In Production" },
      { label: "Target Release", value: "Q4 2027" },
      { label: "Engine", value: "Dragon Engine v5.4" },
    ],
    href: "/games",
  },
  {
    id: "slide-neondrift",
    title: "Neon Drift: 2088",
    subtitle: "High-Octane Cyberpunk Street Racing Simulator",
    category: "CYBERPUNK SHOWCASE",
    badge: "LIVE TRAILER",
    gradient: "from-cyan-500 via-purple-600 to-pink-500",
    glowColor: "rgba(6, 182, 212, 0.25)",
    stats: [
      { label: "Status", value: "Beta Testing" },
      { label: "Active Players", value: "48,290" },
      { label: "Platforms", value: "PC, PS5, Xbox Series X" },
    ],
    href: "/games",
  },
  {
    id: "slide-[#04b2c8a8]",
    title: "Blacksite Zero",
    subtitle: "Tactical Stealth Co-Op Operative Simulator",
    category: "TACTICAL SHOWCASE",
    badge: "NEW UPDATE",
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    glowColor: "rgba(16, 185, 129, 0.25)",
    stats: [
      { label: "Status", value: "v2.4 Patch Live" },
      { label: "Uptime", value: "99.98%" },
      { label: "Servers", value: "Global Mesh" },
    ],
    href: "/games",
  },
];

export function SmoothShowcaseSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
  };

  const current = SHOWCASE_SLIDES[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
      {/* Top Header & Navigation Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
            <Gamepad2 className="size-5" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {current.category}
            </h2>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Dragon Studios Showcase</span>
              <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={slidePrev}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-xs"
            title="Previous Slide"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={slideNext}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-xs"
            title="Next Slide"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Animated Slide Content */}
      <div className="relative min-h-[160px] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <Flame className="size-3 text-pink-400" />
                  {current.badge}
                </span>

                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className={cn("bg-clip-text text-transparent bg-gradient-to-r", current.gradient)}>
                    {current.title}
                  </span>
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {current.subtitle}
                </p>
              </div>

              <Link
                href={current.href}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:scale-105 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25 shrink-0"
              >
                <span>OPEN STUDIO CMS</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {current.stats.map((st) => (
                <div key={st.label} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">{st.label}</div>
                  <div className="text-xs font-bold text-slate-200 font-mono">{st.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {SHOWCASE_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx === currentIndex
                ? "w-8 bg-gradient-to-r from-pink-500 to-cyan-400"
                : "w-2 bg-slate-800 hover:bg-slate-700"
            )}
          />
        ))}
      </div>
    </div>
  );
}
