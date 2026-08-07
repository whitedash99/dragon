"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Command, 
  Server, 
  Terminal, 
  TrendingUp, 
  Database, 
  LifeBuoy, 
  Gamepad2, 
  Newspaper, 
  Users, 
  ImageIcon, 
  Bot, 
  ShieldCheck, 
  Globe, 
  Settings, 
  Radio, 
  BookOpen, 
  FileCheck,
  X as XIcon
} from "lucide-react";
import { cn } from "@/lib/cn";

const COMMANDS = [
  { label: "Overview Dashboard", href: "/admin", category: "Core Navigation", icon: Command },
  { label: "Dragon QA Platform", href: "/admin/qa", category: "Core Navigation", icon: FileCheck },
  { label: "Dragon Knowledge Base", href: "/admin/knowledge", category: "Core Navigation", icon: BookOpen },
  { label: "Dragon LiveOps Center", href: "/admin/liveops", category: "Core Navigation", icon: Radio },
  { label: "DragonOps Platform", href: "/admin/devops", category: "Core Navigation", icon: Server },
  { label: "Dragon DevHub", href: "/admin/devhub", category: "Core Navigation", icon: Terminal },
  { label: "Executive BI Center", href: "/admin/bi", category: "Analytics", icon: TrendingUp },
  { label: "Database Manager", href: "/admin/database", category: "Infrastructure", icon: Database },
  { label: "Support CRM", href: "/admin/tickets", category: "Operations", icon: LifeBuoy },
  { label: "Game Manager", href: "/admin/games", category: "CMS", icon: Gamepad2 },
  { label: "News Manager", href: "/admin/news", category: "CMS", icon: Newspaper },
  { label: "User Directory", href: "/admin/users", category: "Security & Auth", icon: Users },
  { label: "Media Library", href: "/admin/media", category: "Assets", icon: ImageIcon },
  { label: "AI Center", href: "/admin/ai", category: "Intelligence", icon: Bot },
  { label: "Security Center", href: "/admin/security", category: "Security & Auth", icon: ShieldCheck },
  { label: "SEO Manager", href: "/admin/seo", category: "Marketing", icon: Globe },
  { label: "System Settings", href: "/admin/settings", category: "Infrastructure", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    setSearch("");
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md font-mono select-none">
      <div className="relative w-full max-w-xl rounded-3xl glass-heavy p-6 border border-white/20 shadow-2xl bg-[#0a090c]/95 space-y-4">
        {/* Search Header */}
        <div className="relative flex items-center border-b border-white/10 pb-4">
          <Search className="size-4 text-[#ff1e4b] shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or jump to module... (Esc to cancel)"
            className="w-full bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white ml-2">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-[350px] overflow-y-auto space-y-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">No matching admin modules found.</div>
          ) : (
            filtered.map((cmd) => {
              const IconComp = cmd.icon;
              return (
                <button
                  key={cmd.href}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-[#ff1e4b] hover:text-white transition-all text-xs text-left group"
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="size-4 text-[#ff1e4b] group-hover:text-white transition-colors" />
                    <span className="font-bold uppercase tracking-wider text-white group-hover:text-white">{cmd.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-white/80 font-bold uppercase">{cmd.category}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Navigation Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">CTRL + K</kbd></span>
          <span>DragonOS Command Matrix</span>
        </div>
      </div>
    </div>
  );
}
