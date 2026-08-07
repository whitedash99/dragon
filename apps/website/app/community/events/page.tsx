"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Clock, 
  Users, 
  DollarSign, 
  Tv, 
  Calendar, 
  Check, 
  X, 
  Sparkles 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { communityEvents, CommunityEvent } from "@/data/communityData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function CommunityEventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>(communityEvents);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds([...registeredIds, id]);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        <section className="container-site relative z-10">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Dragon Esports & Dev Streams
            </span>
            <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
              Tournament & Events Center
            </h1>
          </div>

          {/* Events Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {events.map((evt) => {
              const isRegistered = registeredIds.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  className="rounded-3xl glass-heavy p-8 border border-white/15 flex flex-col justify-between relative overflow-hidden group hover:border-white/30 transition-all"
                >
                  <div 
                    aria-hidden="true" 
                    className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-purple via-dragon-400 to-neon-cyan" 
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="rounded-full bg-dragon-500/20 px-3 py-1 text-[10px] font-bold text-dragon-300 border border-dragon-500/30 uppercase tracking-widest">
                        {evt.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Clock className="size-3.5" />
                        <span>{evt.countdownText}</span>
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-white group-hover:text-dragon-200 transition-colors">
                      {evt.title}
                    </h2>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{evt.description}</p>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-white/10">
                      <div>
                        <span className="block text-[10px] text-muted-foreground uppercase">EVENT DATE</span>
                        <strong className="text-white">{evt.date}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground uppercase">ATTENDEES / PLAYERS</span>
                        <strong className="text-white">{evt.registeredPlayers}</strong>
                      </div>
                      {evt.prizePool && (
                        <div>
                          <span className="block text-[10px] text-muted-foreground uppercase">PRIZE GUARANTEE</span>
                          <strong className="text-emerald-400 font-bold">{evt.prizePool}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {isRegistered ? "Pass Dispatched to Launcher" : "Free Player Entry"}
                    </span>

                    <Button
                      onClick={() => handleRegister(evt.id)}
                      variant={isRegistered ? "glass" : "glow"}
                      size="sm"
                      className="rounded-full gap-2 text-xs"
                    >
                      {isRegistered ? (
                        <>
                          <Check className="size-3.5 text-emerald-400" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="size-3.5" />
                          <span>RSVP & Register</span>
                        </>
                      )}
                    </Button>
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
