"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface ParticleOrbit {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  zAngle: number;
  zSpeed: number;
}

interface LightningBolt {
  points: { x: number; y: number }[];
  color: string;
  alpha: number;
  decay: number;
  width: number;
}

export function Hero3DCoreCanvas() {
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
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

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
    window.addEventListener("resize", handleResize, { passive: true });

    const particleColors = ["#00f0ff", "#2979ff", "#7c3aed", "#ff007f", "#ffb800", "#10d69a"];
    const orbits: ParticleOrbit[] = [];
    const isMobile = width < 768;
    const orbitCount = isMobile ? 18 : 36;

    for (let i = 0; i < orbitCount; i++) {
      orbits.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 140,
        speed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 0.8,
        color: particleColors[i % particleColors.length],
        zAngle: Math.random() * Math.PI * 2,
        zSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let bolts: LightningBolt[] = [];

    const generateLightning = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      displace: number,
      color: string
    ) => {
      const points: { x: number; y: number }[] = [];
      points.push({ x: x1, y: y1 });

      const segments = 6;
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const lx = x1 + (x2 - x1) * t;
        const ly = y1 + (y2 - y1) * t;
        const nx = -(y2 - y1);
        const ny = x2 - x1;
        const len = Math.hypot(nx, ny) || 1;
        const offset = (Math.random() - 0.5) * displace * Math.sin(t * Math.PI);
        points.push({
          x: lx + (nx / len) * offset,
          y: ly + (ny / len) * offset,
        });
      }
      points.push({ x: x2, y: y2 });

      bolts.push({
        points,
        color,
        alpha: 1.0,
        decay: 0.06 + Math.random() * 0.04,
        width: 1.2 + Math.random() * 1.0,
      });
    };

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let pulseTime = 0;
    let lightningCooldown = 0;

    const ringNodePositions: { x: number; y: number; color: string }[] = [];
    const coreVerts: [number, number][] = [];

    const render = () => {
      if (!isVisible || !isTabActive) return;

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      pulseTime += 0.012;
      rotX += 0.0025 + mouseY * 0.005;
      rotY += 0.0035 + mouseX * 0.005;
      rotZ += 0.0018;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 10;
      const baseRadius = Math.min(width, height) * 0.13;

      ctx.save();
      ctx.translate(cx, cy);

      const pulseScale = 1 + Math.sin(pulseTime) * 0.06;
      ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.6 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      const rings = [
        { r: baseRadius * 1.35, tiltX: rotX * 1.1, tiltY: rotY * 0.7, color: "#00f0ff", width: 1.5, alpha: 0.6 },
        { r: baseRadius * 1.08, tiltX: rotY * 0.9, tiltY: rotZ * 1.2, color: "#ffb800", width: 1.6, alpha: 0.75 },
        { r: baseRadius * 0.82, tiltX: rotZ * 1.2, tiltY: rotX * 0.8, color: "#a855f7", width: 1.4, alpha: 0.55 },
        { r: baseRadius * 0.55, tiltX: rotX * 1.6, tiltY: rotY * 1.4, color: "#ff007f", width: 1.3, alpha: 0.65 },
      ];

      ringNodePositions.length = 0;

      for (let i = 0; i < rings.length; i++) {
        const ring = rings[i];
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width;
        ctx.globalAlpha = ring.alpha;

        ctx.beginPath();
        const rx = ring.r * (0.85 + Math.cos(ring.tiltY) * 0.2);
        const ry = ring.r * (0.45 + Math.sin(ring.tiltX) * 0.3);
        ctx.ellipse(0, 0, rx, ry, ring.tiltY + mouseX * 0.3, 0, Math.PI * 2);
        ctx.stroke();

        const numTicks = 6;
        for (let t = 0; t < numTicks; t++) {
          const tickAngle = (t / numTicks) * Math.PI * 2 + ring.tiltY;
          const tx = Math.cos(tickAngle) * rx;
          const ty = Math.sin(tickAngle) * ry;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = ring.color;
          ctx.fill();

          if (t % 2 === 0) {
            ringNodePositions.push({ x: tx, y: ty, color: ring.color });
          }
        }
      }

      const coreR = baseRadius * 0.38 * pulseScale;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
      ctx.lineWidth = 1.0;

      const nodes = 8;
      coreVerts.length = 0;
      for (let n = 0; n < nodes; n++) {
        const phi = (n / nodes) * Math.PI * 2 + rotY * 1.2;
        const theta = ((n % 4) / 4) * Math.PI + rotX * 1.2;
        const nx = Math.cos(phi) * Math.sin(theta) * coreR;
        const ny = Math.cos(theta) * coreR;
        coreVerts.push([nx, ny]);

        ctx.beginPath();
        ctx.arc(nx, ny, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = n % 3 === 0 ? "#ffb800" : n % 2 === 0 ? "#00f0ff" : "#ff007f";
        ctx.fill();
      }

      ctx.beginPath();
      for (let i = 0; i < coreVerts.length; i++) {
        for (let j = i + 1; j < coreVerts.length; j++) {
          if ((i + j) % 2 === 0) {
            ctx.moveTo(coreVerts[i][0], coreVerts[i][1]);
            ctx.lineTo(coreVerts[j][0], coreVerts[j][1]);
          }
        }
      }
      ctx.stroke();

      lightningCooldown--;
      if (lightningCooldown <= 0 && coreVerts.length > 0 && ringNodePositions.length > 0) {
        lightningCooldown = Math.floor(Math.random() * 16) + 12;

        const startVertex = coreVerts[Math.floor(Math.random() * coreVerts.length)];
        const targetNode = ringNodePositions[Math.floor(Math.random() * ringNodePositions.length)];
        const colors = ["#00f0ff", "#2979ff", "#ffb800", "#ff007f"];
        const arcColor = colors[Math.floor(Math.random() * colors.length)];

        generateLightning(startVertex[0], startVertex[1], targetNode.x, targetNode.y, 25, arcColor);
      }

      for (let b = bolts.length - 1; b >= 0; b--) {
        const bolt = bolts[b];
        bolt.alpha -= bolt.decay;
        if (bolt.alpha <= 0) {
          bolts.splice(b, 1);
          continue;
        }

        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.globalAlpha = bolt.alpha;
        ctx.beginPath();
        ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
        for (let p = 1; p < bolt.points.length; p++) {
          ctx.lineTo(bolt.points[p].x, bolt.points[p].y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < orbits.length; i++) {
        const orb = orbits[i];
        orb.angle += orb.speed;
        orb.zAngle += orb.zSpeed;

        const ox = Math.cos(orb.angle) * orb.radius;
        const oy = Math.sin(orb.angle) * (orb.radius * 0.45);

        ctx.fillStyle = orb.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
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
      className="pointer-events-none absolute inset-0 size-full select-none z-0"
    />
  );
}
