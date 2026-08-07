"use client";

import React, { useState } from "react";
import { Search, Bell, Shield } from "lucide-react";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-[#08080f]/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between z-20 font-mono text-xs">
      {/* Global Search Bar */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Command Search (Ctrl + K)..."
          className="w-full rounded-xl bg-black/60 px-3.5 py-2 pl-9 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b] transition-colors"
        />
      </div>

      {/* Top Controls */}
      <div className="flex items-center gap-4">
        {/* System Health Badge */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] text-emerald-400 font-bold">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PORT 4000 ONLINE</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white border border-white/10 transition-colors relative"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-[#ff1e4b]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-4 border border-white/15 space-y-3 z-50 shadow-2xl">
              <span className="text-xs font-bold text-white uppercase block border-b border-white/10 pb-2">
                SYSTEM NOTIFICATIONS
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-emerald-400 block">PostgreSQL Online</strong>
                  <span className="text-muted-foreground">Connected to Public Database cluster.</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <strong className="text-[#ff1e4b] block">Gemini 2.5 Active</strong>
                  <span className="text-muted-foreground">Cognitive engine standby.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/10">
          <Shield className="size-3.5 text-[#ff1e4b]" />
          <span className="font-bold text-white uppercase text-[10px]">SUPER ADMIN</span>
        </div>
      </div>
    </header>
  );
}
