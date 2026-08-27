"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Ticket, ArrowRight, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function TrackTicketPage() {
  const router = useRouter();
  const [ticketIdInput, setTicketIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = ticketIdInput.trim();
    if (!cleanQuery) {
      setError("Please enter a valid Ticket Reference ID or Email.");
      return;
    }

    // Direct route to support tracking
    router.push(`/support/${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="container-site relative z-10 py-32 max-w-3xl mx-auto space-y-8 font-sans">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <ShieldCheck className="size-3.5" />
            <span>REAL-TIME SUPPORT TICKET TRACKER</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl font-heading">
            TRACK YOUR SUPPORT TICKET
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Enter your ticket reference ID (e.g. <strong className="text-cyan-300 font-mono">DRG-2026-XXXXXX</strong>) or your registered email address to check live status updates, review response timelines, and communicate directly with the Dragon Studios engineering team.
          </p>
        </div>

        <form onSubmit={handleTrack} className="rounded-3xl bg-[#03091D]/90 p-8 border border-cyan-500/30 space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.15)] backdrop-blur-2xl">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider block">
              TICKET REFERENCE NUMBER OR EMAIL
            </label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              <input
                type="text"
                required
                value={ticketIdInput}
                onChange={(e) => {
                  setTicketIdInput(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. DRG-2026-123456 or operative@email.com"
                className="w-full rounded-2xl bg-black/70 px-4 py-4 pl-12 font-mono text-sm text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            {error && <p className="text-xs font-mono text-rose-400 pt-1">{error}</p>}
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full rounded-2xl gap-2 font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_25px_rgba(0,229,255,0.4)]">
            <Search className="size-4" />
            <span>LOCATE TICKET STATUS</span>
            <ArrowRight className="size-4" />
          </Button>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-cyan-400" />
              <span>Reference number sent to your inbox upon ticket submission.</span>
            </div>
            <Link href="/contact" className="text-cyan-300 hover:underline">
              Submit New Inquiry →
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </SceneBackground>
  );
}
