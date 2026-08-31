"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Gamepad2,
  Volume2,
  VolumeX,
  Crown,
  ChevronRight,
  ArrowRight,
  Tv,
  Info,
  ShieldCheck
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";

// ═══════════════════════════════════════════════════════════════════════
// THE REAL STUDIO FLAGSHIP CAR GAME (UNCHARTED DRIVE: BEYOND)
// ═══════════════════════════════════════════════════════════════════════
const REAL_STUDIO_GAMES = [
  {
    id: "uncharted-drive-beyond",
    slug: "uncharted-drive-beyond",
    title: "UNCHARTED DRIVE: BEYOND",
    subtitle: "Next-Gen Open Highway Driving & Vehicle Dynamics",
    dimension: "3D VOLUMETRIC HIGHWAY ENGINE",
    statusBadge: "✦ STUDIO ORIGINAL FLAGSHIP",
    heading: "HORIZONS, COASTAL HIGHWAYS & HYPER-CAR DRIFTS",
    tagline:
      "Experience high-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves with ultra-responsive vehicle dynamics.",
    accentColor: "#00E5FF",
    icon: Zap,
    platforms: "PC (.exe) • Android (.apk)",
    coverUrl: "/images/uncharted-drive-banner.png",
    neonBorder: "border-cyan-400/60 shadow-[0_0_40px_rgba(0,229,255,0.35)]",
    badgeBg: "bg-cyan-500/15 border-cyan-400/50 text-cyan-300",
  },
];

