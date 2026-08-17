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
  ArrowUpRight 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { Button } from "@/components/ui/button";

const COMMUNITY_EVENTS = [
  {
    id: "ev-1",
    title: "Embers of Valyria: Global Archon Invitational 2026",
    game: "Embers of Valyria",
    type: "ESPORTS TOURNAMENT",
    date: "August 28, 2026 • 18:00 UTC",
    prize: "$100,000 GTD",
    location: "Twitch / YouTube Gaming / Online",
    participants: 1240,
    maxParticipants: 2048,
    description: "32-bracket double elimination 1v1 melee tournament with live developer casting and physical dragon trophies.",
    status: "REGISTRATION OPEN",
  },
  {
    id: "ev-2",
    title: "Dragon Engine v5.5 Developer Architecture Q&A",
    game: "Dragon Engine",
    type: "DEV DISPATCH",
    date: "September 5, 2026 • 20:00 UTC",
    prize: "Engine Early Access Key",
    location: "#announcements & Discord Stage",
    participants: 4820,
    maxParticipants: 10000,
    description: "Live interactive deep-dive with Lead Netcode Engineers on deterministic physics and GPU memory streaming.",
    status: "REGISTRATION OPEN",
  },
  {
    id: "ev-3",
    title: "Neon Drift: Overdrive Track Modding Contest",
    game: "Neon Drift",
    type: "CREATOR JAM",
    date: "September 15, 2026 • All Week",
    prize: "$25,000 + Studio Feature",
    location: "Studio Mod Portal",
    participants: 610,
    maxParticipants: 1000,
    description: "Build the most electrifying futuristic synthwave track using our in-game voxel terrain tools.",
    status: "COMING SOON",
  },
];

export default function CommunityEventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<{ [id: string]: boolean }>({});

  const handleRegister = (id: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        <CommunityNav />

        <section className="container-site relative z-10 my-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Tournaments & Live Streams
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight mt-1">
              Community Events & Esports
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Compete in official studio tournaments, register for developer Q&As, and win exclusive prizes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMMUNITY_EVENTS.map((event) => {
              const isRegistered = registeredEvents[event.id];

              return (
                <div
                  key={event.id}
                  className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 border border-blue-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-6 shadow-xl shadow-black/50 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-600/20 text-cyan-300 border border-blue-500/30 uppercase">
                        {event.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">{event.prize}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-slate-800 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-cyan-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-blue-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-emerald-400" />
                        <span>
                          {event.participants + (isRegistered ? 1 : 0)} / {event.maxParticipants} Registered
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRegister(event.id)}
                    variant={isRegistered ? "glass" : "glow"}
                    className="w-full rounded-2xl text-xs font-bold gap-2"
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>Registered & Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="size-4" />
                        <span>Register for Event</span>
                      </>
                    )}
                  </Button>
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
