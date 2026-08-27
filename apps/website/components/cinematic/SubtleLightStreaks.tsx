"use client";

import React, { useEffect, useRef } from "react";

interface LightStreak {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  color: string;
}

const STREAK_PALETTE = [
  "rgba(0, 240, 255, ",   // Cyan
  "rgba(41, 121, 255, ",  // Electric Blue
  "rgba(168, 85, 247, ",  // Violet
  "rgba(255, 0, 127, ",   // Magenta
];

export function SubtleLightStreaks({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = width < 768;
    // Keep count ultra-low and subtle so user feels motion without a distraction
    const streakCount = isMobile ? 12 : 24;

    const streaks: LightStreak[] = [];

    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 25 + Math.random() * 65,
        speed: 1.2 + Math.random() * 2.2,
        opacity: 0.04 + Math.random() * 0.14, // Ultra-low opacity
        width: 0.6 + Math.random() * 0.8,
        color: STREAK_PALETTE[Math.floor(Math.random() * STREAK_PALETTE.length)],
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];

        s.y += s.speed;
        if (s.y > height + s.length) {
          s.y = -s.length;
          s.x = Math.random() * width;
        }

        const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y);
        grad.addColorStop(0, `${s.color}0)`);
        grad.addColorStop(0.7, `${s.color}${s.opacity * 0.6})`);
        grad.addColorStop(1, `${s.color}${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.length);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full select-none ${className}`}
    />
  );
}
