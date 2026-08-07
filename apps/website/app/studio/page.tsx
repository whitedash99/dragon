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
  Award, 
  Users, 
  Building2, 
  ArrowUpRight, 
  Heart, 
  Briefcase 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { studioStory } from "@/data/content";
import { leadershipTeam } from "@/data/expandedContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function StudioPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-28">
        {/* Page Hero Banner */}
        <section className="container-site relative pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400">
              <Sparkles className="size-3.5" />
              <span>Studio Manifesto & Vision</span>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7rem text-white leading-[0.85]">
              Forging <span className="text-gradient">Impossible</span> Worlds
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Dragon Studios is an independent AAA collective making player-first, systemic action experiences engineered to stay with you long after the screen goes dark.
            </p>
          </div>
        </section>

        {/* Company History & Manifesto Section */}
        <section className="container-site relative z-10 py-20 border-t border-b border-white/10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Our Genesis & Philosophy
              </span>
              <h2 className="mt-3 text-4xl font-black uppercase text-white sm:text-5xl leading-tight">
                Rejecting Generic Industrial Game Loops
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                Founded in 2023 by veteran architects from Sony Santa Monica, CD Projekt Red, and Ubisoft, Dragon Studios was established with a clear mandate: build proprietary technology that liberates creative expression.
              </p>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                We refuse to ship pre-baked linear content packages. Instead, we engineer systemic AI, volumetric destruction, and high-performance C++ engines that respond dynamically to individual player decisions.
              </p>
            </div>

            <div className="lg:col-span-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <span className="text-4xl font-black text-dragon-400">03</span>
                <h3 className="mt-2 text-lg font-bold text-white">AAA Titles in Active Production</h3>
                <p className="mt-1 text-xs text-muted-foreground">Embers of Valyria, Neon Drift, and Blacksite Zero.</p>
              </div>

              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <span className="text-4xl font-black text-neon-cyan">350+</span>
                <h3 className="mt-2 text-lg font-bold text-white">Global Developers</h3>
                <p className="mt-1 text-xs text-muted-foreground">Working across Bengaluru, Montreal, and London.</p>
              </div>

              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <span className="text-4xl font-black text-neon-purple">100%</span>
                <h3 className="mt-2 text-lg font-bold text-white">Proprietary Tech</h3>
                <p className="mt-1 text-xs text-muted-foreground">Custom C++20 Dragon Engine architecture.</p>
              </div>

              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <span className="text-4xl font-black text-amber-400">0.00ms</span>
                <h3 className="mt-2 text-lg font-bold text-white">Zero Garbage Collection</h3>
                <p className="mt-1 text-xs text-muted-foreground">Data-oriented ECS runtime for ultra low latency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Operating Principles
            </span>
            <h2 className="mt-2 text-4xl font-black uppercase text-white">
              Studio Core Values
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Technological Mastery", desc: "We build our own engine tools to unlock artistic fidelity impossible on middleware.", icon: Cpu, color: "text-dragon-400" },
              { title: "Creative Autonomy", desc: "Cross-functional feature strike teams have full ownership over world design.", icon: Compass, color: "text-neon-cyan" },
              { title: "Zero-Crunch Culture", desc: "Predictable production cycles, robust architecture, and respect for human lives.", icon: Heart, color: "text-neon-pink" },
              { title: "Player-Centric Systems", desc: "Every game mechanic must respect player time, skill, and creative agency.", icon: Shield, color: "text-amber-400" },
            ].map((val, idx) => (
              <div key={idx} className="rounded-2xl glass-md p-8 border border-white/10 hover:border-white/20 transition-all">
                <val.icon className={cn("size-8 mb-6", val.color)} />
                <h3 className="text-xl font-bold text-white">{val.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Development History Timeline */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Chronological Progress
            </span>
            <h2 className="mt-2 text-4xl font-black uppercase text-white">
              Studio Milestones
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {studioStory.timeline.map((item) => (
              <div key={item.year} className="relative rounded-2xl glass-heavy p-8 border border-white/10">
                <span className="text-3xl font-black text-dragon-400">{item.year}</span>
                <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Offices Section */}
        <section className="container-site relative z-10 py-24 border-b border-white/10">
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Global Locations
            </span>
            <h2 className="mt-2 text-4xl font-black uppercase text-white">
              Studio Campuses
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                city: "Bengaluru, India",
                title: "Dragon HQ & Engineering Campus",
                focus: "Core Engine R&D, 60-Camera Motion Capture Stage, High-Performance Compute Cluster.",
                type: "Primary Campus / Hybrid",
              },
              {
                city: "Montreal, Canada",
                title: "World Design & Shader Hub",
                focus: "Photoreal Environment Art, Procedural Shaders, Volumetric Weather Systems.",
                type: "Creative Hub / Remote",
              },
              {
                city: "London, UK",
                title: "Narrative & Sound Architecture",
                focus: "World Lore, Dialogue Systems, 3D Spatial Audio & Dolby Atmos Mixing Suites.",
                type: "Production Hub / Hybrid",
              },
            ].map((office, idx) => (
              <div key={idx} className="rounded-2xl glass-lg p-8 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Building2 className="size-6 text-dragon-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2.5 py-1 rounded border border-white/5">
                      {office.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{office.city}</h3>
                  <span className="block text-xs font-semibold text-dragon-300 mt-1">{office.title}</span>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{office.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Section */}
        <section className="container-site relative z-10 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Executive Leadership
              </span>
              <h2 className="mt-2 text-4xl font-black uppercase text-white">
                Studio Leadership
              </h2>
            </div>
            <Button variant="glow" size="sm" className="rounded-full gap-2" asChild>
              <Link href="/careers">
                <Briefcase className="size-4" />
                <span>Join Our Team</span>
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="rounded-2xl glass-md p-8 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className={cn("h-16 w-16 rounded-2xl bg-gradient-to-br mb-6 flex items-center justify-center font-black text-xl text-white shadow-lg", member.avatarColor)}>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <span className="block text-xs font-semibold text-dragon-400 mt-1">{member.role}</span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5">{member.location}</span>
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-muted-foreground font-mono">
                  PREVIOUS: {member.previousStudio}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
