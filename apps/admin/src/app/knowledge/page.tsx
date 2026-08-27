"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { BookOpen, Search, ChevronRight } from "lucide-react";
import { GlassCard, GlassStat, GlassBadge } from "@/components/ui/glass";

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const articles = [
    { title: "Dragon Engine 3D & 2D Game Architecture", category: "Game Dev", reads: 142 },
    { title: "Backblaze B2 Direct Binary Upload Protocol", category: "Infrastructure", reads: 98 },
    { title: "Gemini Vision AI Safe Area Detection System", category: "AI Artwork", reads: 215 },
    { title: "Next.js 15 Targeted Cache Revalidation Guide", category: "Web Ops", reads: 74 },
  ];

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">Dragon Control • Studio Knowledge Base</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Documentation & Engineering Specs</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">Internal protocols, game release standards, and AI pipeline runbooks.</p>
            </div>
          </div>

          <div className="bg-[#03091D]/90 p-3.5 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.15)] max-w-md">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-2.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((art, idx) => (
              <GlassCard key={idx} className="p-5 flex items-center justify-between hover:border-cyan-400 transition-all cursor-pointer group bg-[#03091D]/90 border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#02050E] text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-bold uppercase">{art.category}</span>
                    <h3 className="text-sm font-bold text-white font-mono pt-1">{art.title}</h3>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
