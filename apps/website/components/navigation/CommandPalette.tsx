"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Gamepad2, FileText, Settings, User, Download, Home, ArrowRight, X, ShieldCheck, Mail, Briefcase } from "lucide-react";
import { cn } from "@/lib/cn";
import { soundFx } from "@/lib/sound-effects";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Games" | "Support & Studio";
  href: string;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dbGames, setDbGames] = useState<any[]>([]);
  const router = useRouter();

  // Load real published games from PostgreSQL API
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.games)) {
          setDbGames(data.games);
        }
      })
      .catch(() => {});
  }, []);

  // Global Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        soundFx.playClick();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const defaultNavigationItems: CommandItem[] = [
    { id: "nav-home", title: "Home", subtitle: "Dragon Gaming Studios Portal", category: "Navigation", href: "/", icon: <Home className="size-4 text-cyan-400" /> },
    { id: "nav-games", title: "Games Directory", subtitle: "Flagship portfolio & releases", category: "Navigation", href: "/games", icon: <Gamepad2 className="size-4 text-blue-400" /> },
    { id: "nav-downloads", title: "Downloads & Builds", subtitle: "Direct PC & APK Binaries", category: "Navigation", href: "/downloads", icon: <Download className="size-4 text-emerald-400" /> },
    { id: "nav-careers", title: "Careers", subtitle: "Join Dragon Gaming Studios", category: "Navigation", href: "/careers", icon: <Briefcase className="size-4 text-amber-400" /> },
    { id: "nav-community", title: "Community Hub", subtitle: "Forums & Live Dispatches", category: "Navigation", href: "/community", icon: <User className="size-4 text-violet-400" /> },
    { id: "nav-contact", title: "Contact Studio", subtitle: "Player & Business Inquiries", category: "Support & Studio", href: "/contact", icon: <Mail className="size-4 text-rose-400" /> },
    { id: "nav-track", title: "Track Ticket", subtitle: "Check support status", category: "Support & Studio", href: "/track-ticket", icon: <ShieldCheck className="size-4 text-teal-400" /> },
  ];

  const gameItems: CommandItem[] = dbGames.map((g) => ({
    id: `game-${g.id || g.slug}`,
    title: g.title || g.name,
    subtitle: `${g.genre} • ${g.status || "Live"}`,
    category: "Games",
    href: `/games/${g.slug}`,
    icon: <Gamepad2 className="size-4 text-cyan-400" />,
  }));

  const allItems = [...defaultNavigationItems, ...gameItems];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    soundFx.playClick();
    setOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const handleKeyDownMenu = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/85 px-4 pt-20 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#090D16]/98 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownMenu}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-3.5">
              <Search className="size-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search games, routes, and downloads..."
                className="w-full bg-transparent text-sm sm:text-base font-sans text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-slate-500">
                  NO CANONICAL RESULTS FOUND
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-cyan-500/15 border border-cyan-500/30 text-white shadow-sm"
                          : "text-slate-300 hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "size-8 rounded-xl flex items-center justify-center shrink-0 border",
                          isSelected ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300" : "bg-white/5 border-white/10 text-slate-400"
                        )}>
                          {item.icon}
                        </div>
                        <div className="truncate">
                          <div className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-tight truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] font-sans text-slate-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          {item.category}
                        </span>
                        <ArrowRight className={cn("size-3.5 transition-transform", isSelected ? "text-cyan-400 translate-x-0.5" : "text-slate-600")} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] font-mono text-slate-500 bg-black/40">
              <span>Use ↑ ↓ to navigate</span>
              <span>ESC to dismiss</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
