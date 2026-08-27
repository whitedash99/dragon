"use client";

import React, { useEffect, useRef } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface LightningArc {
  segments: { x1: number; y1: number; x2: number; y2: number; width: number }[];
  color: string;
  coreColor: string;
  alpha: number;
  decay: number;
  flashIntensity: number;
  particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[];
}

interface EnergyNode {
  x: number;
  y: number;
  charge: number;
  chargeSpeed: number;
  color: string;
  pulseRadius: number;
}

export function DragonBlueLightningCanvas() {
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

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const isMobile = width < 768;

    const nodes: EnergyNode[] = [];
    const nodeCount = isMobile ? 4 : 7;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (width * 0.1) + Math.random() * (width * 0.8),
        y: (height * 0.15) + Math.random() * (height * 0.7),
        charge: Math.random() * 0.4,
        chargeSpeed: 0.004 + Math.random() * 0.005,
        color: i % 2 === 0 ? "#00E5FF" : "#338BFF",
        pulseRadius: 0,
      });
    }

    const activeArcs: LightningArc[] = [];

    const createSubdividedBranch = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      depth: number,
      displace: number,
      segments: { x1: number; y1: number; x2: number; y2: number; width: number }[]
    ) => {
      if (depth <= 0) {
        segments.push({ x1, y1, x2, y2, width: Math.max(0.8, depth + 1.2) });
        return;
      }

      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;

      createSubdividedBranch(x1, y1, midX, midY, depth - 1, displace * 0.55, segments);
      createSubdividedBranch(midX, midY, x2, y2, depth - 1, displace * 0.55, segments);

      if (Math.random() > 0.65 && depth >= 2) {
        const forkEndX = midX + (Math.random() - 0.5) * displace * 1.5;
        const forkEndY = midY + (Math.random() * displace + 15);
        createSubdividedBranch(midX, midY, forkEndX, forkEndY, depth - 2, displace * 0.4, segments);
      }
    };

    const triggerLightningStrike = (nodeA: EnergyNode, nodeB: EnergyNode, isHighEnergy: boolean) => {
      if (!nodeA || !nodeB) return;
      const segments: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];
      const displace = isHighEnergy ? 55 : 32;
      const depth = isHighEnergy ? 3 : 2;

      createSubdividedBranch(nodeA.x, nodeA.y, nodeB.x, nodeB.y, depth, displace, segments);

      const burstParticles = [];
      const pCount = isHighEnergy ? 12 : 6;
      for (let p = 0; p < pCount; p++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 2.5 + 1.0;
        burstParticles.push({
          x: nodeB.x + (Math.random() - 0.5) * 20,
          y: nodeB.y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          alpha: 1.0,
          size: Math.random() * 2.0 + 1.0,
          color: Math.random() > 0.4 ? "#00E5FF" : "#338BFF",
        });
      }

      activeArcs.push({
        segments,
        color: isHighEnergy ? "#338BFF" : "#00E5FF",
        coreColor: "#E0F2FE",
        alpha: 1.0,
        decay: isHighEnergy ? 0.04 : 0.065,
        flashIntensity: isHighEnergy ? 0.22 : 0.08,
        particles: burstParticles,
      });

      nodeA.charge = 0;
      nodeB.charge = 0;
    };

    let strikeCooldown = 120;

    const render = () => {
      if (!isVisible || !isTabActive) return;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Energy Node Charge Pulses ──
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.charge += node.chargeSpeed;

        if (node.charge > 0.6) {
          node.pulseRadius += 0.4;
          if (node.pulseRadius > 35) node.pulseRadius = 0;

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.globalAlpha = Math.max(0, (1 - node.pulseRadius / 35) * (node.charge - 0.5) * 0.4);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ── 2. Strike Decision Logic ──
      strikeCooldown--;
      if (strikeCooldown <= 0) {
        const chargedNodes = nodes.filter((n) => n.charge >= 0.7);
        if (chargedNodes.length >= 2) {
          const n1 = chargedNodes[Math.floor(Math.random() * chargedNodes.length)];
          let n2 = chargedNodes[Math.floor(Math.random() * chargedNodes.length)];
          if (n1 === n2) {
            n2 = chargedNodes[(chargedNodes.indexOf(n1) + 1) % chargedNodes.length];
          }
          const isHighEnergy = Math.random() > 0.7;
          triggerLightningStrike(n1, n2, isHighEnergy);
          strikeCooldown = Math.floor(Math.random() * 180) + 120;
        } else {
          strikeCooldown = 40;
        }
      }

      // ── 3. Render Active Lightning Arcs ──
      for (let a = activeArcs.length - 1; a >= 0; a--) {
        const arc = activeArcs[a];

        if (arc.flashIntensity > 0) {
          ctx.fillStyle = "rgba(0, 229, 255, 0.08)";
          ctx.globalAlpha = arc.flashIntensity;
          ctx.fillRect(0, 0, width, height);
          arc.flashIntensity -= 0.03;
        }

        ctx.strokeStyle = arc.color;
        ctx.globalAlpha = arc.alpha * 0.8;

        for (let s = 0; s < arc.segments.length; s++) {
          const seg = arc.segments[s];
          ctx.lineWidth = seg.width * 2.2;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        ctx.strokeStyle = arc.coreColor;
        ctx.globalAlpha = arc.alpha;

        for (let s = 0; s < arc.segments.length; s++) {
          const seg = arc.segments[s];
          ctx.lineWidth = seg.width * 0.8;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // ── 4. Render Burst Particles ──
        for (let p = arc.particles.length - 1; p >= 0; p--) {
          const pt = arc.particles[p];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vx *= 0.94;
          pt.vy *= 0.94;
          pt.alpha -= 0.035;

          if (pt.alpha > 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.globalAlpha = pt.alpha;
            ctx.fill();
          } else {
            arc.particles.splice(p, 1);
          }
        }

        arc.alpha -= arc.decay;
        if (arc.alpha <= 0 && arc.particles.length === 0) {
          activeArcs.splice(a, 1);
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
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [tier, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full select-none z-[3]"
    />
  );
}

