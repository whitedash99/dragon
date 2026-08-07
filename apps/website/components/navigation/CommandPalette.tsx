"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Gamepad2, FileText, Settings, User, Download, Home, ArrowRight, X } from "lucide-react";
import { games } from "@/data/content";
import { cn } from "@/lib/cn";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Games" | "Quick Actions";
  href?: string;
  action?: () => void;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const items: CommandItem[] = [
    { id: "nav-home", title: "Home", subtitle: "Dragon Studios Homepage", category: "Navigation", href: "/", icon: <Home className="size-4 text-dragon-400" /> },
    { id: "nav-games", title: "Games Directory", subtitle: "Browse all portfolio titles", category: "Navigation", href: "/games", icon: <Gamepad2 className="size-4 text-neon-purple" /> },
    { id: "nav-dashboard", title: "User Dashboard", subtitle: "Player statistics & stats", category: "Navigation", href: "/dashboard", icon: <User className="size-4 text-neon-cyan" /> },
    { id: "nav-profile", title: "My Profile", subtitle: "View player profile & level", category: "Navigation", href: "/profile", icon: <User className="size-4 text-amber-400" /> },
    { id: "nav-settings", title: "Account Settings", subtitle: "Security, notifications & preferences", category: "Navigation", href: "/settings", icon: <Settings className="size-4 text-emerald-400" /> },
    { id: "nav-downloads", title: "Dragon Launcher & Downloads", subtitle: "Manage game downloads & patches", category: "Navigation", href: "/downloads", icon: <Download className="size-4 text-neon-blue" /> },
    { id: "nav-studio", title: "About Studio", subtitle: "Dragon Studios manifesto & history", category: "Navigation", href: "/studio", icon: <FileText className="size-4 text-dragon-300" /> },
    ...games.map((g) => ({
      id: `game-${g.id}`,
      title: g.title,
      subtitle: `${g.genre} • ${g.status}`,
      category: "Games" as const,
      href: `/games/${g.slug}`,
      icon: <Gamepad2 className="size-4 text-primary" />,
    })),
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    setOpen(false);
    setQuery("");
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
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
          className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/80 px-4 pt-20 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownMenu}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(30,21,23,0.98),rgba(10,10,12,0.98)_45%)] p-5 shadow-[0_32px_100px_rgba(0,0,0,0.62)]"
          >
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-dragon-500/20 blur-3xl" />
            {/* Input Header */}
            <div className="relative flex items-center rounded-xl border border-white/10 bg-black/30 px-4 py-3 shadow-inner shadow-black/20">
              <Search className="mr-3 size-5 text-gold-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search games, pages..."
                className="w-full bg-transparent text-base text-white placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Command List Results */}
            <div className="mt-3 max-h-80 overflow-y-auto space-y-1 pr-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No commands matching &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm transition-colors",
                        isSelected ? "border-dragon-300/30 bg-primary/90 text-white shadow-lg shadow-dragon-500/15" : "border-transparent text-muted-foreground hover:border-white/8 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                          {item.icon}
                        </div>
                        <div>
                          <span className="block font-semibold text-white">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                        </div>
                      </div>
                      <ArrowRight className={cn("size-4 opacity-0 transition-opacity", isSelected && "opacity-100")} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Shortcut Bar */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Command className="size-3 text-dragon-400" />
                <span>Dragon Command Palette</span>
              </span>
              <span>Use ↑ ↓ to navigate, Enter to select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
