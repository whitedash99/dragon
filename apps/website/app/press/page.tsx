"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Mail, ArrowLeft, Sparkles, Check, Send } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function PressPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main id="main-content" className="cinematic-page relative min-h-screen pb-32 pt-32">
        <div className="container-site relative z-10 max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400 mb-4">
                <Sparkles className="size-3.5" />
                <span>Media & Press Relations</span>
              </div>

              <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
                Press & Media Kit
              </h1>

              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Download official high-resolution logos, game key art, engine screenshots, and press releases for Dragon Studios.
              </p>
            </div>

            {/* Asset Downloads Grid */}
            <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/10">
              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <h3 className="text-base font-bold text-white mb-1">Dragon Studios Master Brand Kit</h3>
                <p className="text-xs text-muted-foreground mb-4">Vector SVG logos, typography rules, brand guidelines (45 MB)</p>
                <Button variant="glow" size="sm" className="rounded-full text-xs gap-2">
                  <Download className="size-3.5" />
                  <span>Download Brand Kit</span>
                </Button>
              </div>

              <div className="rounded-2xl glass-md p-6 border border-white/10">
                <h3 className="text-base font-bold text-white mb-1">Games 4K Key Art & Screenshots</h3>
                <p className="text-xs text-muted-foreground mb-4">High-res 4K renders for Embers of Valyria & Neon Drift (120 MB)</p>
                <Button variant="glass" size="sm" className="rounded-full text-xs gap-2 border-white/20">
                  <Download className="size-3.5" />
                  <span>Download Key Art</span>
                </Button>
              </div>
            </div>

            {/* Press Inquiry Form */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold uppercase text-white mb-2">Media & Press Inquiries</h2>
              <p className="text-xs text-muted-foreground mb-6">Contact our PR team for interview requests and review keys.</p>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-500/20 p-4 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  ✓ Press inquiry received! Our PR team will respond within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Outlet"
                      className="w-full rounded-xl bg-black/40 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="press@outlet.com"
                      className="w-full rounded-xl bg-black/40 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Inquiry details or interview request..."
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none"
                  />
                  <Button type="submit" variant="glow" size="sm" className="rounded-full gap-2 text-xs">
                    <Send className="size-3.5" />
                    <span>Send Press Inquiry</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
