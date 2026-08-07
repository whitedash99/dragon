"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";

export default function CookiePolicyPage() {
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
                <Cookie className="size-3.5" />
                <span>Cookie & Local Storage Policy</span>
              </div>

              <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
                Cookie Policy
              </h1>
            </div>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pt-6 border-t border-white/10">
              <p>
                Dragon Studios uses essential cookies and local storage tokens to preserve session authentication, remember user sound preferences, and store command palette history.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
