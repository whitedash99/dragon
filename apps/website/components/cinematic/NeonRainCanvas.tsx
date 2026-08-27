"use client";

import React, { useEffect, useRef } from "react";

export interface NeonRainProps {
  color?: string;
  density?: "low" | "medium" | "high";
  speed?: number;
  className?: string;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  layer: 1 | 2 | 3; // 1: background (faint/slow), 2: midground, 3: foreground (larger/faster)
  opacity: number;
  thickness: number;
}

export function NeonRainCanvas({
  color = "#00E5FF",
  density = "medium",
  speed = 1.0,
  className = "",
}: NeonRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Adapt count based on screen width & density
    const isMobile = width < 768;
    const baseCount = isMobile ? 35 : density === "low" ? 40 : density === "high" ? 110 : 70;
    const drops: RainDrop[] = [];

    for (let i = 0; i < baseCount; i++) {
      const layer = Math.random() < 0.25 ? 3 : Math.random() < 0.6 ? 2 : 1;
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: layer === 3 ? 24 + Math.random() * 16 : layer === 2 ? 14 + Math.random() * 10 : 8 + Math.random() * 6,
        speed: (layer === 3 ? 7 + Math.random() * 4 : layer === 2 ? 4 + Math.random() * 3 : 2 + Math.random() * 2) * speed,
        layer: layer as 1 | 2 | 3,
        opacity: layer === 3 ? 0.45 + Math.random() * 0.3 : layer === 2 ? 0.25 + Math.random() * 0.2 : 0.12 + Math.random() * 0.1,
        thickness: layer === 3 ? 1.8 : layer === 2 ? 1.2 : 0.8,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Slight deflection near mouse
        const dx = d.x - mouseX;
        const dy = d.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let deflection = 0;
        if (dist < 120) {
          deflection = (dx / dist) * (120 - dist) * 0.05;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = d.opacity;
        ctx.lineWidth = d.thickness;
        ctx.lineCap = "round";

        ctx.moveTo(d.x + deflection, d.y);
        ctx.lineTo(d.x + deflection, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * width;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 size-full z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
