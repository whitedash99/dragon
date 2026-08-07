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
    const cleanId = ticketIdInput.trim().toUpperCase();
    if (!cleanId) {
      setError("Please enter a valid Ticket Reference ID.");
      return;
    }

    if (!cleanId.startsWith("DRG-")) {
      setError("Ticket ID format should start with DRG- (e.g. DRG-2026-000001)");
      return;
    }

    router.push(`/support/${cleanId}`);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="container-site relative z-10 py-32 max-w-3xl mx-auto space-y-8 font-sans">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-dragon-500/10 px-4 py-1.5 text-xs font-mono font-bold text-dragon-300 border border-dragon-500/20">
            <ShieldCheck className="size-3.5" />
            <span>REAL-TIME CUSTOMER SUPPORT TRACKER</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
            TRACK YOUR SUPPORT TICKET
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Enter your unique support reference number to check live status updates, response timelines, and communicate directly with Dragon Studios engineers.
          </p>
        </div>

        <form onSubmit={handleTrack} className="rounded-3xl glass-heavy p-8 border border-white/15 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-white tracking-wider block">
              TICKET REFERENCE NUMBER
            </label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-dragon-400" />
              <input
                type="text"
                required
                value={ticketIdInput}
                onChange={(e) => {
                  setTicketIdInput(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. DRG-2026-000001"
                className="w-full rounded-2xl bg-black/60 px-4 py-4 pl-12 font-mono text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400 focus:ring-1 focus:ring-dragon-400"
              />
            </div>
            {error && <p className="text-xs font-mono text-red-400 pt-1">{error}</p>}
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full rounded-2xl gap-2 font-bold tracking-wider uppercase">
            <Search className="size-4" />
            <span>LOCATE TICKET SPECIFICATIONS</span>
            <ArrowRight className="size-4" />
          </Button>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-dragon-400" />
              <span>Lost your reference number? Check your confirmation email.</span>
            </div>
            <Link href="/contact" className="text-dragon-300 hover:underline">
              Submit New Inquiry →
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </SceneBackground>
  );
}
