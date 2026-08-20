"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundFx } from "@/lib/sound-effects";
import { isEditorEnvironment } from "@/lib/cms/editorSafety";
import { ArrowRight, Zap, Volume2, VolumeX } from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

interface LightningBolt {
  segments: { x: number; y: number }[];
  branches: { segments: { x: number; y: number }[]; alpha: number }[];
  alpha: number;
  width: number;
  color: string;
}

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleEnterHub = () => {
    try {
      soundFx.playCinematicSubDrop();
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (isEditorEnvironment()) {
      setLoading(false);
      return;
    }

    // High-Voltage 3.2s Lightning Intro
    const t0 = setTimeout(() => {
      try {
        if (!isMuted) soundFx.playLightningSpark();
      } catch {}
    }, 300);

    const t1 = setTimeout(() => {
      setLoading(false);
    }, 3200);

    // Progress counter (completes in 3.2 seconds)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4.2;
      });
    }, 100);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearInterval(progressInterval);
    };
  }, [isMuted]);

  // Pure High-Voltage Multi-Branch Lightning Canvas
  useEffect(() => {
    if (!loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let activeBolts: LightningBolt[] = [];
    let nextLightningTime = Date.now() + 150;
    let skyFlashAlpha = 0;

    const sparks: {
      x: number;
      y: number;
      z: number;
      size: number;
      alpha: number;
      vx: number;
      vy: number;
      rot: number;
      color: string;
    }[] = [];

    const sparkColors = ["#00f0ff", "#38bdf8", "#818cf8", "#ffffff"];

    for (let i = 0; i < 70; i++) {
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 500 + 50,
        size: Math.random() * 3.2 + 1.2,
        alpha: Math.random() * 0.9 + 0.1,
        vx: (Math.random() - 0.5) * 6,
        vy: -(Math.random() * 4 + 1.5),
        rot: Math.random() * Math.PI * 2,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
      });
    }

    const createLightning = (startX: number, startY: number, endX: number, endY: number) => {
      const segments = [{ x: startX, y: startY }];
      const dist = Math.hypot(endX - startX, endY - startY);
      const steps = Math.floor(dist / 18);
      let curX = startX;
      let curY = startY;

      const branches: { segments: { x: number; y: number }[]; alpha: number }[] = [];

      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        const targetX = startX + (endX - startX) * progress;
        const targetY = startY + (endY - startY) * progress;
        curX = targetX + (Math.random() - 0.5) * 55;
        curY = targetY + (Math.random() - 0.5) * 30;
        segments.push({ x: curX, y: curY });

        if (i % 2 === 0 && Math.random() > 0.3) {
          const branchSegs = [{ x: curX, y: curY }];
          let bx = curX;
          let by = curY;
          const branchLen = Math.floor(Math.random() * 5 + 2);
          for (let b = 0; b < branchLen; b++) {
            bx += (Math.random() - 0.5) * 60;
            by += Math.random() * 35 + 10;
            branchSegs.push({ x: bx, y: by });
          }
          branches.push({ segments: branchSegs, alpha: 0.95 });
        }
      }
      segments.push({ x: endX, y: endY });

      const colors = [
        "rgba(0, 240, 255, 1.0)",
        "rgba(56, 189, 248, 0.98)",
        "rgba(255, 255, 255, 1.0)",
      ];

      activeBolts.push({
        segments,
        branches,
        alpha: 1.0,
        width: Math.random() * 2.8 + 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });

      skyFlashAlpha = 0.32;
    };

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const now = Date.now();

      if (skyFlashAlpha > 0.01) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 240, 255, ${skyFlashAlpha * 0.45})`;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        skyFlashAlpha -= 0.03;
      }

      if (now > nextLightningTime) {
        const startX = w * 0.5 + (Math.random() - 0.5) * (w * 0.9);
        const startY = Math.random() * 40;
        const endX = startX + (Math.random() - 0.5) * 550;
        const endY = Math.random() * (h * 0.75) + 120;

        createLightning(startX, startY, endX, endY);

        if (Math.random() > 0.45) {
          setTimeout(() => {
            if (canvas) {
              createLightning(
                startX + (Math.random() - 0.5) * 180,
                startY,
                endX + (Math.random() - 0.5) * 220,
                endY + (Math.random() - 0.5) * 100
              );
            }
          }, 70);
        }

        nextLightningTime = now + Math.random() * 600 + 200;
      }

      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];
        if (bolt.segments.length < 2) continue;

        ctx.save();
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.globalAlpha = bolt.alpha;
        ctx.lineJoin = "bevel";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let s = 1; s < bolt.segments.length; s++) {
          ctx.lineTo(bolt.segments[s].x, bolt.segments[s].y);
        }
        ctx.stroke();

        ctx.lineWidth = bolt.width * 0.65;
        for (let b = 0; b < bolt.branches.length; b++) {
          const br = bolt.branches[b];
          if (br.segments.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(br.segments[0].x, br.segments[0].y);
          for (let bs = 1; bs < br.segments.length; bs++) {
            ctx.lineTo(br.segments[bs].x, br.segments[bs].y);
          }
          ctx.stroke();
        }

        ctx.restore();

        bolt.alpha -= 0.06;
        if (bolt.alpha <= 0) {
          activeBolts.splice(i, 1);
        }
      }

      for (let i = 0; i < sparks.length; i++) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 0.04;
        p.alpha -= 0.015;

        if (p.alpha <= 0 || p.y < -20 || p.x < 0 || p.x > w) {
          p.x = Math.random() * w;
          p.y = h + 20;
          p.alpha = Math.random() * 0.95 + 0.05;
          p.vx = (Math.random() - 0.5) * 6;
          p.vy = -(Math.random() * 5 + 1.5);
        }

        const scale = 500 / (500 + p.z);
        const sx = (p.x - w / 2) * scale + w / 2;
        const sy = (p.y - h / 2) * scale + h / 2;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="dragon-lightning-intro"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: "brightness(1.5) blur(6px)",
          transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
        }}
        className="fixed inset-0 z-[99999] bg-[#000000] flex items-center justify-center overflow-hidden select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none z-10" />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute size-[500px] rounded-full bg-gradient-to-tr from-cyan-500/35 via-blue-600/30 to-purple-600/20 blur-[120px] pointer-events-none"
        />

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl space-y-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 140, damping: 20 }}
            className="relative"
          >
            <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-b from-[#040D24] to-[#01040D] border-2 border-cyan-400 p-4 shadow-[0_0_50px_rgba(0,240,255,0.8)] flex items-center justify-center">
              <DragonLogoIcon size="lg" className="scale-110 drop-shadow-[0_0_20px_#00f0ff]" />
            </div>

            <motion.div
              animate={{
                scale: [1, 1.35, 1.1],
                opacity: [0.8, 0, 0.6],
              }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl border border-cyan-300 shadow-[0_0_35px_#00f0ff] pointer-events-none"
            />
          </motion.div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 backdrop-blur-xl text-cyan-300 font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              <Zap className="size-3.5 text-cyan-400 animate-pulse" />
              <span>DRAGON GAMING HUB ONLINE</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-7xl uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-400 drop-shadow-[0_0_50px_rgba(0,240,255,0.9)]">
              DRAGON STUDIOS
            </h1>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-300">
              ORIGINAL 3D & 2D GAMING HUB
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 sm:bottom-12 inset-x-0 z-30 flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-64 sm:w-80 bg-white/10 rounded-full h-1 overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_12px_#00f0ff] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleEnterHub}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black text-xs uppercase tracking-[0.18em] flex items-center gap-2 shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>ENTER HUB</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 backdrop-blur-xl cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="size-4 text-red-400" /> : <Volume2 className="size-4 text-cyan-400" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}