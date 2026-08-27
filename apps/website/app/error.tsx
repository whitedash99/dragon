"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Dragon Studios Error Boundary:", error);
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center pb-24 pt-24 px-4 bg-[#01040D] text-white">
      <div className="relative z-10 text-center max-w-lg mx-auto w-full">
        <div className="rounded-3xl bg-[#050D24]/95 border border-cyan-500/30 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,229,255,0.15)] backdrop-blur-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <AlertTriangle className="size-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
            System Synchronization
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            A temporary synchronization pause occurred in the client application pipeline.
          </p>

          {error?.digest && (
            <span className="mt-3 block font-mono text-[10px] text-cyan-400">
              Digest: {error.digest}
            </span>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button 
              onClick={handleHardRefresh} 
              className="rounded-xl gap-2 text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400"
            >
              <RefreshCw className="size-3.5" />
              <span>Re-Initialize View</span>
            </Button>

            <Button 
              variant="outline" 
              className="rounded-xl text-xs font-mono text-slate-300 border-white/10 hover:bg-white/5" 
              asChild
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>

          {error?.message && (
            <div className="mt-6 pt-4 border-t border-white/10 text-left">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <span>Diagnostic Logs</span>
                {showDetails ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
              {showDetails && (
                <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-red-300 whitespace-pre-wrap break-words overflow-x-auto max-h-36">
                  {error.message}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
