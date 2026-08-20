"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Flame, 
  Shield, 
  Compass, 
  Cpu, 
  Globe, 
  Gamepad2, 
  Building2, 
  ArrowUpRight, 
  Heart, 
  Briefcase 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function StudioPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-28">
        {/* Page Hero Banner */}
        <section className="container-site relative pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
              <span>INDEPENDENT 3D & 2D GAME STUDIO</span>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7rem text-white leading-[0.88] font-heading">
              FORGING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300">WORLDS</span> BEYOND REALITY
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-relaxed sm:text-xl font-sans">
              Dragon Studios is an independent game development studio dedicated to crafting high-performance, original 3D & 2D action games for PC and Mobile platforms.
            </p>
          </div>
        </section>

        {/* Studio Philosophy Section */}
        <section className="container-site relative z-10 py-16 border-t border-b border-cyan-500/20">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                OUR VISION & PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-heading leading-tight">
                PLAYER-FIRST GAMEPLAY & ORIGINAL WORLDS
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Dragon Studios was built to create high-octane gaming experiences with fluid mechanics, responsive combat, and deep storytelling.
              </p>
              <p className="text-base text-slate-300 leading-relaxed">
                From dark fantasy mythical realms in Dragon Slayer 3D to high-speed anti-gravity racing in Cyber Drift 3D, our focus is delivering genuine gameplay without compromise.
              </p>
            </div>

            <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#040D24]/90 p-6 border border-cyan-500/30 backdrop-blur-md">
                <span className="text-4xl font-black font-heading text-cyan-400">3+</span>
                <h3 className="mt-2 text-base font-bold uppercase text-white">Original Franchises</h3>
                <p className="mt-1 text-xs text-slate-400">Dragon Slayer 3D, Cyber Drift 3D, Shadow Ninja 2D.</p>
              </div>

              <div className="rounded-2xl bg-[#040D24]/90 p-6 border border-cyan-500/30 backdrop-blur-md">
                <span className="text-4xl font-black font-heading text-sky-400">100%</span>
                <h3 className="mt-2 text-base font-bold uppercase text-white">Cross-Platform Ready</h3>
                <p className="mt-1 text-xs text-slate-400">Native Windows PC (.exe) & Android Mobile (.apk).</p>
              </div>

              <div className="rounded-2xl bg-[#040D24]/90 p-6 border border-cyan-500/30 backdrop-blur-md">
                <span className="text-4xl font-black font-heading text-purple-400">120 FPS</span>
                <h3 className="mt-2 text-base font-bold uppercase text-white">High Refresh Smoothness</h3>
                <p className="mt-1 text-xs text-slate-400">Optimized GPU shaders & ultra-responsive input handling.</p>
              </div>

              <div className="rounded-2xl bg-[#040D24]/90 p-6 border border-cyan-500/30 backdrop-blur-md">
                <span className="text-4xl font-black font-heading text-emerald-400">Direct</span>
                <h3 className="mt-2 text-base font-bold uppercase text-white">Community Driven</h3>
                <p className="mt-1 text-xs text-slate-400">Regular developer dispatches and player feedback loops.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="container-site relative z-10 py-20">
          <div className="mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              CORE PRINCIPLES
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-white font-heading">
              WHAT DRIVES OUR GAMES
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-[#040D24]/80 p-6 border border-cyan-500/25 space-y-3">
              <Gamepad2 className="size-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-heading uppercase">Fluid Gameplay First</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Responsive controls and intuitive game loops that respect player time and reward mastery.
              </p>
            </div>

            <div className="rounded-2xl bg-[#040D24]/80 p-6 border border-cyan-500/25 space-y-3">
              <Cpu className="size-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white font-heading uppercase">Optimized Performance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lightweight builds engineered to run smoothly across gaming rigs and mobile devices alike.
              </p>
            </div>

            <div className="rounded-2xl bg-[#040D24]/80 p-6 border border-cyan-500/25 space-y-3">
              <Globe className="size-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-heading uppercase">Original Mythologies</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crafting distinct fictional universes, from dragon-forged kingdoms to neon-lit futures.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