const UNIVERSE_STATEMENTS = [
  "YOUR GAMES.",
  "YOUR IDENTITY.",
  "YOUR DRAGON.",
  "YOUR UNIVERSE.",
];

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [gameIndex, setGameIndex] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch real user metadata & check onboarding status (Video plays only 1 time)
  useEffect(() => {
    async function checkUserOnboarding() {
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
          if (data.onboarding?.hasCompletedWelcome && !data.onboarding?.hasCompletedDragonId) {
            router.replace("/dragon-id/setup");
            return;
          }
          if (data.user) {
            setUserData(data.user);
          }
        }
      } catch (err) {
        console.warn("Onboarding fetch warning:", err);
      }
    }
    checkUserOnboarding();
  }, [router]);

  const rawName = userData?.name || session?.user?.name || userData?.email || "Dragon Operative";
  const displayName = rawName.split("@")[0].split(" ")[0];

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE PROGRESSION TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isMuted) {
      soundFx.playCinematicSubDrop();
      soundFx.playLightningSpark();
    }

    // Scene 01 -> Scene 02 (Dragon Crest) @ 1.8s
    const t1 = setTimeout(() => {
      setScene(2);
      if (!isMuted) soundFx.playLightningSpark();
    }, 1800);

    // Scene 02 -> Scene 03 (Welcome Title) @ 3.4s
    const t2 = setTimeout(() => {
      setScene(3);
      if (!isMuted) soundFx.playSlideWhoosh();
    }, 3400);

    // Scene 03 -> Scene 04 (Real Games Repertoire) @ 5.4s
    const t3 = setTimeout(() => {
      setScene(4);
      if (!isMuted) soundFx.playSlideWhoosh();
    }, 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isMuted]);

  // Scene 04: Flagship Car Game Showcase
  useEffect(() => {
    if (scene !== 4) return;

    const gameTimer = setTimeout(() => {
      setScene(5);
      setStatementIndex(0);
      if (!isMuted) soundFx.playSlideWhoosh();
    }, 4000);

    return () => clearTimeout(gameTimer);
  }, [scene, isMuted]);

  // Scene 05: Universe Statements
  useEffect(() => {
    if (scene !== 5) return;

    const stmtTimer = setTimeout(() => {
      if (statementIndex < UNIVERSE_STATEMENTS.length - 1) {
        setStatementIndex((prev) => prev + 1);
        if (!isMuted) soundFx.playClick();
      } else {
        setScene(6);
        if (!isMuted) soundFx.playForgeComplete();
      }
    }, 1200);

    return () => clearTimeout(stmtTimer);
  }, [scene, statementIndex, isMuted]);

  // ═══════════════════════════════════════════════════════════════════════
  // 3D COSMIC PARTICLE WARP CANVAS
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
    window.addEventListener("resize", handleResize, { passive: true });

    const stars: { x: number; y: number; z: number; o: number; color: string }[] = [];
    const colors = ["#00E5FF", "#1685FF", "#7C3CFF", "#A855F7", "#FF2BD6", "#00FFC6"];
    const numStars = width < 768 ? 100 : 220;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        o: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(2, 4, 10, 0.28)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 6.0;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 260 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.6, (1 - star.z / width) * 3.4);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.o * (1 - star.z / width);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentGame = REAL_STUDIO_GAMES[0];
  const GameIcon = currentGame.icon;

  const handleProceedToForge = async () => {
    if (isAdvancing) return;
    setIsAdvancing(true);

    if (!isMuted) {
      soundFx.playClick();
      soundFx.playForgeComplete();
    }

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "WELCOME_COMPLETE" }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }
    } catch (err) {
      console.warn("Non-fatal onboarding sync warning:", err);
    }
    window.location.assign("/dragon-id/setup");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040A] overflow-hidden font-sans select-none">
      {/* 3D Particle Space Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Volumetric Auroras */}
      <div className="absolute -top-48 -left-48 w-[650px] h-[650px] bg-[#00E5FF]/15 rounded-full blur-[180px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-[650px] h-[650px] bg-[#FF2BD6]/15 rounded-full blur-[180px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#7C3CFF]/15 rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Scanline Grid */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40" />

      {/* Top Header Bar */}
      <div className="absolute top-6 inset-x-6 sm:inset-x-12 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#03091D]/80 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <DragonLogoIcon size="sm" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FF2BD6] block">
              DRAGON GAMING STUDIOS
            </span>
            <span className="text-[11px] text-slate-300 font-mono">Mandatory Universe Orientation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl bg-[#03091D]/85 hover:bg-cyan-950/60 text-cyan-300 text-xs transition-all cursor-pointer backdrop-blur-xl border border-cyan-500/30 shadow-lg"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SCENE 01: FULL SCREEN DARKNESS & NEON ENERGY FLOW                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {scene === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-20 flex flex-col items-center justify-center space-y-6 text-center max-w-lg px-6"
        >
          <div className="relative w-72 h-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF2BD6] to-transparent"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6] shadow-[0_0_20px_#00E5FF]"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400/80 drop-shadow-[0_0_10px_#00E5FF]"
          >
            INITIALIZING DRAGON UNIVERSE...
          </motion.p>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SCENE 02: 3D DRAGON EMBLEM REVEAL                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {scene === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 flex flex-col items-center justify-center space-y-6 text-center max-w-xl px-6"
        >
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#08183d]/90 via-[#03091D]/95 to-[#02040A] border-2 border-cyan-400/60 shadow-[0_0_80px_rgba(0,229,255,0.4),0_0_120px_rgba(255,43,214,0.2)]">
            <DragonLogoIcon size="xl" className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_35px_#00E5FF]" />
          </div>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/40 text-xs font-mono font-black text-cyan-300 tracking-widest shadow-[0_0_25px_rgba(0,229,255,0.3)]"
          >
            <Crown className="size-4 text-amber-400" />
            <span>DRAGON GAMING STUDIOS</span>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SCENE 03: WELCOME TO DRAGON GAMING STUDIOS                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {scene === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 text-center space-y-5 max-w-4xl px-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.3em] text-cyan-300"
          >
            WELCOME TO
          </motion.p>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-heading drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#1685FF] via-[#7C3CFF] to-[#FF2BD6] bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,229,255,0.6)]">
              DRAGON GAMING
            </span>
            <br />
            <span className="text-white">STUDIOS</span>
          </h1>

          <p className="text-base sm:text-2xl text-slate-200 font-sans max-w-2xl mx-auto leading-relaxed font-bold">
            WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-300">{displayName.toUpperCase()}</span>
          </p>

          <p className="text-xs sm:text-sm text-cyan-300/90 font-mono max-w-lg mx-auto">
            &ldquo;Your Dragon ID is your identity across Dragon Gaming Studios.&rdquo;
          </p>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 04: STUDIO FLAGSHIP GAME (UNCHARTED DRIVE: BEYOND)         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {scene === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl px-6 relative z-20 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              <Sparkles className="size-4 text-cyan-400" />
              <span>DISCOVER THE REAL STUDIO REPERTOIRE</span>
            </div>

            <div className="flex items-center gap-2">
              {REAL_STUDIO_GAMES.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGameIndex(idx);
                    if (!isMuted) soundFx.playSlideWhoosh();
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === gameIndex
                      ? "w-10 bg-gradient-to-r from-[#00E5FF] to-[#FF2BD6] shadow-[0_0_12px_#00E5FF]"
                      : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentGame.id}
              initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
              transition={{ duration: 0.45 }}
              className={`rounded-3xl bg-gradient-to-b from-[#061230]/95 via-[#03091D]/98 to-[#02040A] border-2 ${currentGame.neonBorder} p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden`}
            >
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-mono font-black uppercase tracking-wider ${currentGame.badgeBg}`}>
                    <GameIcon className="size-3.5" style={{ color: currentGame.accentColor }} />
                    <span>{currentGame.statusBadge}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      {currentGame.dimension}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-heading tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                      {currentGame.title}
                    </h2>
                    <p className="text-xs font-mono font-bold uppercase" style={{ color: currentGame.accentColor }}>
                      &ldquo;{currentGame.heading}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans pt-1 leading-relaxed">
                      {currentGame.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-[11px] font-mono font-bold">
                      {currentGame.platforms}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-full max-w-[220px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                    <Image
                      src={currentGame.coverUrl}
                      alt={currentGame.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-cyan-300 uppercase px-2 py-0.5 rounded bg-black/80 border border-cyan-400/40">
                        OFFICIAL TITLE
                      </span>
                      <Gamepad2 className="size-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SCENE 05: UNIVERSE STATEMENTS                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {scene === 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-20 flex flex-col items-center justify-center space-y-6 text-center max-w-2xl px-6"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={statementIndex}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.15, y: -20 }}
              transition={{ duration: 0.45 }}
              className="text-4xl sm:text-7xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6] font-heading drop-shadow-[0_0_40px_rgba(0,229,255,0.8)]"
            >
              {UNIVERSE_STATEMENTS[statementIndex]}
            </motion.h2>
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SCENE 06: FORGE YOUR DRAGON ID (MANDATORY NEXT STEP)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {scene === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 flex flex-col items-center justify-center space-y-6 text-center max-w-2xl px-6"
        >
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#03091D]/90 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(0,229,255,0.4)] backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-widest uppercase">
                  MANDATORY IDENTITY ONBOARDING
                </span>
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
                STEP 1 OF 2 COMPLETE
              </div>
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl sm:text-3xl font-black uppercase text-white font-heading tracking-tight">
                MANDATORY DRAGON ID FORGE
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Before accessing the Dragon Command Center, you must forge your verified Dragon ID callsign, customize your mythic combat badge, and establish your player identity.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center w-full pt-2">
            <button
              type="button"
              onClick={handleProceedToForge}
              disabled={isAdvancing}
              className="w-full sm:w-auto min-h-[52px] px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#1685FF] to-[#7C3CFF] text-[#020617] font-black text-xs sm:text-sm font-mono uppercase tracking-widest shadow-[0_0_40px_rgba(0,229,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>{isAdvancing ? "COMMENCING FORGE..." : "ENTER DRAGON ID FORGE →"}</span>
              <ArrowRight className="size-4 text-[#020617]" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress Dots */}
      <div className="absolute bottom-6 inset-x-0 z-40 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              scene === step
                ? "w-8 bg-gradient-to-r from-[#00E5FF] to-[#FF2BD6] shadow-[0_0_10px_#00E5FF]"
                : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
