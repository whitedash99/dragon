"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function CyberVault3DCanvas() {
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

    // ═══ 1. 3D HOLOGRAPHIC DATA NODES & VAULT CUBES ═══
    interface VaultCube {
      x: number;
      y: number;
      z: number;
      size: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      vRotX: number;
      vRotY: number;
      vRotZ: number;
      color: string;
    }

    const cubes: VaultCube[] = [];
    const isMobile = width < 768;
    const cubeCount = isMobile ? 12 : 24;

    for (let i = 0; i < cubeCount; i++) {
      cubes.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 150,
        size: 22 + Math.random() * 32,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        vRotX: (Math.random() - 0.5) * 0.03,
        vRotY: (Math.random() - 0.5) * 0.03,
        vRotZ: (Math.random() - 0.5) * 0.03,
        color: i % 4 === 0 ? "#00F0FF" : i % 4 === 1 ? "#0066FF" : i % 4 === 2 ? "#9D00FF" : "#00FF66",
      });
    }

    // Pre-allocated flat vertex buffer (8 vertices × 3 coordinates) to prevent GC allocations in 60fps loop
    const vBuf = new Float32Array(24);

    // ═══ 2. HIGH-SPEED LASER BEAMS ═══
    interface LaserBeam {
      x: number;
      y: number;
      length: number;
      speed: number;
      color: string;
      alpha: number;
    }

    const lasers: LaserBeam[] = [];
    const laserCount = isMobile ? 12 : 24;
    for (let i = 0; i < laserCount; i++) {
      lasers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 100 + Math.random() * 200,
        speed: 8 + Math.random() * 14,
        color: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#0066FF" : "#9D00FF",
        alpha: 0.45 + Math.random() * 0.45,
      });
    }

    let gridOffset = 0;

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const fov = 450;
      const centerX = width / 2;
      const centerY = height / 2;

      // ── LAYER 1: 3D CYBER GRID FLOOR (DARK NEON) ──
      ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
      ctx.lineWidth = 1.2;
      gridOffset = (gridOffset + 1.8) % 40;

      const horizon = centerY + mouseY * 45;
      const fovGrid = 260;

      // Perspective Grid Lines
      for (let x = -width; x < width * 2; x += 55) {
        ctx.beginPath();
        ctx.moveTo(centerX + (x - centerX) * 0.1 + mouseX * 35, horizon);
        ctx.lineTo(x + mouseX * 120, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let z = 10; z < 500; z += 30) {
        const lineZ = (z + gridOffset) % 500;
        const scale = fovGrid / (fovGrid + lineZ);
        const y = horizon + (height - horizon) * scale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ── LAYER 2: FAST LASER DATA STREAMS ──
      for (let i = 0; i < lasers.length; i++) {
        const l = lasers[i];
        l.y += l.speed;
        if (l.y > height + l.length) {
          l.y = -l.length;
          l.x = Math.random() * width;
        }

        const lx = l.x + mouseX * 25;
        const ly = l.y + mouseY * 20;

        ctx.strokeStyle = l.color;
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = l.alpha;
        ctx.beginPath();
        ctx.moveTo(lx, ly - l.length);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }

      // ── LAYER 3: 3D ROTATING VAULT CUBES ──
      for (let i = 0; i < cubes.length; i++) {
        const cube = cubes[i];
        cube.rotX += cube.vRotX;
        cube.rotY += cube.vRotY;
        cube.rotZ += cube.vRotZ;

        const effectiveX = cube.x + mouseX * 90;
        const effectiveY = cube.y + mouseY * 60;

        const scale = fov / (fov + cube.z);
        const projX = centerX + effectiveX * scale;
        const projY = centerY + effectiveY * scale;
        const projSize = cube.size * scale;

        if (projX < -100 || projX > width + 100 || projY < -100 || projY > height + 100) continue;

        ctx.save();
        ctx.translate(projX, projY);
        ctx.strokeStyle = cube.color;
        ctx.lineWidth = 1.5 * scale;
        ctx.globalAlpha = Math.min(0.75, 0.9 * scale);

        const hs = projSize / 2;
        const cosY = Math.cos(cube.rotY);
        const sinY = Math.sin(cube.rotY);

        // Pre-computed 8 vertices mapped into continuous Float32Array to avoid object creation
        vBuf[0] = -hs * cosY; vBuf[1] = -hs; vBuf[2] = -hs * sinY;
        vBuf[3] = hs * cosY;  vBuf[4] = -hs; vBuf[5] = hs * sinY;
        vBuf[6] = hs * cosY;  vBuf[7] = hs;  vBuf[8] = hs * sinY;
        vBuf[9] = -hs * cosY; vBuf[10] = hs; vBuf[11] = -hs * sinY;
        vBuf[12] = -hs * cosY * 0.7; vBuf[13] = -hs * 0.7; vBuf[14] = -hs * sinY - hs;
        vBuf[15] = hs * cosY * 0.7;  vBuf[16] = -hs * 0.7; vBuf[17] = hs * sinY - hs;
        vBuf[18] = hs * cosY * 0.7;  vBuf[19] = hs * 0.7;  vBuf[20] = hs * sinY - hs;
        vBuf[21] = -hs * cosY * 0.7; vBuf[22] = hs * 0.7;  vBuf[23] = -hs * sinY - hs;

        // Front Face
        ctx.beginPath();
        ctx.moveTo(vBuf[0], vBuf[1]);
        ctx.lineTo(vBuf[3], vBuf[4]);
        ctx.lineTo(vBuf[6], vBuf[7]);
        ctx.lineTo(vBuf[9], vBuf[10]);
        ctx.closePath();
        ctx.stroke();

        // Back Face
        ctx.beginPath();
        ctx.moveTo(vBuf[12], vBuf[13]);
        ctx.lineTo(vBuf[15], vBuf[16]);
        ctx.lineTo(vBuf[18], vBuf[19]);
        ctx.lineTo(vBuf[21], vBuf[22]);
        ctx.closePath();
        ctx.stroke();

        // Connecting Edges
        for (let e = 0; e < 4; e++) {
          ctx.beginPath();
          ctx.moveTo(vBuf[e * 3], vBuf[e * 3 + 1]);
          ctx.lineTo(vBuf[(e + 4) * 3], vBuf[(e + 4) * 3 + 1]);
          ctx.stroke();
        }

        ctx.restore();
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

