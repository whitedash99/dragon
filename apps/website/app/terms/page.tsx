"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";

export default function TermsOfServicePage() {
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
                <FileText className="size-3.5" />
                <span>Terms & Operating Agreement</span>
              </div>

              <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
                Terms of Service
              </h1>

              <p className="mt-2 text-xs font-mono text-muted-foreground">
                Effective Date: July 31, 2026 • Version 2.4-PROD
              </p>
            </div>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pt-6 border-t border-white/10">
              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">1. Dragon Account & License</h2>
                <p>
                  By registering a Dragon Account or downloading software via Dragon Launcher, you are granted a revocable, non-exclusive, personal license to access Dragon Studios titles and services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">2. Code of Conduct & Anti-Cheat</h2>
                <p>
                  Cheating, memory manipulation, exploitation of rollback netcode, harassment, or unauthorized reverse engineering of Dragon Engine binaries will result in immediate suspension or permanent Dragon Account hardware ban.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">3. Intellectual Property Rights</h2>
                <p>
                  All audio compositions, 3D models, shader pipelines, lore text, logos, and Dragon Engine code remain the exclusive intellectual property of Dragon Studios Inc.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
