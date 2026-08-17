"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Search, ShieldCheck, Clock, CheckCircle2, AlertCircle, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

function StatusTrackerContent() {
  const searchParams = useSearchParams();
  const initialApp = searchParams.get("app") || "";
  const initialEmail = searchParams.get("email") || "";

  const [query, setQuery] = useState(initialApp);
  const [emailQuery, setEmailQuery] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    applicationNumber: string;
    applicantName: string;
    jobTitle: string;
    department: string;
    status: string;
    createdAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async (appNum: string, emailStr: string) => {
    if (!appNum.trim() && !emailStr.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = `/api/careers?appNumber=${encodeURIComponent(appNum.trim())}${emailStr.trim() ? `&email=${encodeURIComponent(emailStr.trim())}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.application) {
        setResult(data.application);
      } else {
        setError(data.error || "No application record found matching the provided details.");
        setResult(null);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to query application status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialApp) {
      fetchStatus(initialApp, initialEmail);
    }
  }, [initialApp, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(query, emailQuery);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400">
          <ShieldCheck className="size-3.5" />
          <span>Candidate Privacy Gateway</span>
        </div>
        <h1 className="text-4xl font-black uppercase text-white tracking-tight">
          Application Status Tracker
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your Application Reference (e.g. DRG-APP-2026-00001) and Email Address to verify status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. DRG-APP-2026-00001"
            className="w-full rounded-xl bg-black/60 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400 font-mono"
          />
          <input
            type="email"
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            placeholder="Applicant Email (Recommended)"
            className="w-full rounded-xl bg-black/60 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
        >
          <Search className="size-4" />
          <span>{loading ? "Verifying Record..." : "Verify Candidate Application"}</span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <XCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="rounded-2xl glass-heavy p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-mono text-dragon-400 font-bold uppercase">{result.applicationNumber}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{result.jobTitle}</h2>
              <p className="text-xs text-muted-foreground">{result.department}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center gap-1.5",
              result.status === "PENDING" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
              result.status === "UNDER_REVIEW" && "bg-sky-500/10 text-sky-400 border-sky-500/20",
              result.status === "MORE_INFORMATION" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
              result.status === "APPROVED" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              result.status === "REJECTED" && "bg-red-500/10 text-red-400 border-red-500/20"
            )}>
              {result.status === "PENDING" && <Clock className="size-3.5" />}
              {result.status === "APPROVED" && <CheckCircle2 className="size-3.5" />}
              {result.status === "MORE_INFORMATION" && <AlertCircle className="size-3.5" />}
              <span>{result.status.replace("_", " ")}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground block text-[11px]">APPLICANT NAME</span>
              <span className="text-white font-semibold">{result.applicantName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">SUBMITTED ON</span>
              <span className="text-white font-semibold">{new Date(result.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareersStatusPage() {
  return (
    <SceneBackground gradient noise vignette>
      <Navbar />
      <main className="cinematic-page relative min-h-screen pt-32 pb-24 px-4">
        <Suspense fallback={<div className="text-center text-white pt-12">Loading Candidate Tracker...</div>}>
          <StatusTrackerContent />
        </Suspense>
      </main>
      <Footer />
    </SceneBackground>
  );
}
