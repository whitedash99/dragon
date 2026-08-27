"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Compass, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

export interface PersonalizedWelcomeBarProps {
  initialUser?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function PersonalizedWelcomeBar({ initialUser }: PersonalizedWelcomeBarProps) {
  const { data: session } = useSession();
  const user = session?.user || initialUser;

  if (!user) return null;

  const displayName = user.name || user.email?.split("@")[0] || "Player";

  return (
    <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 pt-24 -mb-16">
      <div className="rounded-2xl bg-[#040D24]/95 border border-cyan-500/30 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <UserCheck className="size-4.5 text-cyan-300" />
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-400">
                WELCOME BACK, {(typeof displayName === "string" ? displayName : "PLAYER").toUpperCase()}
              </span>
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Continue your Dragon experience or explore the latest public catalog releases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <Link
            href="/games"
            onClick={() => soundFx.playClick()}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="size-3.5 text-cyan-400" />
            <span>Explore Games</span>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-mono font-black uppercase transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <LayoutDashboard className="size-3.5" />
            <span>Open Dashboard</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
