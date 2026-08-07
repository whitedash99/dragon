"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative flex min-h-screen items-center justify-center pb-32 pt-28">
        <div className="container-site relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-3xl glass-heavy p-8 sm:p-10 border border-white/15 shadow-2xl overflow-hidden"
          >
            {/* Top Accent Line */}
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-dragon-400 via-neon-purple to-neon-cyan" 
            />

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Sign In</span>
            </Link>

            {submitted ? (
              <div className="text-center py-6">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <Check className="size-7" />
                </div>
                <h2 className="text-2xl font-black uppercase text-white">Reset Link Sent</h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  We&apos;ve dispatched password recovery instructions to <strong>{email}</strong>. Check your inbox and spam folder.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="glass" size="sm" className="mt-6 rounded-full">
                  Try Another Email
                </Button>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                  Reset Password
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter your registered Dragon Account email to receive a secure password recovery dispatch.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl bg-black/40 px-4 py-3.5 pl-11 text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="glow"
                    size="lg"
                    className="w-full rounded-xl gap-2 mt-2"
                  >
                    {loading ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <span>Send Recovery Dispatch</span>
                        <Send className="size-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
