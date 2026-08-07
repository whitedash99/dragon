"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ShieldCheck, Database, Server } from "lucide-react";

export function Preloader() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const isEditor = window.self !== window.top || window.location.search.includes("editor=true");
        if (isEditor) return false;
        return !sessionStorage.getItem("dragon_visited_session");
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing DragonOS Engine...");

  useEffect(() => {
    const isEditor =
      typeof window !== "undefined" &&
      (window.self !== window.top || window.location.search.includes("editor=true"));

    if (isEditor) {
      setLoading(false);
      return;
    }

    if (!loading) return;

    const statuses = [
      "Initializing DragonOS Engine Core...",
      "Connecting PostgreSQL Prisma ORM Client...",
      "Verifying DragonID Auth Subsystem...",
      "Compiling Low-Latency Vulkan Shaders...",
      "Syncing Dragon DevHub & LiveOps Pipelines...",
      "Dragon Studios Platform Ready",
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 14) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatusText("Dragon Studios Platform Ready");
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          try {
            sessionStorage.setItem("dragon_visited_session", "true");
          } catch (e) {
            // Ignore storage restrictions in sandboxed environments
          }
        }, 500);
      } else {
        setProgress(currentProgress);
        const statusIdx = Math.min(
          Math.floor((currentProgress / 100) * statuses.length),
          statuses.length - 2
        );
        setStatusText(statuses[statusIdx]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30,
            transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } 
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] text-white select-none overflow-hidden font-mono"
        >
          {/* Cybernetic Particle Grid & Radial Ambient Glow */}
          <div className="absolute h-[600px] w-[600px] rounded-full bg-[#ff1e4b]/20 blur-[180px] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md w-full">
            {/* Animated Crest Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#ff1e4b] to-purple-700 text-3xl font-black text-white shadow-[0_0_50px_rgba(255,30,75,0.5)] mb-8 border border-white/20 font-heading"
            >
              D
              <div className="absolute inset-0 rounded-3xl border border-white/40 animate-ping opacity-30" />
            </motion.div>

            {/* Studio Branding */}
            <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading">
              DRAGON STUDIOS
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#ff1e4b]">
              ENTERPRISE PLATFORM ARCHITECTURE
            </p>

            {/* Live Loading Telemetry */}
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Cpu className="size-3.5 animate-spin" />
                  <span>{statusText}</span>
                </span>
                <span className="font-bold text-white text-sm">{progress}%</span>
              </div>

              {/* Glowing Linear Progress Bar */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff1e4b] via-purple-500 to-amber-400 shadow-[0_0_20px_#ff1e4b]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>

            {/* Footer Telemetry Badges */}
            <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Database className="size-3 text-emerald-400" />
                <span>POSTGRESQL</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-[#ff1e4b]" />
                <span>DRAGONID</span>
              </span>
              <span className="flex items-center gap-1">
                <Server className="size-3 text-purple-400" />
                <span>LIVEOPS</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
