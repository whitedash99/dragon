"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface Star3D {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
  size: number;
}

interface Polyhedron3D {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  radius: number;
  color: string;
  type: "hypercube" | "icosahedron" | "prism";
}

const NEON_COLORS = [
  "#00f0ff", // Hyper Cyan
  "#ff007f", // Neon Magenta
  "#a855f7", // Electric Violet
  "#2979ff", // Radiant Blue
  "#ffb800", // Solar Gold
  "#10d69a", // Matrix Emerald
];

export function GlobalDimensionCanvas3D() {
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

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseVelocity = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      mouseVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.04, 3);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollSpeed = (currentScroll - lastScrollY) * 0.06;
      lastScrollY = currentScroll;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const isMobile = width < 768;
    const starCount = isMobile ? 40 : 90;
    const stars: Star3D[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 50,
        pz: 1000,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        size: 0.8 + Math.random() * 1.6,
      });
    }

    const polyCount = isMobile ? 2 : 4;
    const polyhedrons: Polyhedron3D[] = [];
    const types: ("hypercube" | "icosahedron" | "prism")[] = ["hypercube", "icosahedron", "prism"];

    for (let i = 0; i < polyCount; i++) {
      polyhedrons.push({
        x: (Math.random() - 0.5) * (width * 0.8),
        y: (Math.random() - 0.5) * (height * 0.8),
        z: 300 + Math.random() * 500,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.006,
        radius: isMobile ? 18 + Math.random() * 12 : 28 + Math.random() * 20,
        color: NEON_COLORS[i % NEON_COLORS.length],
        type: types[i % types.length],
      });
    }

    interface MicroBolt {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const microBolts: MicroBolt[] = [];
    let lightningCooldown = 0;

    const cubeVerts = new Float32Array(24);
    const focalLength = 400;

    const render = () => {
      if (!isVisible || !isTabActive) return;

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      mouseVelocity *= 0.92;
      scrollSpeed *= 0.92;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const speed = 0.8 + Math.abs(scrollSpeed) + mouseVelocity;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        star.z -= speed;

        star.x -= mouseX * 0.5;
        star.y -= mouseY * 0.5;

        if (star.z <= 10) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = focalLength / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = focalLength / star.pz;
        const prevPx = star.x * pk + cx;
        const prevPy = star.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.max(0.08, Math.min(0.75, (1000 - star.z) / 800));
          
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size * k * 0.7;
          ctx.globalAlpha = depthAlpha * 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, star.size * k), 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = depthAlpha;
          ctx.fill();
        }
      }

      for (let i = 0; i < polyhedrons.length; i++) {
        const p = polyhedrons[i];
        p.rotX += p.speedX + mouseY * 0.005;
        p.rotY += p.speedY + mouseX * 0.005;
        p.rotZ += p.speedZ;

        const pk = focalLength / p.z;
        const screenX = (p.x - mouseX * 80) * pk + cx;
        const screenY = (p.y - mouseY * 80) * pk + cy;
        const r = p.radius * pk;

        if (screenX < -100 || screenX > width + 100 || screenY < -100 || screenY > height + 100) {
          continue;
        }

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.globalAlpha = Math.max(0.15, Math.min(0.6, (900 - p.z) / 600));
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.0;

        let idx = 0;
        const cosY = Math.cos(p.rotY), sinY = Math.sin(p.rotY);
        const cosX = Math.cos(p.rotX), sinX = Math.sin(p.rotX);
        const cosZ = Math.cos(p.rotZ), sinZ = Math.sin(p.rotZ);

        for (let dx = -1; dx <= 1; dx += 2) {
          for (let dy = -1; dy <= 1; dy += 2) {
            for (let dz = -1; dz <= 1; dz += 2) {
              const x1 = dx * r, y1 = dy * r, z1 = dz * r;
              const x2 = x1 * cosY + z1 * sinY;
              const z2 = -x1 * sinY + z1 * cosY;
              const y3 = y1 * cosX - z2 * sinX;
              const z3 = y1 * sinX + z2 * cosX;
              const x4 = x2 * cosZ - y3 * sinZ;
              const y4 = x2 * sinZ + y3 * cosZ;

              cubeVerts[idx * 3] = x4;
              cubeVerts[idx * 3 + 1] = y4;
              cubeVerts[idx * 3 + 2] = z3;
              idx++;
            }
          }
        }

        ctx.beginPath();
        const edges = [
          [0, 1], [1, 3], [3, 2], [2, 0],
          [4, 5], [5, 7], [7, 6], [6, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        for (let e = 0; e < edges.length; e++) {
          const [v1, v2] = edges[e];
          ctx.moveTo(cubeVerts[v1 * 3], cubeVerts[v1 * 3 + 1]);
          ctx.lineTo(cubeVerts[v2 * 3], cubeVerts[v2 * 3 + 1]);
        }
        ctx.stroke();

        ctx.restore();
      }

      // ── 3. Ambient Micro Lightning Spawning ──
      lightningCooldown--;
      if (lightningCooldown <= 0) {
        lightningCooldown = Math.floor(Math.random() * 90) + 60; // every 1-2.5s
        const lx1 = Math.random() * width;
        const ly1 = Math.random() * (height * 0.4);
        const lx2 = lx1 + (Math.random() - 0.5) * 200;
        const ly2 = ly1 + Math.random() * 120 + 30;
        microBolts.push({
          x1: lx1,
          y1: ly1,
          x2: lx2,
          y2: ly2,
          color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
          alpha: 0.8,
          decay: 0.05,
        });
      }

      for (let b = microBolts.length - 1; b >= 0; b--) {
        const mb = microBolts[b];
        ctx.strokeStyle = mb.color;
        ctx.globalAlpha = mb.alpha * 0.7;
        ctx.lineWidth = 1.0;

        ctx.beginPath();
        ctx.moveTo(mb.x1, mb.y1);
        const midX = (mb.x1 + mb.x2) / 2 + (Math.random() - 0.5) * 15;
        const midY = (mb.y1 + mb.y2) / 2 + (Math.random() - 0.5) * 15;
        ctx.lineTo(midX, midY);
        ctx.lineTo(mb.x2, mb.y2);
        ctx.stroke();

        mb.alpha -= mb.decay;
        if (mb.alpha <= 0) {
          microBolts.splice(b, 1);
        }
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 size-full select-none"
    />
  );
}
