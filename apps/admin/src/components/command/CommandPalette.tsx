"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/providers/workspace-context";
import {
  Search,
  Globe,
  Gamepad2,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  Users,
  Trophy,
  Layers,
  Activity,
  Shield,
  Settings,
  ArrowRight,
  Radio,
  FileDown,
  X,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "WORKSPACES" | "PAGES" | "ACTIONS" | "SYSTEM";
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { switchWorkspace, activeWorkspace } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [open]);

  const items: CommandItem[] = [
    // Workspaces
    {
      id: "ws-studio",
      title: "Switch to Dragon Gaming Studio (Main Studio Hub)",
      category: "WORKSPACES",
      icon: Globe,
      badge: "Studio Hub",
      keywords: "studio website cms pages company releases",
      action: () => {
        switchWorkspace("STUDIO_HUB", true);
        setOpen(false);
      },
    },
    {
      id: "ws-games",
      title: "Switch to Dragon Web Games (Game Platform)",
      category: "WORKSPACES",
      icon: Gamepad2,
      badge: "Game Platform",
      keywords: "games catalog levels players leaderboards achievements",
      action: () => {
        switchWorkspace("WEB_GAMES", true);
        setOpen(false);
      },
    },
    {
      id: "ws-selector",
      title: "Open Universal Workspace Selector",
      category: "WORKSPACES",
      icon: LayoutGrid,
      badge: "Overview",
      keywords: "all workspaces root home",
      action: () => {
        router.push("/workspaces");
        setOpen(false);
      },
    },

    // Studio Hub Pages
    {
      id: "page-studio-overview",
      title: "Studio Hub: Overview & Live Status",
      category: "PAGES",
      icon: Globe,
      keywords: "studio overview status dashboard home",
      action: () => {
        switchWorkspace("STUDIO_HUB", false);
        router.push("/studio");
        setOpen(false);
      },
    },
    {
      id: "page-studio-content",
      title: "Studio Hub: Content & Pages",
      category: "PAGES",
      icon: FileText,
      keywords: "cms pages sections seo articles announcements",
      action: () => {
        switchWorkspace("STUDIO_HUB", false);
        router.push("/studio/content");
        setOpen(false);
      },
    },
    {
      id: "page-studio-media",
      title: "Studio Hub: Media & Brand Assets",
      category: "PAGES",
      icon: ImageIcon,
      keywords: "media images videos documents assets",
      action: () => {
        switchWorkspace("STUDIO_HUB", false);
        router.push("/studio/media");
        setOpen(false);
      },
    },
    {
      id: "page-studio-comms",
      title: "Studio Hub: Communications & Support",
      category: "PAGES",
      icon: Radio,
      keywords: "contact tickets support inquiries news dispatch",
      action: () => {
        switchWorkspace("STUDIO_HUB", false);
        router.push("/studio/communication");
        setOpen(false);
      },
    },

    // Web Games Pages
    {
      id: "page-games-catalog",
      title: "Web Games: Game Catalog & Metadata",
      category: "PAGES",
      icon: Gamepad2,
      keywords: "catalog games drafts published titles uncharted drive",
      action: () => {
        switchWorkspace("WEB_GAMES", false);
        router.push("/games-hub/catalog");
        setOpen(false);
      },
    },
    {
      id: "page-games-levels",
      title: "Web Games: Level Progression & Worlds",
      category: "PAGES",
      icon: Layers,
      keywords: "levels worlds progression stages difficulty",
      action: () => {
        switchWorkspace("WEB_GAMES", false);
        router.push("/games-hub/levels");
        setOpen(false);
      },
    },
    {
      id: "page-games-players",
      title: "Web Games: Registered Players & Telemetry",
      category: "PAGES",
      icon: Users,
      keywords: "players users sessions devices dragon id roster",
      action: () => {
        switchWorkspace("WEB_GAMES", false);
        router.push("/games-hub/players");
        setOpen(false);
      },
    },
    {
      id: "page-games-competition",
      title: "Web Games: Leaderboards & Anti-Cheat",
      category: "PAGES",
      icon: Trophy,
      keywords: "leaderboard scores competition rankings anticheat",
      action: () => {
        switchWorkspace("WEB_GAMES", false);
        router.push("/games-hub/competition");
        setOpen(false);
      },
    },

    // System & Tools
    {
      id: "sys-health",
      title: "System Health & Live Neon DB Probe",
      category: "SYSTEM",
      icon: Activity,
      keywords: "health probe database postgresql latency server",
      action: () => {
        router.push(activeWorkspace === "STUDIO_HUB" ? "/studio/system" : "/games-hub/system");
        setOpen(false);
      },
    },
    {
      id: "sys-audit",
      title: "Audit Center: Chronological Security Logs",
      category: "SYSTEM",
      icon: Shield,
      keywords: "audit logs security signins sessions events",
      action: () => {
        router.push(activeWorkspace === "STUDIO_HUB" ? "/studio/system" : "/games-hub/system");
        setOpen(false);
      },
    },
    {
      id: "sys-settings",
      title: "Studio Settings & Administrators",
      category: "SYSTEM",
      icon: Settings,
      keywords: "settings rbac permissions admins configuration",
      action: () => {
        router.push("/studio/settings");
        setOpen(false);
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Search trigger button inside Navbar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all text-slate-400 hover:text-slate-200 text-xs w-56 md:w-64 justify-between"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search or jump to...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-100">
          <div
            className="w-full max-w-xl rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search workspaces, games, players, releases, tools..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching commands or pages found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-xs ${
                        isSelected
                          ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                          : "text-slate-300 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? "text-indigo-400" : "text-slate-400"
                          }`}
                        />
                        <span className="font-medium">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-400 font-mono">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-indigo-400 opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3 font-mono">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="font-semibold text-indigo-400">Dragon Command</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
