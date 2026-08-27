"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export interface ParticleUniverseProps {
  primaryColor?: string;
  secondaryColor?: string;
  particleCount?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  connectionDistance: number;
}

export function InteractiveParticleUniverse({
  primaryColor = "#00E5FF",
  secondaryColor = "#7C3AED",
  particleCount = 55,
  className = "",
}: ParticleUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tier, prefersReducedMotion } = useDeviceTier();

  useEffect(() => {
    if (prefersReducedMotion || tier === "E_LOW_POWER") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let isTabActive = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = width < 768;
    const totalParticles = isMobile ? Math.min(particleCount, 25) : particleCount;
    const particles: Particle[] = [];

    const palette = [primaryColor, secondaryColor, "#2979FF", "#FF2BD6", "#00F5D4", "#FFD54A"];

    for (let i = 0; i < totalParticles; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const maxAlpha = 0.35 + Math.random() * 0.45;

      particles.push({
        x: px,
        y: py,
        originX: px,
        originY: py,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1.2 + Math.random() * 2.2,
        color,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        pulseSpeed: 0.006 + Math.random() * 0.012,
        connectionDistance: isMobile ? 65 : 100,
      });
    }

    let mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      radius: isMobile ? 120 : 200,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      mouse.vx = (mouse.targetX - mouse.x) * 0.15;
      mouse.vy = (mouse.targetY - mouse.y) * 0.15;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;

      const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (1 - dist / mouse.radius);
          const angle = Math.atan2(dy, dx);
          const repelStrength = force * 3.8;
          p.vx -= Math.cos(angle) * repelStrength;
          p.vy -= Math.sin(angle) * repelStrength;

          if (mouseSpeed > 1) {
            p.vx += mouse.vx * force * 0.35;
            p.vy += mouse.vy * force * 0.35;
          }
        }

        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx + (Math.random() - 0.5) * 0.2;
        p.y += p.vy - 0.25;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdistSq = cdx * cdx + cdy * cdy;
          const maxDistSq = p.connectionDistance * p.connectionDistance;

          if (cdistSq < maxDistSq) {
            const lineAlpha = (1 - Math.sqrt(cdistSq) / p.connectionDistance) * 0.18 * Math.min(p.alpha, p2.alpha);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isTabActive) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });

    observer.observe(canvas);

    const handleVisibility = () => {
      isTabActive = document.visibilityState === "visible";
      if (isTabActive && isVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [primaryColor, secondaryColor, particleCount, tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 size-full z-0 ${className}`}
      aria-hidden="true"
    />
  );
}

