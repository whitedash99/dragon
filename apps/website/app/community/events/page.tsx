"use client";

import React, { useState } from "react";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Zap,
  Globe
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CommunityNav } from "@/components/community/CommunityNav";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

const REAL_COMMUNITY_EVENTS = [
  {
    id: "ev-1",
    title: "UNCHARTED DRIVE: BEYOND — Global Highway Speed Trials",
    game: "UNCHARTED DRIVE: BEYOND",
    type: "SPEEDRUN & TIME TRIAL",
    date: "Season 1 Active",
    prize: "Dragon ID Legend Badge & Hall of Fame Placement",
    location: "Global Leaderboards (PC & Android)",
    description: "Compete for the fastest lap time on majestic mountain highways and sunset asphalt with ultra-responsive vehicle dynamics.",
    status: "LIVE ACTIVE",
  },
  {
    id: "ev-2",
    title: "Dragon Studios Engineering Keynote & Netcode Deep Dive",
    game: "Dragon Driving 3D Engine",
    type: "DEV DISPATCH",
    date: "Official Stream",
    prize: "Developer Pass & Engine Architecture Intel",
    location: "Studio Transmissions & YouTube",
    description: "Live interactive deep-dive on deterministic physics, volumetric lighting, and cross-platform compilation for PC and Android.",
    status: "SCHEDULED",
  },
];

export default function CommunityEventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<{ [id: string]: boolean }>({});

  const handleRegister = (id: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative font-mono">
      <Navbar />
      <DragonAtmosphere world="core" />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24 z-10">
        <CommunityNav />

        <section className="container-site relative z-10 my-8 px-4 sm:px-6">
          <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              STUDIO TRIALS & TOURNAMENTS
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
              Community Events & Tournaments
            </h1>
            <p className="text-xs text-slate-400">
              Official high-speed challenges, developer broadcasts, and time trials for UNCHARTED DRIVE: BEYOND.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {REAL_COMMUNITY_EVENTS.map((event) => {
              const isRegistered = registeredEvents[event.id];

              return (
                <div
                  key={event.id}
                  className="rounded-3xl bg-[#03091D]/90 backdrop-blur-xl p-6 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(0,229,255,0.15)] group font-mono"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 uppercase">
                        {event.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-300">
                        <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>{event.status}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-cyan-500/20 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="size-3.5 text-cyan-400 shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="size-3.5 text-cyan-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <Trophy className="size-3.5 text-amber-400 shrink-0" />
                        <span>{event.prize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={isRegistered}
                    className={`w-full py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      isRegistered
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>REGISTERED IN DATABASE</span>
                      </>
                    ) : (
                      <>
                        <span>ENTER CHALLENGE</span>
                        <ArrowUpRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
