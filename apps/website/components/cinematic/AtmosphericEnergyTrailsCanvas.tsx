"use client";

import React, { useEffect, useRef } from "react";

interface EnergyTrail {
  points: { x: number; y: number; vx: number; vy: number }[];
  color: string;
  glowColor: string;
  width: number;
  alpha: number;
  speed: number;
  depth: number; // 0.1 to 0.9 for parallax & sizing
  t: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  depth: number;
}

interface MicroEnergyPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  decay: number;
  points?: { x: number; y: number }[];
}

export function AtmosphericEnergyTrailsCanvas() {
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

    // Mouse tracking with smooth damping
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) / (width / 2);
      targetMouseY = (e.clientY - rect.top - height / 2) / (height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const isMobile = width < 768;

    // ═══ 1. Initialize Smooth Energy Trails (Curved Beziers moving across viewport) ═══
    const trailColors = [
      { stroke: "#00E5FF", glow: "rgba(0, 229, 255, 0.45)" }, // Electric Cyan
      { stroke: "#338BFF", glow: "rgba(51, 139, 255, 0.4)" }, // Electric Blue
      { stroke: "#8B5CF6", glow: "rgba(139, 92, 246, 0.35)" }, // Violet
      { stroke: "#EC4899", glow: "rgba(236, 72, 153, 0.3)" }, // Magenta
      { stroke: "#FFB020", glow: "rgba(255, 176, 32, 0.25)" }, // Amber
    ];

    const trails: EnergyTrail[] = [];
    const trailCount = isMobile ? 4 : 7;

    for (let i = 0; i < trailCount; i++) {
      const col = trailColors[i % trailColors.length];
      const pointCount = 6;
      const points = [];
      const startY = (height * 0.15) + (i / trailCount) * (height * 0.7);

      for (let p = 0; p < pointCount; p++) {
        points.push({
          x: (p / (pointCount - 1)) * (width * 1.3) - width * 0.15,
          y: startY + (Math.sin(p * 1.2 + i) * 80),
          vx: (Math.random() * 0.4 + 0.2) * (i % 2 === 0 ? 1 : -1),
          vy: (Math.random() - 0.5) * 0.3,
        });
      }

      trails.push({
        points,
        color: col.stroke,
        glowColor: col.glow,
        width: 1.0 + (i % 3) * 0.6,
        alpha: 0.25 + (i % 4) * 0.15,
        speed: 0.0006 + (i * 0.0003),
        depth: 0.2 + (i / trailCount) * 0.6,
        t: Math.random() * Math.PI * 2,
      });
    }

    // ═══ 2. Initialize Subtle Ambient Particles ═══
    const particles: Particle[] = [];
    const particleCount = isMobile ? 35 : 75;
    const particlePalette = ["#00E5FF", "#338BFF", "#8B5CF6", "#EC4899", "#FFB020", "#10D98B"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.1, // gently drifting upwards
        size: Math.random() * 1.6 + 0.6,
        color: particlePalette[i % particlePalette.length],
        alpha: Math.random() * 0.5 + 0.2,
        depth: Math.random() * 0.8 + 0.2,
      });
    }

    // ═══ 3. Rare, Organic Micro Energy Pulses ═══
    const pulses: MicroEnergyPulse[] = [];
    let pulseTimer = 0;
    let nextPulse = 180; // Occurs every ~3-6 seconds (rare, organic)

    const spawnRarePulse = () => {
      const px = Math.random() * (width * 0.8) + (width * 0.1);
      const py = Math.random() * (height * 0.6) + (height * 0.2);
      const col = trailColors[Math.floor(Math.random() * trailColors.length)].stroke;

      // Small short lightning micro-arc
      const points: { x: number; y: number }[] = [{ x: px, y: py }];
      const segments = 4;
      let currX = px;
      let currY = py;
      for (let s = 0; s < segments; s++) {
        currX += (Math.random() - 0.5) * 40;
        currY += (Math.random() - 0.5) * 35;
        points.push({ x: currX, y: currY });
      }

      pulses.push({
        x: px,
        y: py,
        radius: 4,
        maxRadius: 40 + Math.random() * 30,
        color: col,
        alpha: 0.85,
        decay: 0.025,
        points,
      });
    };

    // ═══ Render Loop ═══
    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // ── Layer 1: Soft Volumetric Light Corridors (Cyan left, Violet right) ──
      const gradLeft = ctx.createRadialGradient(
        width * 0.2 + mouseX * 30,
        height * 0.35 + mouseY * 20,
        10,
        width * 0.2,
        height * 0.35,
        width * 0.45
      );
      gradLeft.addColorStop(0, "rgba(0, 229, 255, 0.06)");
      gradLeft.addColorStop(0.6, "rgba(51, 139, 255, 0.02)");
      gradLeft.addColorStop(1, "transparent");

      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, width, height);

      const gradRight = ctx.createRadialGradient(
        width * 0.8 - mouseX * 30,
        height * 0.45 - mouseY * 20,
        10,
        width * 0.8,
        height * 0.45,
        width * 0.45
      );
      gradRight.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      gradRight.addColorStop(0.6, "rgba(236, 72, 153, 0.015)");
      gradRight.addColorStop(1, "transparent");

      ctx.fillStyle = gradRight;
      ctx.fillRect(0, 0, width, height);

      // ── Layer 2: Architectural Light Coordinate Lines ──
      ctx.save();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.04)";
      ctx.lineWidth = 0.8;
      const lineY1 = height * 0.28 + mouseY * 15;
      const lineY2 = height * 0.78 + mouseY * 25;

      ctx.beginPath();
      ctx.moveTo(0, lineY1);
      ctx.lineTo(width, lineY1);
      ctx.moveTo(0, lineY2);
      ctx.lineTo(width, lineY2);
      ctx.stroke();

      // Coordinates tick markers
      const tickSpacing = width / 8;
      for (let i = 1; i < 8; i++) {
        const tx = i * tickSpacing + mouseX * 20;
        ctx.beginPath();
        ctx.moveTo(tx, lineY1 - 4);
        ctx.lineTo(tx, lineY1 + 4);
        ctx.moveTo(tx, lineY2 - 4);
        ctx.lineTo(tx, lineY2 + 4);
        ctx.stroke();
      }
      ctx.restore();

      // ── Layer 3: Dynamic Fluid Energy Trails (Curved Splines) ──
      for (let t = 0; t < trails.length; t++) {
        const trail = trails[t];
        trail.t += trail.speed;

        // Apply depth parallax
        const offsetX = mouseX * 80 * trail.depth;
        const offsetY = mouseY * 45 * trail.depth;

        ctx.save();
        ctx.strokeStyle = trail.color;
        ctx.lineWidth = trail.width;
        ctx.globalAlpha = trail.alpha * (0.8 + Math.sin(trail.t * 3) * 0.2);
        ctx.shadowColor = trail.glowColor;
        ctx.shadowBlur = 12 * trail.depth;

        ctx.beginPath();
        const p0 = trail.points[0];
        const p0y = p0.y + Math.sin(trail.t + 0) * 35 + offsetY;
        ctx.moveTo(p0.x + offsetX, p0y);

        for (let i = 1; i < trail.points.length - 1; i++) {
          const pi = trail.points[i];
          const next = trail.points[i + 1];

          const currY = pi.y + Math.sin(trail.t + i * 1.1) * 35 + offsetY;
          const nextY = next.y + Math.sin(trail.t + (i + 1) * 1.1) * 35 + offsetY;

          const xc = (pi.x + next.x) / 2 + offsetX;
          const yc = (currY + nextY) / 2;

          ctx.quadraticCurveTo(pi.x + offsetX, currY, xc, yc);
        }

        const last = trail.points[trail.points.length - 1];
        const lastY = last.y + Math.sin(trail.t + 5) * 35 + offsetY;
        ctx.lineTo(last.x + offsetX, lastY);
        ctx.stroke();

        ctx.restore();
      }

      // ── Layer 4: Floating Atmospheric Micro-Particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + mouseX * 0.2 * p.depth;
        p.y += p.vy + mouseY * 0.2 * p.depth;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.depth, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * p.depth;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * p.depth;
        ctx.fill();
        ctx.restore();
      }

      // ── Layer 5: Rare Organic Micro-Pulses & Small Energy Arcs ──
      pulseTimer++;
      if (pulseTimer >= nextPulse) {
        pulseTimer = 0;
        nextPulse = Math.floor(Math.random() * 220) + 140; // 2.5s - 6s interval
        spawnRarePulse();
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        ctx.save();
        ctx.strokeStyle = pulse.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = pulse.alpha;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 15;

        // Draw expanding soft wave
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw micro lightning arc
        if (pulse.points && pulse.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(pulse.points[0].x, pulse.points[0].y);
          for (let i = 1; i < pulse.points.length; i++) {
            ctx.lineTo(pulse.points[i].x, pulse.points[i].y);
          }
          ctx.stroke();

          // White inner core
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        ctx.restore();

        pulse.radius += (pulse.maxRadius - pulse.radius) * 0.08;
        pulse.alpha -= pulse.decay;

        if (pulse.alpha <= 0) {
          pulses.splice(p, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none z-0"
    />
  );
}
