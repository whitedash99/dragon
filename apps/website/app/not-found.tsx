"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Home, ArrowLeft, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main id="main-content" className="cinematic-page relative flex min-h-screen items-center justify-center pb-32 pt-32">
        <div className="container-site relative z-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 shadow-2xl relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-dragon-400 via-neon-purple to-neon-cyan" 
            />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-dragon-400 to-neon-purple text-3xl font-black text-white shadow-2xl shadow-dragon-500/50 border border-white/20 mb-6">
              404
            </div>

            <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
              Universe Out of Bounds
            </h1>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed sm:text-lg">
              The coordinate anomaly or realm page you requested has faded into temporal stasis.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="glow" size="lg" className="rounded-full gap-2 px-8" asChild>
                <Link href="/">
                  <Home className="size-4" />
                  <span>Return to Homepage</span>
                </Link>
              </Button>

              <Button variant="glass" size="lg" className="rounded-full gap-2 px-8 border-white/20" asChild>
                <Link href="/games">
                  <Gamepad2 className="size-4 text-neon-purple" />
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
