"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface AmbientBolt {
  segments: { x1: number; y1: number; x2: number; y2: number; width: number }[];
  color: string;
  alpha: number;
  decay: number;
  coreFlash: number;
}

export function CinematicLightningCanvas() {
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
    let flashTimeout: NodeJS.Timeout | null = null;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const activeBolts: AmbientBolt[] = [];
    const colors = ["#00f0ff", "#2979ff", "#7c3aed", "#ff007f", "#ffb800"];

    const createBranch = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      depth: number,
      segments: { x1: number; y1: number; x2: number; y2: number; width: number }[]
    ) => {
      if (depth <= 0) {
        segments.push({ x1, y1, x2, y2, width: 1.0 });
        return;
      }

      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 45;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 45;

      createBranch(x1, y1, midX, midY, depth - 1, segments);
      createBranch(midX, midY, x2, y2, depth - 1, segments);

      if (Math.random() > 0.65 && depth >= 2) {
        const subEndX = midX + (Math.random() - 0.5) * 80;
        const subEndY = midY + (Math.random() * 60 + 20);
        createBranch(midX, midY, subEndX, subEndY, depth - 2, segments);
      }
    };

    const spawnLightning = () => {
      const startX = Math.random() * width;
      const startY = Math.random() * (height * 0.3);
      const endX = startX + (Math.random() - 0.5) * 350;
      const endY = startY + Math.random() * 280 + 80;

      const segments: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];
      createBranch(startX, startY, endX, endY, 3, segments);

      const color = colors[Math.floor(Math.random() * colors.length)];
      activeBolts.push({
        segments,
        color,
        alpha: 0.9 + Math.random() * 0.1,
        decay: 0.05 + Math.random() * 0.03,
        coreFlash: 0.25,
      });
    };

    let timer = 0;
    let nextStrike = 60;

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      timer++;
      if (timer >= nextStrike) {
        timer = 0;
        nextStrike = Math.floor(Math.random() * 120) + 70;
        spawnLightning();
        if (Math.random() > 0.5) {
          if (flashTimeout) clearTimeout(flashTimeout);
          flashTimeout = setTimeout(() => {
            if (isVisible && isTabActive) spawnLightning();
          }, 120);
        }
      }

      for (let b = activeBolts.length - 1; b >= 0; b--) {
        const bolt = activeBolts[b];

        if (bolt.coreFlash > 0) {
          ctx.fillStyle = bolt.color;
          ctx.globalAlpha = bolt.coreFlash * 0.04;
          ctx.fillRect(0, 0, width, height);
          bolt.coreFlash -= 0.05;
        }

        ctx.strokeStyle = bolt.color;
        ctx.globalAlpha = bolt.alpha;

        for (let s = 0; s < bolt.segments.length; s++) {
          const seg = bolt.segments[s];
          ctx.lineWidth = seg.width * 1.8;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = seg.width * 0.7;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
          ctx.strokeStyle = bolt.color;
        }

        bolt.alpha -= bolt.decay;
        if (bolt.alpha <= 0) {
          activeBolts.splice(b, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

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
      if (flashTimeout) clearTimeout(flashTimeout);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none z-[2]"
    />
  );
}

