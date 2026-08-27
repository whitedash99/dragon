"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number; // 0 = background, 1 = midground, 2 = foreground
  size: number;
  baseAlpha: number;
  alpha: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

const ACCENT_PALETTE = [
  "#00f0ff", // Cyan (Primary)
  "#2979ff", // Electric Blue
  "#a855f7", // Violet
  "#ff007f", // Magenta
  "#f59e0b", // Amber
];

interface MultiDepthParticlesProps {
  density?: "low" | "medium" | "high";
  className?: string;
}

export function MultiDepthParticles({
  density = "medium",
  className = "",
}: MultiDepthParticlesProps) {
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
    const baseCount = isMobile ? 18 : density === "low" ? 22 : density === "medium" ? 38 : 52;

    const particles: Particle[] = [];

    for (let i = 0; i < baseCount; i++) {
      // 3 tiers: 50% background (0), 35% midground (1), 15% foreground (2)
      const tierRand = Math.random();
      const z = tierRand < 0.5 ? 0 : tierRand < 0.85 ? 1 : 2;

      let size = 0.8 + Math.random() * 0.8;
      let baseAlpha = 0.15 + Math.random() * 0.25;
      let speedFactor = 0.15;

      if (z === 1) {
        size = 1.4 + Math.random() * 1.0;
        baseAlpha = 0.25 + Math.random() * 0.35;
        speedFactor = 0.28;
      } else if (z === 2) {
        size = 2.2 + Math.random() * 1.4;
        baseAlpha = 0.35 + Math.random() * 0.45;
        speedFactor = 0.45;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size,
        baseAlpha,
        alpha: baseAlpha,
        alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() * -0.4 - 0.1) * speedFactor,
        color: ACCENT_PALETTE[Math.floor(Math.random() * ACCENT_PALETTE.length)],
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Breathing opacity
        p.alpha += p.alphaSpeed;
        if (p.alpha > p.baseAlpha + 0.2 || p.alpha < Math.max(0.05, p.baseAlpha - 0.15)) {
          p.alphaSpeed *= -1;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.04, Math.min(0.85, p.alpha));

        // Soft glow for foreground & midground
        if (p.z > 0) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.z === 2 ? 10 : 5;
        }

        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full select-none ${className}`}
    />
  );
}
