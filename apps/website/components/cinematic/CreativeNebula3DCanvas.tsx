"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function CreativeNebula3DCanvas() {
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

    // ═══ 1. FLOATING 3D CRYSTALLINE POLYHEDRA ═══
    interface Crystal {
      x: number;
      y: number;
      z: number;
      radius: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      vRotX: number;
      vRotY: number;
      vRotZ: number;
      color: string;
      rawVerts: Float32Array; // [x0, y0, z0, x1, y1, z1, ...]
    }

    const crystals: Crystal[] = [];
    const isMobile = width < 768;
    const count = isMobile ? 8 : 16;

    for (let i = 0; i < count; i++) {
      const r = 24 + Math.random() * 30;
      const rawVerts = new Float32Array([
        0, -r, 0,
        r, 0, 0,
        0, 0, r,
        -r, 0, 0,
        0, 0, -r,
        0, r, 0,
      ]);

      crystals.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 600 + 150,
        radius: r,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        vRotX: (Math.random() - 0.5) * 0.025,
        vRotY: (Math.random() - 0.5) * 0.025,
        vRotZ: (Math.random() - 0.5) * 0.025,
        color: i % 4 === 0 ? "#9D00FF" : i % 4 === 1 ? "#FFB800" : i % 4 === 2 ? "#00F0FF" : "#FF007F",
        rawVerts,
      });
    }

    // Pre-allocated projected vertex buffer for octahedron (6 vertices × 2 coords)
    const projBuf = new Float32Array(12);

    // ═══ 2. SPARK DUST MOTES ═══
    interface Mote {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const motes: Mote[] = [];
    const moteCount = isMobile ? 30 : 65;
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4 - 0.3,
        size: 2.0 + Math.random() * 3.0,
        alpha: 0.35 + Math.random() * 0.55,
        color: i % 4 === 0 ? "#9D00FF" : i % 4 === 1 ? "#FFB800" : i % 4 === 2 ? "#00F0FF" : "#FF007F",
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

      // ── LAYER 1: 3D FLOATING OCTAHEDRONS ──
      for (let i = 0; i < crystals.length; i++) {
        const c = crystals[i];
        c.rotX += c.vRotX;
        c.rotY += c.vRotY;
        c.rotZ += c.vRotZ;

        const effectiveX = c.x + mouseX * 80;
        const effectiveY = c.y + mouseY * 50;

        const scale = fov / (fov + c.z);
        const projX = centerX + effectiveX * scale;
        const projY = centerY + effectiveY * scale;

        if (projX < -60 || projX > width + 60 || projY < -60 || projY > height + 60) continue;

        ctx.save();
        ctx.translate(projX, projY);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.5 * scale;
        ctx.globalAlpha = Math.min(0.75, 0.9 * scale);

        const cosY = Math.cos(c.rotY);
        const sinY = Math.sin(c.rotY);
        const cosX = Math.cos(c.rotX);
        const sinX = Math.sin(c.rotX);

        // Project 6 vertices in-place into Float32Array
        for (let v = 0; v < 6; v++) {
          const vx = c.rawVerts[v * 3];
          const vy = c.rawVerts[v * 3 + 1];
          const vz = c.rawVerts[v * 3 + 2];

          const rotVx = vx * cosY - vz * sinY;
          const rotVz = vx * sinY + vz * cosY;
          const rotVy = vy * cosX - rotVz * sinX;

          projBuf[v * 2] = rotVx * scale;
          projBuf[v * 2 + 1] = rotVy * scale;
        }

        // Top Pyramid Edges
        for (let j = 1; j <= 4; j++) {
          ctx.beginPath();
          ctx.moveTo(projBuf[0], projBuf[1]);
          ctx.lineTo(projBuf[j * 2], projBuf[j * 2 + 1]);
          ctx.stroke();

          const next = j === 4 ? 1 : j + 1;
          ctx.beginPath();
          ctx.moveTo(projBuf[j * 2], projBuf[j * 2 + 1]);
          ctx.lineTo(projBuf[next * 2], projBuf[next * 2 + 1]);
          ctx.stroke();

          // Bottom Pyramid Edges
          ctx.beginPath();
          ctx.moveTo(projBuf[10], projBuf[11]);
          ctx.lineTo(projBuf[j * 2], projBuf[j * 2 + 1]);
          ctx.stroke();
        }

        ctx.restore();
      }

      // ── LAYER 2: CREATIVE SPARK DUST MOTES ──
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx + mouseX * 0.6;
        m.y += m.vy + mouseY * 0.6;

        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        ctx.fillStyle = m.color;
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
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

