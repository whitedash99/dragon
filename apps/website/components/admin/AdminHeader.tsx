"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Activity, User, LifeBuoy, Gamepad2, FileText, X as XIcon, Command } from "lucide-react";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { CommandPalette } from "./CommandPalette";

export function AdminHeader() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim() || val.trim().length < 2) {
      setResults(null);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
          setOpen(true);
        }
      } catch {
        setResults(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <CommandPalette />

      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b0a0c]/90 px-6 backdrop-blur-xl sm:px-8 font-mono">
        {/* Left Search / Command Trigger */}
        <div ref={searchRef} className="relative flex items-center gap-4">
          <div className="relative w-64 sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#ff1e4b]" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => { if (results) setOpen(true); }}
              placeholder="Search DragonOS... (Press Ctrl + K for Command Matrix)"
              className="w-full rounded-xl bg-black/50 px-3.5 py-2 pl-10 pr-12 text-xs text-white placeholder:text-muted-foreground border border-white/15 focus:outline-none focus:border-[#ff1e4b] transition-all"
            />
            {query ? (
              <button onClick={() => { handleQueryChange(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                <XIcon className="size-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">
                ⌘K
              </span>
            )}
          </div>

          {/* Global Search Results Modal Dropdown */}
          {open && results && (
            <div className="absolute top-12 left-0 w-full sm:w-[480px] rounded-2xl glass-heavy p-4 border border-white/15 bg-black/95 shadow-2xl space-y-4 max-h-[450px] overflow-y-auto text-xs z-50">
              {/* Tickets */}
              {results.tickets && results.tickets.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#ff1e4b] uppercase flex items-center gap-1.5">
                    <LifeBuoy className="size-3.5" /> SUPPORT TICKETS
                  </span>
                  {results.tickets.map((t: any) => (
                    <Link
                      key={t.id}
                      href="/admin/tickets"
                      onClick={() => setOpen(false)}
                      className="block p-2 rounded-xl hover:bg-white/10 transition-colors text-white font-sans"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold font-mono text-[#ff1e4b]">{t.ticketId}</span>
                        <span className="text-[10px] text-muted-foreground">{t.status}</span>
                      </div>
                      <span className="text-xs truncate block">{t.subject}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Users */}
              {results.users && results.users.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
                    <User className="size-3.5" /> USER DIRECTORY
                  </span>
                  {results.users.map((u: any) => (
                    <Link
                      key={u.id}
                      href="/admin/users"
                      onClick={() => setOpen(false)}
                      className="block p-2 rounded-xl hover:bg-white/10 transition-colors text-white font-sans"
                    >
                      <span className="font-bold text-xs">{u.name}</span>
                      <span className="text-[10px] text-muted-foreground block">{u.email}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Games */}
              {results.games && results.games.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1.5">
                    <Gamepad2 className="size-3.5" /> GAMES
                  </span>
                  {results.games.map((g: any) => (
                    <Link
                      key={g.id}
                      href="/admin/games"
                      onClick={() => setOpen(false)}
                      className="block p-2 rounded-xl hover:bg-white/10 transition-colors text-white font-sans"
                    >
                      <span className="font-bold text-xs">{g.title}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Content CMS */}
              {results.content && results.content.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <FileText className="size-3.5" /> WEBSITE CMS BLOCKS
                  </span>
                  {results.content.map((c: any) => (
                    <Link
                      key={c.id}
                      href="/admin/content"
                      onClick={() => setOpen(false)}
                      className="block p-2 rounded-xl hover:bg-white/10 transition-colors text-white font-sans"
                    >
                      <span className="font-bold text-xs font-mono">{c.key}</span>
                      <span className="text-[10px] text-muted-foreground block truncate">{c.content}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Metrics & Profile Badges */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
            <Activity className="size-3.5 animate-pulse" />
            <span>DRAGONOS ONLINE</span>
          </div>

          <NotificationCenter />

          {/* Profile Badge */}
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff1e4b] to-purple-600 text-xs font-black text-white shadow-lg border border-white/20">
              DS
            </div>
            <div className="hidden md:block font-sans">
              <span className="block text-xs font-bold text-white">Dragon Operations</span>
              <span className="text-[10px] text-[#ff1e4b] font-mono">Super Admin</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
