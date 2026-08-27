"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function LaunchBay3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tier, prefersReducedMotion } = useDeviceTier();

  useEffect(() => {
    if (prefersReducedMotion || tier === "E_LOW_POWER") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let isTabActive = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ═══ 1. FAST UPWARD THRUST LAUNCH PARTICLES ═══
    interface ThrustParticle {
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: ThrustParticle[] = [];
    const isMobile = width < 768;
    const count = isMobile ? 35 : 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(3.5 + Math.random() * 6.5),
        vx: (Math.random() - 0.5) * 1.5,
        size: 2.0 + Math.random() * 3.5,
        alpha: 0.35 + Math.random() * 0.55,
        color: i % 3 === 0 ? "#00FF88" : i % 3 === 1 ? "#00F0FF" : "#0066FF",
        life: 0,
        maxLife: 100 + Math.random() * 150,
      });
    }

    // ═══ 2. 3D FLOATING HEXAGONAL PRISMS ═══
    interface HexPrism {
      x: number;
      y: number;
      z: number;
      radius: number;
      angle: number;
      vAngle: number;
      color: string;
    }

    const hexes: HexPrism[] = [];
    const hexCount = isMobile ? 8 : 16;

    for (let i = 0; i < hexCount; i++) {
      hexes.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 700 + 150,
        radius: 28 + Math.random() * 40,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.025,
        color: i % 2 === 0 ? "#00F0FF" : "#00FF88",
      });
    }

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const fov = 420;
      const centerX = width / 2;
      const centerY = height / 2;

      // ── LAYER 1: QUANTUM CIRCUIT / TELEMETRY AXIS LINES ──
      ctx.strokeStyle = "rgba(0, 255, 136, 0.12)";
      ctx.lineWidth = 1.2;

      const lanes = isMobile ? 6 : 12;
      const laneSpacing = width / lanes;
      for (let l = 0; l <= lanes; l++) {
        const lx = l * laneSpacing + mouseX * 30;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();

        for (let y = 40; y < height; y += 80) {
          ctx.beginPath();
          ctx.moveTo(lx - 5, y + mouseY * 20);
          ctx.lineTo(lx + 5, y + mouseY * 20);
          ctx.stroke();
        }
      }

      // ── LAYER 2: 3D HEXAGONAL LAUNCH NODES ──
      for (let i = 0; i < hexes.length; i++) {
        const hex = hexes[i];
        hex.angle += hex.vAngle;

        const effectiveX = hex.x + mouseX * 80;
        const effectiveY = hex.y + mouseY * 55;

        const scale = fov / (fov + hex.z);
        const projX = centerX + effectiveX * scale;
        const projY = centerY + effectiveY * scale;
        const projR = hex.radius * scale;

        if (projX < -60 || projX > width + 60 || projY < -60 || projY > height + 60) continue;

        ctx.save();
        ctx.translate(projX, projY);
        ctx.rotate(hex.angle);
        ctx.strokeStyle = hex.color;
        ctx.lineWidth = 1.6 * scale;
        ctx.globalAlpha = Math.min(0.75, 0.9 * scale);

        // Draw Outer Hexagon
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s * Math.PI) / 3;
          const hx = Math.cos(a) * projR;
          const hy = Math.sin(a) * projR;
          if (s === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner Hexagon
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s * Math.PI) / 3 + 0.2;
          const hx = Math.cos(a) * (projR * 0.55);
          const hy = Math.sin(a) * (projR * 0.55);
          if (s === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        // Center Pulsing Core
        ctx.fillStyle = hex.color;
        ctx.beginPath();
        ctx.arc(0, 0, 3.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // ── LAYER 3: FAST UPWARD THRUST PARTICLES ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + mouseX * 0.8;
        p.life++;

        if (p.y < -10 || p.life > p.maxLife) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.life = 0;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y + mouseY * 20, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    // ═══ LIFECYCLE & VISIBILITY OPTIMIZATIONS ═══
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isTabActive) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    const handleVisibility = () => {
      isTabActive = document.visibilityState === "visible";
      if (isTabActive && isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none w-full h-full z-0"
    />
  );
}

