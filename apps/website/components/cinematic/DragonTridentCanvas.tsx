"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  speedY: number;
  speedX: number;
  rot: number;
  rotSpeed: number;
  colorType: "cyan" | "electric-blue" | "plasma-purple" | "neon-violet" | "ice-white";
}

interface LightningBolt {
  segments: { x: number; y: number }[];
  branches: { segments: { x: number; y: number }[]; alpha: number }[];
  alpha: number;
  width: number;
  color: string;
}

export function DragonTridentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // 1. 50 3D Crystal & Ice-Fire Ember Shards
    const particles: Particle[] = [];
    const particleCount = 50;
    const colorPalettes = [
      "cyan",
      "electric-blue",
      "plasma-purple",
      "neon-violet",
      "ice-white",
    ] as const;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 80,
        size: Math.random() * 3.8 + 1.2,
        alpha: Math.random() * 0.8 + 0.2,
        speedY: -(Math.random() * 1.5 + 0.6),
        speedX: (Math.random() - 0.5) * 0.9,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        colorType: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
      });
    }

    // 2. High-Voltage Multi-Branch Lightning Storm Engine
    let activeBolts: LightningBolt[] = [];
    let nextLightningTime = Date.now() + 400;
    let skyFlashAlpha = 0;

    const createDragonLightning = (startX: number, startY: number, endX: number, endY: number) => {
      const segments = [{ x: startX, y: startY }];
      const dist = Math.hypot(endX - startX, endY - startY);
      const steps = Math.floor(dist / 20);
      let curX = startX;
      let curY = startY;

      const branches: { segments: { x: number; y: number }[]; alpha: number }[] = [];

      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        const targetX = startX + (endX - startX) * progress;
        const targetY = startY + (endY - startY) * progress;
        curX = targetX + (Math.random() - 0.5) * 50;
        curY = targetY + (Math.random() - 0.5) * 30;
        segments.push({ x: curX, y: curY });

        // Branching secondary arcs
        if (i % 2 === 0 && Math.random() > 0.35) {
          const branchSegs = [{ x: curX, y: curY }];
          let bx = curX;
          let by = curY;
          const branchLen = Math.floor(Math.random() * 4 + 2);
          for (let b = 0; b < branchLen; b++) {
            bx += (Math.random() - 0.5) * 55;
            by += Math.random() * 35 + 10;
            branchSegs.push({ x: bx, y: by });
          }
          branches.push({ segments: branchSegs, alpha: 0.9 });
        }
      }
      segments.push({ x: endX, y: endY });

      const colors = [
        "rgba(0, 240, 255, 1.0)",  // Ice Cyan
        "rgba(56, 189, 248, 0.98)", // Sky Electric
        "rgba(168, 85, 247, 0.95)", // Plasma Violet
        "rgba(255, 255, 255, 1.0)",  // Pure White Core
      ];

      activeBolts.push({
        segments,
        branches,
        alpha: 1.0,
        width: Math.random() * 2.5 + 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });

      skyFlashAlpha = 0.28;
    };

    // Render Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const now = Date.now();

      // Atmospheric lightning sky illumination flash
      if (skyFlashAlpha > 0.01) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 240, 255, ${skyFlashAlpha * 0.4})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        skyFlashAlpha -= 0.02;
      }

      // Trigger Dragon Lightning Arcs frequently
      if (now > nextLightningTime) {
        const startX = width * 0.5 + (Math.random() - 0.5) * (width * 0.85);
        const startY = Math.random() * 50;
        const endX = startX + (Math.random() - 0.5) * 500;
        const endY = Math.random() * (height * 0.7) + 100;

        createDragonLightning(startX, startY, endX, endY);

        // Frequent double/triple strikes
        if (Math.random() > 0.5) {
          setTimeout(() => {
            if (canvas) {
              createDragonLightning(
                startX + (Math.random() - 0.5) * 150,
                startY,
                endX + (Math.random() - 0.5) * 200,
                endY + (Math.random() - 0.5) * 100
              );
            }
          }, 80);
        }

        nextLightningTime = now + Math.random() * 1200 + 450;
      }

      // Draw Main Lightning & Branches
      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];
        if (bolt.segments.length < 2) continue;

        ctx.save();
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.globalAlpha = bolt.alpha;
        ctx.lineJoin = "bevel";
        ctx.lineCap = "round";

        // Main trunk
        ctx.beginPath();
        ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let s = 1; s < bolt.segments.length; s++) {
          ctx.lineTo(bolt.segments[s].x, bolt.segments[s].y);
        }
        ctx.stroke();

        // Branches
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

        bolt.alpha -= 0.048;
        if (bolt.alpha <= 0) {
          activeBolts.splice(i, 1);
        }
      }

      // Draw 3D Floating Ice-Fire Ember Shards
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        const fov = 600;
        const scale = fov / (fov + p.z);
        const screenX = (p.x - width / 2) * scale + width / 2;
        const screenY = (p.y - height / 2) * scale + height / 2;
        const radius = p.size * scale;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * scale;

        let fillStyle = "rgba(0, 240, 255, 0.95)";
        if (p.colorType === "electric-blue") fillStyle = "rgba(56, 189, 248, 0.95)";
        else if (p.colorType === "plasma-purple") fillStyle = "rgba(168, 85, 247, 0.9)";
        else if (p.colorType === "neon-violet") fillStyle = "rgba(192, 132, 252, 0.95)";
        else if (p.colorType === "ice-white") fillStyle = "rgba(255, 255, 255, 1.0)";

        ctx.fillStyle = fillStyle;
        ctx.fillRect(-radius, -radius * 1.6, radius * 2, radius * 3.2);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full pointer-events-none z-0"
    />
  );
}
