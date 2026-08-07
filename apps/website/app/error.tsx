"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error analytics to monitoring service
    console.error("Dragon Studios Error Boundary Triggered:", error);
  }, [error]);

  return (
    <SceneBackground gradient noise orbs vignette>
      <main className="cinematic-page relative flex min-h-screen items-center justify-center pb-32 pt-32">
        <div className="container-site relative z-10 text-center max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-heavy p-8 sm:p-10 border border-red-500/20 shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 mb-6">
              <AlertTriangle className="size-8" />
            </div>

            <h1 className="text-3xl font-black uppercase text-white tracking-tight">
              System Error
            </h1>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              An unexpected render fault occurred in the client application pipeline.
            </p>

            {error.digest && (
              <span className="mt-3 block font-mono text-[10px] text-dragon-400">
                Fault Digest ID: {error.digest}
              </span>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button onClick={() => reset()} variant="glow" size="sm" className="rounded-full gap-2 text-xs">
                <RefreshCw className="size-3.5" />
                <span>Re-Initialize View</span>
              </Button>

              <Button variant="ghost" size="sm" className="rounded-full text-xs" asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </SceneBackground>
  );
}
