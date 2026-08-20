"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setLoading(false);
          setError("No verification token provided in the URL.");
        }
      });
      return;
    }

    fetch(`/api/contact/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setSuccess(true);
          setTicketId(data.ticketId);
          setTrackingUrl(data.trackingUrl);
        } else {
          setError(data.error || "Failed to verify email token.");
        }
      })
      .catch(() => {
        if (isMounted) setError("Network error while verifying token. Please try again.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);

  return (
    <div className="container-site relative z-10 py-32 max-w-3xl mx-auto">
      {loading ? (
        <div className="rounded-3xl glass-heavy p-12 text-center border border-white/15 shadow-2xl">
          <RefreshCw className="size-10 animate-spin text-dragon-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Verifying Email Ownership...</h1>
          <p className="mt-2 text-xs text-muted-foreground">Authenticating your token and initializing your support ticket.</p>
        </div>
      ) : success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl glass-heavy p-8 sm:p-12 border border-emerald-500/30 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-500/15 p-4 border border-emerald-500/30 text-emerald-400 shrink-0">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                EMAIL OWNERSHIP VERIFIED
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight mt-0.5">
                Ticket Created & Registered
              </h1>
            </div>
          </div>

          <div className="rounded-2xl bg-black/60 p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs text-muted-foreground uppercase font-mono">Assigned Ticket Reference</span>
              <span className="text-lg font-black font-mono text-dragon-300">{ticketId}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Verification Status</span>
                <span className="font-bold text-emerald-400 font-mono">100% VERIFIED</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Estimated SLA Response</span>
                <span className="font-bold text-white font-mono">Within 24 Hours</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your support ticket is active in our secure support network. You can track your ticket status, read replies, and upload files without creating an account using your secure tracking link below.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {trackingUrl && (
              <Button variant="glow" size="lg" className="rounded-full gap-2 text-xs" asChild>
                <a href={trackingUrl}>
                  <span>Track Ticket Status</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button variant="glass" size="lg" className="rounded-full text-xs" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl glass-heavy p-8 sm:p-12 border border-red-500/30 shadow-2xl space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-red-500/15 p-4 border border-red-500/30 text-red-400 shrink-0">
              <ShieldAlert className="size-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block">
                VERIFICATION ERROR
              </span>
              <h1 className="text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                Token Invalid or Expired
              </h1>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {error || "The verification link is invalid, has expired (24-hour limit), or has already been used."}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <Button variant="glow" size="sm" className="rounded-full gap-2" asChild>
              <Link href="/contact">
                <span>Submit New Transmission</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ContactVerificationPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <Suspense fallback={<div className="text-center py-32 text-white">Loading...</div>}>
        <VerificationContent />
      </Suspense>
      <Footer />
    </SceneBackground>
  );
}
