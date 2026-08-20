"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Home, ArrowLeft, Search, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main id="main-content" className="cinematic-page relative flex min-h-screen items-center justify-center pb-28 pt-24 sm:pt-32 px-4">
        <div className="container-site relative z-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#060D24]/90 backdrop-blur-xl p-6 sm:p-12 border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.25)] relative overflow-hidden space-y-6"
          >
            {/* Top Accent Line */}
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600" 
            />

            <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 text-3xl font-black text-white shadow-2xl shadow-cyan-500/40 border border-white/20 font-heading">
              404
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight font-heading">
                UNIVERSE OUT OF BOUNDS
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
                The realm coordinate or game module you requested has faded into temporal stasis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="glow" size="lg" className="w-full sm:w-auto rounded-2xl gap-2 px-8 text-xs font-mono font-black uppercase shadow-lg shadow-cyan-500/25" asChild>
                <Link href="/">
                  <Home className="size-4" />
                  <span>Return to Universe</span>
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl gap-2 px-8 text-xs font-mono font-bold uppercase border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/20" asChild>
                <Link href="/games">
                  <Gamepad2 className="size-4 text-cyan-400" />
                  <span>Explore Games</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
