"use client";

import React, { useEffect, useRef } from "react";

// ── Particle Types ──
type ParticleType = "micro_dust" | "energy" | "spark" | "trail" | "foreground";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  life: number;
  maxLife: number;
  type: ParticleType;
  trailIdx?: number;
  trailT?: number;
}

interface Shard3D {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  size: number;
  color: string;
  alpha: number;
  points: [number, number, number][];
}

interface EnergyTrail {
  controlPoints: { x: number; y: number; vy: number }[];
  color: string;
  glowColor: string;
  width: number;
  alpha: number;
  baseAlpha: number;
  depth: number;
  speed: number;
  t: number;
  lightningBoost: number;
}

interface LightningStrike {
  phase: "prep" | "strike" | "flash" | "sparks" | "fade";
  timer: number;
  maxTime: number;
  origin: { x: number; y: number };
  target: { x: number; y: number };
  color: string;
  coreColor: string;
  glowColor: string;
  segments: { x1: number; y1: number; x2: number; y2: number; width: number }[];
  flashRadius: number;
  flashAlpha: number;
  sparks: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[];
  isHighEnergy: boolean;
}

export function DragonUniverse3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Device tier & Quality scaling
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const quality = isMobile ? "LOW" : isTablet ? "MEDIUM" : "ULTRA";
    const targetFps = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let lastFrameTime = performance.now();

    // Smoothed mouse coordinates via refs (zero React re-renders)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseMovePending = false;

    const onMouseMove = (e: MouseEvent) => {
      if (mouseMovePending) return;
      mouseMovePending = true;
      requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = (e.clientX - rect.left - width / 2) / (width / 2);
        targetMouseY = (e.clientY - rect.top - height / 2) / (height / 2);
        mouseMovePending = false;
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ═══ CACHED STATIC RADIAL GRADIENTS (ZERO ALLOCATION IN RENDER) ═══
    let gradKey: CanvasGradient | null = null;
    let gradFill: CanvasGradient | null = null;
    let gradRim: CanvasGradient | null = null;

    const updateCachedGradients = () => {
      if (!ctx || width <= 0 || height <= 0) return;

      gradKey = ctx.createRadialGradient(
        width * 0.15,
        height * 0.25,
        20,
        width * 0.15,
        height * 0.25,
        width * 0.55
      );
      gradKey.addColorStop(0, "rgba(0, 240, 255, 0.14)");
      gradKey.addColorStop(0.5, "rgba(0, 102, 255, 0.05)");
      gradKey.addColorStop(1, "transparent");

      gradFill = ctx.createRadialGradient(
        width * 0.85,
        height * 0.3,
        20,
        width * 0.85,
        height * 0.3,
        width * 0.55
      );
      gradFill.addColorStop(0, "rgba(0, 102, 255, 0.13)");
      gradFill.addColorStop(0.5, "rgba(157, 0, 255, 0.04)");
      gradFill.addColorStop(1, "transparent");

      gradRim = ctx.createRadialGradient(
        width * 0.8,
        height * 0.85,
        20,
        width * 0.8,
        height * 0.85,
        width * 0.5
      );
      gradRim.addColorStop(0, "rgba(157, 0, 255, 0.12)");
      gradRim.addColorStop(1, "transparent");
    };

    updateCachedGradients();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      updateCachedGradients();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // ═══ 1. ENERGY TRAILS (SPLINES) ═══
    const trailPalette = [
      { stroke: "#00F0FF", glow: "rgba(0, 240, 255, 0.7)" },
      { stroke: "#0066FF", glow: "rgba(0, 102, 255, 0.65)" },
      { stroke: "#9D00FF", glow: "rgba(157, 0, 255, 0.6)" },
      { stroke: "#FF007F", glow: "rgba(255, 0, 127, 0.55)" },
    ];

    const trails: EnergyTrail[] = [];
    const trailCount = quality === "LOW" ? 2 : quality === "MEDIUM" ? 4 : 6;

    for (let i = 0; i < trailCount; i++) {
      const pal = trailPalette[i % trailPalette.length];
      const pointCount = 5;
      const startY = height * 0.1 + (i / trailCount) * (height * 0.8);
      const controlPoints = [];

      for (let p = 0; p < pointCount; p++) {
        controlPoints.push({
          x: (p / (pointCount - 1)) * (width * 1.3) - width * 0.15,
          y: startY + Math.sin(p * 1.4 + i * 0.9) * 70,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }

      trails.push({
        controlPoints,
        color: pal.stroke,
        glowColor: pal.glow,
        width: 1.2 + (i % 3) * 0.6,
        alpha: 0.3 + (i % 4) * 0.12,
        baseAlpha: 0.3 + (i % 4) * 0.12,
        depth: 0.3 + (i / trailCount) * 0.6,
        speed: 0.002 + i * 0.0006,
        t: Math.random() * Math.PI * 2,
        lightningBoost: 0,
      });
    }

    // ═══ 2. PARTICLE BUDGETS (ADAPTIVE DEVICE AWARE) ═══
    const particles: Particle3D[] = [];
    const particleCounts = {
      micro_dust: quality === "LOW" ? 18 : quality === "MEDIUM" ? 40 : 80,
      energy: quality === "LOW" ? 12 : quality === "MEDIUM" ? 30 : 60,
      spark: quality === "LOW" ? 6 : quality === "MEDIUM" ? 16 : 30,
      trail: quality === "LOW" ? 8 : quality === "MEDIUM" ? 20 : 40,
      foreground: quality === "LOW" ? 3 : quality === "MEDIUM" ? 8 : 14,
    };

    const particlePalette = ["#00F0FF", "#0066FF", "#9D00FF", "#FF007F", "#FFFFFF"];

    const spawnParticle = (type: ParticleType): Particle3D => {
      const z =
        type === "foreground"
          ? 0.85 + Math.random() * 0.15
          : type === "micro_dust"
          ? 0.1 + Math.random() * 0.3
          : Math.random() * 0.6 + 0.3;
      const size =
        type === "foreground"
          ? 4.5 + Math.random() * 3.0
          : type === "micro_dust"
          ? 0.9 + Math.random() * 0.8
          : type === "spark"
          ? 2.2 + Math.random() * 1.8
          : 1.8 + Math.random() * 1.4;
      const color =
        type === "spark"
          ? "#FFFFFF"
          : particlePalette[Math.floor(Math.random() * particlePalette.length)];
      const baseAlpha = type === "micro_dust" ? 0.32 : type === "foreground" ? 0.5 : 0.7;
      const speedMultiplier = type === "spark" ? 2.5 : type === "foreground" ? 1.5 : 1.2;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() - 0.5) * speedMultiplier - (type === "micro_dust" ? 0.15 : 0.35),
        vz: (Math.random() - 0.5) * 0.003,
        size,
        color,
        alpha: baseAlpha,
        baseAlpha,
        life: 0,
        maxLife: 200 + Math.random() * 300,
        type,
        trailIdx: type === "trail" && trails.length > 0 ? Math.floor(Math.random() * trails.length) : undefined,
        trailT: type === "trail" ? Math.random() : undefined,
      };
    };

    (Object.keys(particleCounts) as ParticleType[]).forEach((type) => {
      const count = particleCounts[type];
      for (let i = 0; i < count; i++) {
        particles.push(spawnParticle(type));
      }
    });

    // ═══ 3. 3D CRYSTALLINE SHARDS (OUTER EDGES ONLY) ═══
    const shards: Shard3D[] = [];
    const shardCount = quality === "LOW" ? 0 : quality === "MEDIUM" ? 5 : 10;

    // Pre-allocated projection vertex buffer: [x, y] for 4 vertices
    const shardProjBuf: [number, number][] = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];

    for (let s = 0; s < shardCount; s++) {
      const isLeft = s % 2 === 0;
      const x = isLeft ? Math.random() * (width * 0.22) : width * 0.78 + Math.random() * (width * 0.22);
      const y = Math.random() * height;
      const z = 0.35 + Math.random() * 0.55;

      const points: [number, number, number][] = [
        [0, -1.1, 0],
        [0.9, 0.55, 0],
        [-0.9, 0.55, 0],
        [0, 0, 1.3],
      ];

      shards.push({
        x,
        y,
        z,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        vRotX: (Math.random() - 0.5) * 0.015,
        vRotY: (Math.random() - 0.5) * 0.015,
        vRotZ: (Math.random() - 0.5) * 0.015,
        size: 14 + Math.random() * 14,
        color: s % 3 === 0 ? "#00F0FF" : s % 3 === 1 ? "#0066FF" : "#9D00FF",
        alpha: 0.3 + Math.random() * 0.2,
        points,
      });
    }

    // ═══ 4. FAST DRAGON LIGHTNING SYSTEM ═══
    const activeStrikes: LightningStrike[] = [];
    let lightningCooldown = isMobile ? 120 : 60;

    const createLightningArc = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      depth: number,
      displace: number,
      segments: { x1: number; y1: number; x2: number; y2: number; width: number }[]
    ) => {
      if (depth <= 0) {
        segments.push({ x1, y1, x2, y2, width: Math.max(1.0, depth + 1.5) });
        return;
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
      createLightningArc(x1, y1, midX, midY, depth - 1, displace * 0.55, segments);
      createLightningArc(midX, midY, x2, y2, depth - 1, displace * 0.55, segments);
    };

    const spawnDragonLightning = () => {
      if (quality === "LOW" && activeStrikes.length > 0) return;
      const side = Math.floor(Math.random() * 4);
      let originX = 0;
      let originY = 0;
      let targetX = 0;
      let targetY = 0;

      if (side === 0) {
        originX = Math.random() * (width * 0.35);
        originY = 0;
        targetX = Math.random() * (width * 0.45);
        targetY = height * 0.25 + Math.random() * (height * 0.4);
      } else if (side === 1) {
        originX = width * 0.65 + Math.random() * (width * 0.35);
        originY = 0;
        targetX = width * 0.55 + Math.random() * (width * 0.45);
        targetY = height * 0.25 + Math.random() * (height * 0.4);
      } else if (side === 2) {
        originX = 0;
        originY = height * 0.1 + Math.random() * (height * 0.6);
        targetX = width * 0.35;
        targetY = originY + (Math.random() - 0.5) * 180;
      } else {
        originX = width;
        originY = height * 0.1 + Math.random() * (height * 0.6);
        targetX = width * 0.65;
        targetY = originY + (Math.random() - 0.5) * 180;
      }

      const segments: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];
      createLightningArc(originX, originY, targetX, targetY, isMobile ? 3 : 4, 60, segments);

      const sparks = [];
      const sparkCount = isMobile ? 4 : 10;
      for (let k = 0; k < sparkCount; k++) {
        sparks.push({
          x: targetX,
          y: targetY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          alpha: 1.0,
          size: 1.5 + Math.random() * 1.5,
          color: "#00F0FF",
        });
      }

      activeStrikes.push({
        phase: "prep",
        timer: 0,
        maxTime: 36,
        origin: { x: originX, y: originY },
        target: { x: targetX, y: targetY },
        color: "#00F0FF",
        coreColor: "#FFFFFF",
        glowColor: "rgba(0, 240, 255, 0.6)",
        segments,
        flashRadius: width * 0.45,
        flashAlpha: 0.28,
        sparks,
        isHighEnergy: false,
      });
    };

    // ═══ VIEWPORT & TAB VISIBILITY PAUSING ═══
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        lastFrameTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting && !document.hidden;
        if (isVisible && !animId) {
          lastFrameTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(canvas);

    // ═══ ZERO-ALLOCATION RENDER LOOP ═══
    const render = (currentTime: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      const delta = currentTime - lastFrameTime;
      if (delta < frameInterval) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = currentTime - (delta % frameInterval);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // ── DEPTH 01: Pre-rendered Background Ambient Light ──
      if (gradKey) {
        ctx.fillStyle = gradKey;
        ctx.fillRect(0, 0, width, height);
      }
      if (gradFill) {
        ctx.fillStyle = gradFill;
        ctx.fillRect(0, 0, width, height);
      }
      if (gradRim) {
        ctx.fillStyle = gradRim;
        ctx.fillRect(0, 0, width, height);
      }

      // ── DEPTH 03: 3D Crystalline Shards (Zero-allocation vertex projection) ──
      if (shards.length > 0) {
        for (let s = 0; s < shards.length; s++) {
          const shard = shards[s];
          shard.rotX += shard.vRotX;
          shard.rotY += shard.vRotY;
          shard.rotZ += shard.vRotZ;

          const posX = shard.x + mouseX * 50 * shard.z;
          const posY = shard.y + mouseY * 35 * shard.z;

          const cosY = Math.cos(shard.rotY);
          const sinY = Math.sin(shard.rotY);
          const cosX = Math.cos(shard.rotX);
          const sinX = Math.sin(shard.rotX);

          for (let p = 0; p < 4; p++) {
            const [px, py, pz] = shard.points[p];
            const x1 = px * cosY + pz * sinY;
            const z1 = -px * sinY + pz * cosY;
            const y2 = py * cosX - z1 * sinX;
            shardProjBuf[p][0] = x1 * shard.size;
            shardProjBuf[p][1] = y2 * shard.size;
          }

          ctx.save();
          ctx.translate(posX, posY);
          ctx.strokeStyle = shard.color;
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = shard.alpha * shard.z;

          ctx.beginPath();
          ctx.moveTo(shardProjBuf[0][0], shardProjBuf[0][1]);
          ctx.lineTo(shardProjBuf[1][0], shardProjBuf[1][1]);
          ctx.lineTo(shardProjBuf[2][0], shardProjBuf[2][1]);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(shardProjBuf[3][0], shardProjBuf[3][1]);
          ctx.lineTo(shardProjBuf[0][0], shardProjBuf[0][1]);
          ctx.moveTo(shardProjBuf[3][0], shardProjBuf[3][1]);
          ctx.lineTo(shardProjBuf[1][0], shardProjBuf[1][1]);
          ctx.moveTo(shardProjBuf[3][0], shardProjBuf[3][1]);
          ctx.lineTo(shardProjBuf[2][0], shardProjBuf[2][1]);
          ctx.stroke();

          ctx.restore();
        }
      }

      // ── DEPTH 04: Flowing Energy Trails (Splines) ──
      for (let t = 0; t < trails.length; t++) {
        const trail = trails[t];
        trail.t += trail.speed;

        if (trail.lightningBoost > 0) {
          trail.lightningBoost -= 0.035;
        }

        const offsetX = mouseX * 60 * trail.depth;
        const offsetY = mouseY * 40 * trail.depth;
        const currentAlpha = Math.min(0.9, trail.alpha + trail.lightningBoost * 0.5);

        ctx.strokeStyle = trail.color;
        ctx.lineWidth = trail.width + trail.lightningBoost * 1.8;
        ctx.globalAlpha = currentAlpha;

        ctx.beginPath();
        const p0 = trail.controlPoints[0];
        const p0y = p0.y + Math.sin(trail.t) * 35 + offsetY;
        ctx.moveTo(p0.x + offsetX, p0y);

        for (let i = 1; i < trail.controlPoints.length - 1; i++) {
          const pi = trail.controlPoints[i];
          const next = trail.controlPoints[i + 1];
          const currY = pi.y + Math.sin(trail.t + i * 1.2) * 35 + offsetY;
          const nextY = next.y + Math.sin(trail.t + (i + 1) * 1.2) * 35 + offsetY;
          const xc = (pi.x + next.x) / 2 + offsetX;
          const yc = (currY + nextY) / 2;
          ctx.quadraticCurveTo(pi.x + offsetX, currY, xc, yc);
        }

        const last = trail.controlPoints[trail.controlPoints.length - 1];
        const lastY = last.y + Math.sin(trail.t + 4) * 35 + offsetY;
        ctx.lineTo(last.x + offsetX, lastY);
        ctx.stroke();
      }

      // ── DEPTH 05: Batched 3D Particle Field ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        if (p.type === "trail" && p.trailIdx !== undefined && trails[p.trailIdx]) {
          p.trailT = (p.trailT || 0) + 0.0035;
          if (p.trailT > 1) p.trailT = 0;
          const tr = trails[p.trailIdx];
          p.x = p.trailT * width;
          p.y = tr.controlPoints[0].y + Math.sin(tr.t + p.trailT * 4) * 35;
        } else {
          p.x += p.vx + mouseX * 0.3 * p.z;
          p.y += p.vy + mouseY * 0.3 * p.z;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * p.z;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── DRAGON LIGHTNING STRIKES ──
      lightningCooldown--;
      if (lightningCooldown <= 0) {
        spawnDragonLightning();
        lightningCooldown = isMobile ? 120 : 65;
      }

      for (let s = activeStrikes.length - 1; s >= 0; s--) {
        const strike = activeStrikes[s];
        strike.timer++;

        if (strike.timer < 5) strike.phase = "prep";
        else if (strike.timer < 16) strike.phase = "strike";
        else if (strike.timer < 26) strike.phase = "flash";
        else strike.phase = "fade";

        if (strike.phase === "strike" || strike.phase === "flash" || strike.phase === "fade") {
          const fadeAlpha = strike.phase === "fade" ? Math.max(0, 1 - (strike.timer - 26) / 15) : 1.0;

          // Outer Glow Arc
          ctx.strokeStyle = strike.color;
          ctx.globalAlpha = fadeAlpha * 0.85;
          for (let g = 0; g < strike.segments.length; g++) {
            const seg = strike.segments[g];
            ctx.lineWidth = seg.width * 2.2;
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.stroke();
          }

          // Core Plasma
          ctx.strokeStyle = strike.coreColor;
          ctx.globalAlpha = fadeAlpha;
          for (let g = 0; g < strike.segments.length; g++) {
            const seg = strike.segments[g];
            ctx.lineWidth = seg.width * 0.9;
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.stroke();
          }
        }

        // Lightning Sparks
        for (let sp = strike.sparks.length - 1; sp >= 0; sp--) {
          const spark = strike.sparks[sp];
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.92;
          spark.vy *= 0.92;
          spark.alpha -= 0.05;

          if (spark.alpha > 0) {
            ctx.fillStyle = spark.color;
            ctx.globalAlpha = spark.alpha;
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            strike.sparks.splice(sp, 1);
          }
        }

        if (strike.timer >= strike.maxTime && strike.sparks.length === 0) {
          activeStrikes.splice(s, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none z-[2]"
    />
  );
}
