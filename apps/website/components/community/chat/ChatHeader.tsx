"use client";

import React from "react";
import { 
  Hash, 
  Users, 
  Menu, 
  Pin, 
  Search, 
  Sparkles, 
  Activity, 
  Bell, 
  ShieldCheck 
} from "lucide-react";
import { ConnectionState } from "@/hooks/useRealtimeChat";
import { cn } from "@/lib/cn";

interface ChatHeaderProps {
  roomName: string;
  roomDescription?: string | null;
  connectionStatus: ConnectionState;
  onToggleMembers: () => void;
  onToggleChannels: () => void;
  onOpenSearch?: () => void;
  showMembers: boolean;
  onlineCount: number;
}

export function ChatHeader({
  roomName,
  roomDescription,
  connectionStatus,
  onToggleMembers,
  onToggleChannels,
  onOpenSearch,
  showMembers,
  onlineCount,
}: ChatHeaderProps) {
  return (
    <header className="h-16 bg-[#07111F]/90 backdrop-blur-xl border-b border-blue-500/20 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 select-none">
      {/* ═══ Left: Channel Name & Topic ═══ */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Channel Drawer Button */}
        <button
          onClick={onToggleChannels}
          className="lg:hidden p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-slate-300 hover:text-white transition-all shrink-0"
          title="Open Channels"
        >
          <Menu className="size-4 text-cyan-400" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            <Hash className="size-4" />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-sm uppercase text-white tracking-wide truncate">
                {roomName}
              </h1>
              {/* Connection Status Badge */}
              <div
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border",
                  connectionStatus === "CONNECTED"
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                    : connectionStatus === "CONNECTING" || connectionStatus === "RECONNECTING"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    connectionStatus === "CONNECTED"
                      ? "bg-cyan-400 animate-pulse"
                      : connectionStatus === "CONNECTING" || connectionStatus === "RECONNECTING"
                      ? "bg-amber-400 animate-ping"
                      : "bg-rose-400"
                  )}
                />
                <span>{connectionStatus}</span>
              </div>
            </div>

            {roomDescription && (
              <p className="text-[11px] text-slate-400 font-sans truncate max-w-md hidden md:block">
                {roomDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Right: Actions & Member Drawer Toggle ═══ */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/20 text-slate-400 hover:text-white transition-all"
            title="Search Messages"
          >
            <Search className="size-4 text-slate-300" />
          </button>
        )}

        {/* Toggle Members Drawer */}
        <button
          onClick={onToggleMembers}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all",
            showMembers
              ? "bg-blue-600/20 border-blue-500/40 text-cyan-300 shadow-sm shadow-blue-500/20"
              : "bg-blue-950/40 border-blue-500/20 text-slate-400 hover:text-white"
          )}
          title="Toggle Member Roster"
        >
          <Users className="size-4 text-cyan-400" />
          <span className="hidden sm:inline">{onlineCount} Online</span>
        </button>
      </div>
    </header>
  );
}
