"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Crown, 
  Code, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Award, 
  Star 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { cn } from "@/lib/cn";

const MOCK_MEMBERS = [
  { id: "m-1", name: "Kaelen Voss", role: "FOUNDER", level: 100, xp: 950000, rep: 99.8, badges: ["Studio Founder", "Lead Architect"], online: true },
  { id: "m-2", name: "Dr. Marcus Vance", role: "DEVELOPER", level: 88, xp: 740000, rep: 98.4, badges: ["Netcode Lead", "Vulkan Guru"], online: true },
  { id: "m-3", name: "Aria Sterling", role: "MODERATOR", level: 75, xp: 520000, rep: 99.1, badges: ["Community Shield", "Event Host"], online: true },
  { id: "m-4", name: "ValkyrieStream", role: "CREATOR", level: 62, xp: 380000, rep: 96.5, badges: ["Verified Creator", "Tourney Finalist"], online: true },
  { id: "m-5", name: "ShadowSniper99", role: "INSIDER ELITE", level: 54, xp: 290000, rep: 94.2, badges: ["Beta Veteran", "Top 100 Racer"], online: false },
  { id: "m-6", name: "NexusBlade", role: "INSIDER", level: 32, xp: 140000, rep: 91.0, badges: ["Early Adopter"], online: true },
];

export default function CommunityMembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        <CommunityNav />

        <section className="container-site relative z-10 my-8">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Insiders Leaderboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight mt-1">
              Community Member Roster
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Browse verified creators, studio developers, moderators, and top insider players.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="rounded-2xl bg-[#07111F]/80 backdrop-blur-xl p-4 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search by member name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-[#0B132B] pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 border border-blue-500/30 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              {["ALL", "FOUNDER", "DEVELOPER", "MODERATOR", "CREATOR", "INSIDER ELITE"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    roleFilter === role
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                      : "bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => {
              const isOwner = member.role === "FOUNDER";
              const isDev = member.role === "DEVELOPER";
              const isMod = member.role === "MODERATOR";

              return (
                <div
                  key={member.id}
                  className="rounded-2xl bg-[#07111F]/80 backdrop-blur-xl p-5 border border-blue-500/20 hover:border-cyan-400/50 transition-all space-y-4 shadow-lg shadow-black/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-cyan-300">
                        {member.name.substring(0, 2).toUpperCase()}
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#07111F]",
                            member.online ? "bg-emerald-400" : "bg-slate-500"
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{member.name}</h4>
                        <div className="text-[10px] text-cyan-400 font-mono">
                          Level {member.level} • {member.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold",
                        isOwner
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          : isDev
                          ? "bg-blue-600/10 text-blue-300 border-blue-500/30"
                          : isMod
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      )}
                    >
                      {member.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {member.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0B132B] border border-blue-500/20 text-slate-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="size-3 fill-amber-400" />
                      <span>{member.rep}% Reputation</span>
                    </span>
                    <span className={member.online ? "text-emerald-400" : "text-slate-500"}>
                      {member.online ? "ONLINE NOW" : "OFFLINE"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
