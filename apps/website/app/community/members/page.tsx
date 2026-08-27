"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Crown, 
  Code, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Zap,
  Globe
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CommunityNav } from "@/components/community/CommunityNav";
import { cn } from "@/lib/cn";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

interface RealMember {
  clientId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string | null;
  status: string;
}

export default function CommunityMembersPage() {
  const [members, setMembers] = useState<RealMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/chat/members");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      }
    } catch (e) {
      console.warn("Fetch members error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "OWNER" && (m.role === "OWNER" || m.role === "FOUNDER")) ||
      (roleFilter === "STAFF" && (m.role === "DEVELOPER" || m.role === "ADMIN" || m.role === "MODERATOR")) ||
      (roleFilter === "PLAYER" && !["OWNER", "FOUNDER", "DEVELOPER", "ADMIN", "MODERATOR"].includes(m.role));
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative font-mono">
      <Navbar />
      <DragonAtmosphere world="core" />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24 z-10">
        <CommunityNav />

        <section className="container-site relative z-10 my-8 px-4 sm:px-6">
          <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              REAL DRAGON ROSTER
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
              Community Member Directory
            </h1>
            <p className="text-xs text-slate-400">
              Direct PostgreSQL database connection: Real verified staff, operative leads, and registered Dragon ID players.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="rounded-2xl bg-[#03091D]/90 backdrop-blur-xl p-4 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search by gamer tag, name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-[#02050E] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              {["ALL", "OWNER", "STAFF", "PLAYER"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                    roleFilter === role
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "bg-[#02050E] text-slate-400 hover:text-white border border-cyan-500/20"
                  )}
                >
                  {role}
                </button>
              ))}

              <button
                onClick={fetchMembers}
                className="p-2 rounded-xl bg-[#02050E] border border-cyan-500/30 text-cyan-400 hover:text-white"
                title="Refresh Roster"
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="py-20 text-center text-cyan-400 text-xs font-mono animate-pulse">
              Querying real Dragon PostgreSQL database accounts...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs font-mono">
              No registered members found matching criteria.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((member) => {
                const isOwner = member.role === "OWNER" || member.role === "FOUNDER";
                const isStaff = member.role === "DEVELOPER" || member.role === "ADMIN" || member.role === "MODERATOR";

                return (
                  <div
                    key={member.userId || member.clientId}
                    className="rounded-2xl bg-[#03091D]/90 backdrop-blur-xl p-5 border border-cyan-500/30 hover:border-cyan-400/60 transition-all space-y-4 shadow-[0_0_25px_rgba(0,229,255,0.1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0">
                        {member.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.avatar} alt={member.name} className="size-full rounded-2xl object-cover" />
                        ) : (
                          (member.name || member.email)[0].toUpperCase()
                        )}
                        <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-[#03091D]" />
                      </div>

                      <div className="truncate">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5 truncate">
                          <span>{member.name}</span>
                          {isOwner && <Crown className="size-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-cyan-400/80 truncate">{member.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-cyan-500/20 pt-3 text-[11px]">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border",
                        isOwner
                          ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                          : isStaff
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                          : "bg-[#02050E] text-slate-300 border-cyan-500/20"
                      )}>
                        {member.role}
                      </span>
                      <span className="text-slate-400 truncate max-w-[150px]">
                        {member.department}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
