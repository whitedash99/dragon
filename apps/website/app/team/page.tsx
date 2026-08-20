"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Sparkles, Gamepad2, Shield, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function Team() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <main id="main-content" className="cinematic-page min-h-screen overflow-x-hidden pb-32 pt-28">
        <section className="container-site relative pb-16 pt-12 lg:pb-24 lg:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-6">
            <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
            <span>DRAGON STUDIOS CREATORS</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.66fr] lg:items-end">
            <div>
              <h1 className="font-heading text-5xl font-black uppercase leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300">DRAGON</span> TEAM
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:pb-2 sm:text-lg">
              An independent team of passionate developers, artists, and creators building original 3D & 2D games for PC and Mobile.
            </p>
          </div>
        </section>

        <section className="container-site">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Core Card 1: Studio Founder */}
            <article className="group relative rounded-3xl bg-[#040D24]/90 border border-cyan-500/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                  FOUNDER & ARCHITECT
                </span>
                <Sparkles className="size-4 text-cyan-400" />
              </div>
              <div className="mt-8 space-y-2">
                <div className="size-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center font-black text-2xl text-white font-heading shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                  DG
                </div>
                <h2 className="font-heading text-3xl font-black uppercase text-white tracking-tight pt-2">
                  SNIGDHAV
                </h2>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                  CREATOR & STUDIO LEAD
                </p>
              </div>
            </article>

            {/* Core Card 2: Core Dev Collective */}
            <article className="group relative rounded-3xl bg-[#040D24]/90 border border-cyan-500/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
                  CORE TEAM
                </span>
                <Gamepad2 className="size-4 text-blue-400" />
              </div>
              <div className="mt-8 space-y-2">
                <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-2xl text-white font-heading shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  DT
                </div>
                <h2 className="font-heading text-3xl font-black uppercase text-white tracking-tight pt-2">
                  DRAGON CORE SQUAD
                </h2>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                  GAMEPLAY, ART & AUDIO
                </p>
              </div>
            </article>

            {/* Core Card 3: Join the Journey */}
            <article className="group relative rounded-3xl bg-gradient-to-br from-blue-950/80 via-[#061430] to-[#02050E] border border-cyan-500/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                  COLLABORATE
                </span>
                <ArrowUpRight className="size-4 text-cyan-400" />
              </div>
              <div className="space-y-4">
                <h2 className="font-heading text-3xl font-black uppercase text-white tracking-tight">
                  BUILD WORLDS WITH US
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  We are always open to collaborating with passionate 3D/2D artists, modders, and game testers.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-heading font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform"
                >
                  <span>GET IN TOUCH</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </SceneBackground>
  );
}
