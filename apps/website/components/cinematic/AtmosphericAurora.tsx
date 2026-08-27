"use client";

import React from "react";
import { motion } from "framer-motion";

export function AtmosphericAurora({
  className = "",
  isLowPower = false,
}: {
  className?: string;
  isLowPower?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      {/* ── Deep Luminous Royal Blue/Midnight Base (#020512) ── */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #0F256E 0%, #061138 45%, #020512 100%)",
        }}
      />

      {/* ── Full Bleed Aurora Layer 1: Left Electric Cyan/Sapphire Light Corridor ── */}
      {isLowPower ? (
        <div className="absolute -top-[20%] -left-[10%] w-[900px] h-[700px] rounded-full bg-gradient-to-tr from-[#0051FF]/45 via-[#00F0FF]/35 to-transparent blur-[90px] opacity-70" />
      ) : (
        <motion.div
          animate={{
            x: [-30, 35, -30],
            y: [-20, 25, -20],
            scale: [1, 1.12, 1],
            opacity: [0.55, 0.72, 0.55],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[25%] -left-[15%] w-[1100px] h-[850px] rounded-full bg-gradient-to-tr from-[#0051FF]/55 via-[#00F0FF]/45 to-transparent blur-[110px] will-change-transform transform-gpu"
        />
      )}

      {/* ── Full Bleed Aurora Layer 2: Center Bright Volumetric Cyan-Blue Field ── */}
      {isLowPower ? (
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1100px] h-[750px] rounded-full bg-gradient-to-b from-[#00F0FF]/35 via-[#1A6BFF]/30 to-transparent blur-[100px] opacity-75" />
      ) : (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.55, 0.78, 0.55],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1300px] h-[850px] rounded-full bg-gradient-to-b from-[#00F0FF]/45 via-[#1A6BFF]/40 to-transparent blur-[120px] will-change-transform transform-gpu"
        />
      )}

      {/* ── Full Bleed Aurora Layer 3: Right Neon Violet & Magenta Peripheral Glow ── */}
      {isLowPower ? (
        <div className="absolute -top-[15%] -right-[10%] w-[850px] h-[650px] rounded-full bg-gradient-to-bl from-[#9D00FF]/45 via-[#FF007F]/25 to-transparent blur-[90px] opacity-65" />
      ) : (
        <motion.div
          animate={{
            x: [30, -35, 30],
            y: [20, -25, 20],
            scale: [1, 1.12, 1],
            opacity: [0.45, 0.62, 0.45],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -right-[12%] w-[1000px] h-[750px] rounded-full bg-gradient-to-bl from-[#9D00FF]/55 via-[#FF007F]/35 to-transparent blur-[110px] will-change-transform transform-gpu"
        />
      )}

      {/* ── Top Border Full Bleed Canopy ── */}
      <div className="absolute top-0 inset-x-0 h-[320px] bg-gradient-to-b from-[#00F0FF]/25 via-[#0051FF]/15 to-transparent blur-2xl" />

      {/* ── Bottom Border Full Bleed Glow ── */}
      <div className="absolute -bottom-10 inset-x-0 h-[280px] bg-gradient-to-t from-[#0F256E]/35 via-[#00F0FF]/12 to-transparent blur-2xl" />
    </div>
  );
}
