"use client";

import React, { useState } from "react";
import { Search, HelpCircle, FileText, ChevronRight, Download, Monitor, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { cn } from "@/lib/cn";

export default function CommunityKnowledgePage() {
  const [query, setQuery] = useState("");

  const articles = [
    { title: "Dragon Launcher Troubleshooting & DirectX 12 Fixes", cat: "Launcher & Installs", read: "3 min" },
    { title: "How to Enable 120 FPS High Refresh Rate Mode in Neon Drift", cat: "Performance & FPS", read: "2 min" },
    { title: "Embers of Valyria Stance Parry Timing & Controls Map", cat: "Gameplay Guides", read: "5 min" },
    { title: "Setting Up 2FA & Account Protection on Dragon Account", cat: "Account & Security", read: "4 min" },
  ];

  const filtered = articles.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        <section className="container-site relative z-10">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Player Support & Guides
            </span>
            <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl mt-1">
              Knowledge Base
            </h1>

            {/* Search Input */}
            <div className="relative mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search troubleshooting guides, launcher FAQs, controls..."
                className="w-full rounded-2xl glass-heavy px-5 py-4 pl-12 text-sm text-white placeholder:text-muted-foreground border border-white/20 focus:outline-none focus:border-dragon-400"
              />
            </div>
          </div>

          {/* Articles List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map((art, idx) => (
              <div key={idx} className="rounded-2xl glass-heavy p-6 border border-white/10 flex items-center justify-between hover:border-white/25 transition-all cursor-pointer">
                <div>
                  <span className="text-[10px] font-bold uppercase text-dragon-400 font-mono block mb-1">{art.cat}</span>
                  <h3 className="text-base font-bold text-white">{art.title}</h3>
                  <span className="text-xs text-muted-foreground">{art.read} read</span>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
