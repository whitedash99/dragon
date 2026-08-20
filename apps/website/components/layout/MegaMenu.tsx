"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Cpu, ChevronDown, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { games } from "@/data/content";

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<"games" | "studio" | null>(null);

  return (
    <div 
      className="relative hidden xl:flex items-center gap-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <Link href="/" className="hover:text-white transition-colors py-2">
        Home
      </Link>

      {/* Games Mega Menu Trigger */}
      <div className="relative py-2" onMouseEnter={() => setActiveMenu("games")}>
        <Link href="/games" className="inline-flex items-center gap-1 hover:text-white transition-colors">
          <span>Games</span>
          <ChevronDown className={`size-3.5 transition-transform duration-200 ${activeMenu === "games" ? "rotate-180 text-dragon-400" : ""}`} />
        </Link>
      </div>

      {/* Studio Mega Menu Trigger */}
      <div className="relative py-2" onMouseEnter={() => setActiveMenu("studio")}>
        <Link href="/studio" className="inline-flex items-center gap-1 hover:text-white transition-colors">
          <span>Studio</span>
          <ChevronDown className={`size-3.5 transition-transform duration-200 ${activeMenu === "studio" ? "rotate-180 text-dragon-400" : ""}`} />
        </Link>
      </div>

      <Link href="/community" className="hover:text-white transition-colors py-2">
        Community
      </Link>

      <Link href="/news" className="hover:text-white transition-colors py-2">
        News
      </Link>

      <Link href="/careers" className="hover:text-white transition-colors py-2">
        Careers
      </Link>

      <Link href="/contact" className="hover:text-white transition-colors py-2">
        Contact
      </Link>

      {/* Mega Menu Dropdown Box */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] rounded-3xl glass-heavy p-6 border border-white/15 shadow-2xl z-50 overflow-hidden"
          >
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-dragon-400 via-neon-purple to-neon-cyan" 
            />

            {activeMenu === "games" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-dragon-400 flex items-center gap-1.5">
                    <Gamepad2 className="size-4" />
                    <span>Dragon Studios Flagship Titles</span>
                  </span>
                  <Link href="/games" className="text-xs text-white hover:text-dragon-300 flex items-center gap-1 font-mono">
                    <span>View All Catalog</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {games.slice(0, 4).map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.slug}`}
                      className="group rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-dragon-500/40 hover:bg-white/10 transition-all flex items-start gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dragon-500/30 to-neon-purple/30 text-white font-black border border-white/10 group-hover:scale-105 transition-transform">
                        {game.title[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-dragon-300 transition-colors">
                          {game.title}
                        </h4>
                        <span className="text-[10px] font-mono text-dragon-400 block mb-1">{game.genre}</span>
                        <p className="text-xs text-muted-foreground line-clamp-1">{game.subtitle || game.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeMenu === "studio" && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-dragon-400 flex items-center gap-1.5">
                    <Cpu className="size-4" />
                    <span>Dragon Engine & Global Studios</span>
                  </span>
                  <Link href="/studio" className="text-xs text-white hover:text-dragon-300 flex items-center gap-1 font-mono">
                    <span>Studio Story</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                    <Sparkles className="size-5 text-cyan-400 mb-2" />
                    <strong className="block text-white text-sm">3D & 2D Core</strong>
                    <p className="text-[11px] text-muted-foreground mt-1">High-performance graphics and unscripted physical mechanics.</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                    <Cpu className="size-5 text-neon-cyan mb-2" />
                    <strong className="block text-white text-sm">Dragon Engine</strong>
                    <p className="text-[11px] text-muted-foreground mt-1">Proprietary high-performance ECS runtime & procedural destruction.</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                    <ShieldCheck className="size-5 text-emerald-400 mb-2" />
                    <strong className="block text-white text-sm">Global Studios</strong>
                    <p className="text-[11px] text-muted-foreground mt-1">Campus hubs in Bengaluru, Montreal, London, and Tokyo.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
