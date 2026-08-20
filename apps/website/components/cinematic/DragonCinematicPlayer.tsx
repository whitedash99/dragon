"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Zap,
  Flame,
  Wind
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export type DragonAnimationMode = "soar" | "ice_fire" | "dive_strike";

export function DragonCinematicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animMode, setAnimMode] = useState<DragonAnimationMode>("ice_fire");
  const [isMuted, setIsMuted] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playhead timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeProgress((prev) => (prev >= 100 ? 0 : prev + 1.25));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    try {
      soundFx.playClick();
    } catch {}
  };

  const handleSelectMode = (mode: DragonAnimationMode) => {
    setAnimMode(mode);
    setTimeProgress(0);
    try {
      if (!isMuted) {
        if (mode === "ice_fire") soundFx.playCinematicSubDrop();
        else soundFx.playLightningSpark();
      }
    } catch {}
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-[#02050E] shadow-[0_0_80px_rgba(0,240,255,0.35)] select-none [perspective:1400px]"
    >
      {/* ═══ Top Live Title Bar ═══ */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-[0.2em] text-white flex items-center gap-1.5 drop-shadow-md">
            <span>DRAGON STUDIOS</span>
            <span className="text-cyan-400">•</span>
            <span className="text-cyan-300">3D REALM ENGINE CINEMATIC</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-black uppercase">
            {animMode === "soar" ? "ANIMATION 01: STORM SOAR" : animMode === "ice_fire" ? "ANIMATION 02: ICE-FIRE BLAST" : "ANIMATION 03: 3D DIVE STRIKE"}
          </span>
        </div>
      </div>

      {/* ═══ Main Cinematic Stage ═══ */}
      <div className="relative w-full aspect-video min-h-[380px] sm:min-h-[500px] overflow-hidden flex items-center justify-center">
        {/* Background Atmosphere & Storm Clouds */}
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
            x: isPlaying ? [-10, 10, -10] : 0,
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 size-full"
        >
          <Image
            src="/images/flying_ice_fire_dragon.jpg"
            alt="Real Flying Ice Fire Dragon"
            fill
            priority
            quality={95}
            className="object-cover object-center scale-110 filter brightness-[0.85] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050E] via-transparent to-[#02050E]/60" />
        </motion.div>

        {/* ═══ 3 DISTINCT ANIMATION MODES ═══ */}
        <AnimatePresence mode="wait">
          {/* Mode 1: Aerial Storm Soar */}
          {animMode === "soar" && (
            <motion.div
              key="anim-soar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 size-full pointer-events-none"
            >
              {/* Dragon Wing Flapping Parallax & Height Shift */}
              <motion.div
                animate={
                  isPlaying
                    ? {
                        y: [-12, 14, -12],
                        rotateZ: [-1.5, 1.5, -1.5],
                        scale: [1, 1.03, 1],
                      }
                    : {}
                }
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 size-full"
              >
                {/* Translucent Wing Lightning Flare */}
                <motion.div
                  animate={isPlaying ? { opacity: [0.3, 0.9, 0.4, 0.95, 0.3] } : { opacity: 0.3 }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute top-[18%] left-[22%] size-72 rounded-full bg-cyan-400/30 blur-[70px]"
                />
                <motion.div
                  animate={isPlaying ? { opacity: [0.4, 0.85, 0.3, 0.9, 0.4] } : { opacity: 0.3 }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="absolute top-[15%] right-[20%] size-80 rounded-full bg-blue-500/35 blur-[80px]"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Mode 2: Ice-Fire Breath Blast */}
          {animMode === "ice_fire" && (
            <motion.div
              key="anim-ice-fire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 size-full pointer-events-none"
            >
              {/* Screen Shockwave Shake on Fire Breath */}
              <motion.div
                animate={
                  isPlaying
                    ? {
                        x: [-2, 2, -1, 1, 0],
                        y: [1, -2, 2, -1, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.25, repeat: Infinity }}
                className="absolute inset-0 size-full"
              >
                {/* Expanding Ice Fire Stream Flare */}
                <motion.div
                  animate={
                    isPlaying
                      ? {
                          scale: [1, 1.25, 1.05, 1.3, 1],
                          opacity: [0.75, 1, 0.85, 1, 0.75],
                        }
                      : { opacity: 0.6 }
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[20%] right-[12%] sm:right-[18%] w-80 sm:w-[480px] h-32 sm:h-48 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white blur-[50px] mix-blend-screen"
                />

                {/* Fire Plasma Spark Ring */}
                <motion.div
                  animate={
                    isPlaying
                      ? {
                          scale: [0.8, 1.4, 1.1],
                          opacity: [0.8, 0, 0.6],
                        }
                      : {}
                  }
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute bottom-[18%] right-[15%] size-40 rounded-full border-2 border-cyan-300/80 shadow-[0_0_50px_#00f0ff]"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Mode 3: 3D Perspective Dive & Strike */}
          {animMode === "dive_strike" && (
            <motion.div
              key="anim-dive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 size-full pointer-events-none"
            >
              {/* Swooping Dragon Motion toward Screen */}
              <motion.div
                animate={
                  isPlaying
                    ? {
                        scale: [0.92, 1.08, 0.92],
                        y: [-25, 30, -25],
                        rotateX: [6, -4, 6],
                      }
                    : {}
                }
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 size-full"
              >
                {/* Speed Radial Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,240,255,0.15)_100%)]" />
                <motion.div
                  animate={isPlaying ? { opacity: [0.2, 0.8, 0.2] } : {}}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="absolute inset-0 border-4 border-cyan-400/40 shadow-[inset_0_0_100px_rgba(0,240,255,0.4)]"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Bottom Cinematic Controls Bar ═══ */}
      <div className="relative z-30 p-4 sm:p-6 bg-[#040A18]/95 backdrop-blur-xl border-t border-cyan-500/30 flex flex-col gap-4">
        {/* Playhead Progress Bar */}
        <div className="w-full bg-[#01040D] rounded-full h-1.5 overflow-hidden border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_10px_#00f0ff] transition-all duration-100"
            style={{ width: `${timeProgress}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Play/Pause, Mute & Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="size-11 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black flex items-center justify-center font-black shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? "Pause Video Animation" : "Play Video Animation"}
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setTimeProgress(0);
                try {
                  soundFx.playClick();
                } catch {}
              }}
              className="size-10 rounded-xl bg-[#01040D] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center cursor-pointer"
              title="Restart Scene"
            >
              <RotateCcw className="size-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`size-10 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                isMuted
                  ? "bg-[#01040D] border-red-500/40 text-red-400"
                  : "bg-[#01040D] border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400"
              }`}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>

          {/* Center: 3 Animation Mode Switcher */}
          <div className="flex items-center bg-[#01040D] p-1 rounded-2xl border border-cyan-500/30 gap-1">
            <button
              onClick={() => handleSelectMode("soar")}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                animMode === "soar"
                  ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wind className="size-3.5" />
              <span>1. Storm Soar</span>
            </button>

            <button
              onClick={() => handleSelectMode("ice_fire")}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                animMode === "ice_fire"
                  ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="size-3.5" />
              <span>2. Ice-Fire Blast</span>
            </button>

            <button
              onClick={() => handleSelectMode("dive_strike")}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                animMode === "dive_strike"
                  ? "bg-cyan-400 text-black shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="size-3.5" />
              <span>3. 3D Dive Strike</span>
            </button>
          </div>

          {/* Right: Fullscreen Trigger */}
          <div className="flex items-center">
            <button
              onClick={handleToggleFullscreen}
              className="size-10 rounded-xl bg-[#01040D] border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center cursor-pointer"
              title="Fullscreen Video View"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
