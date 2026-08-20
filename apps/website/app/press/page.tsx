"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Mail, ArrowLeft, Sparkles, Check, Send, ShieldCheck } from "lucide-react";
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
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="rounded-3xl bg-[#040D24]/90 border border-cyan-500/35 p-8 sm:p-12 shadow-2xl space-y-8 backdrop-blur-xl">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-4">
                <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
                <span>OFFICIAL MEDIA & PRESS KIT</span>
              </div>

              <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl font-heading">
                DRAGON STUDIOS MEDIA KIT
              </h1>

              <p className="mt-4 text-base text-slate-300 leading-relaxed font-sans">
                Official vector logos, brand assets, game screenshots, and developer dispatches for Dragon Studios.
              </p>
            </div>

            {/* Asset Downloads Grid */}
            <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-cyan-500/20">
              <div className="rounded-2xl bg-[#020718] p-6 border border-cyan-500/25 space-y-4">
                <h3 className="text-base font-bold text-white uppercase font-heading">Dragon Studios Vector Logos</h3>
                <p className="text-xs text-slate-400">Official SVG vector crests, horizontal logos, and color palettes.</p>
                <Link
                  href="/icon.svg"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-heading font-black text-xs uppercase tracking-wider"
                >
                  <Download className="size-3.5" />
                  <span>Download SVG Crest</span>
                </Link>
              </div>

              <div className="rounded-2xl bg-[#020718] p-6 border border-cyan-500/25 space-y-4">
                <h3 className="text-base font-bold text-white uppercase font-heading">Game Artwork & Stills</h3>
                <p className="text-xs text-slate-400">Key artwork for Dragon Slayer 3D, Cyber Drift 3D, and Shadow Ninja 2D.</p>
                <Link
                  href="/games"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#05112E] border border-cyan-500/40 text-cyan-300 font-heading font-black text-xs uppercase tracking-wider hover:text-white hover:bg-cyan-500/20"
                >
                  <Download className="size-3.5" />
                  <span>View Game Hub</span>
                </Link>
              </div>
            </div>

            {/* Press Inquiry Form */}
            <div className="pt-6 border-t border-cyan-500/20">
              <h2 className="text-xl font-bold uppercase text-white mb-2 font-heading">Official Media Inquiries</h2>
              <p className="text-xs text-slate-400 mb-6">Contact Dragon Studios directly for interviews, content creator access, or early preview builds.</p>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-500/20 p-4 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  ✓ Inquiry received! We will reach out to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Organization"
                      className="w-full rounded-xl bg-black/50 px-4 py-3 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="contact@yourchannel.com"
                      className="w-full rounded-xl bg-black/50 px-4 py-3 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your inquiry or content creator request..."
                    className="w-full rounded-xl bg-black/50 px-4 py-3 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Send Inquiry</span>
                  </button>
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
