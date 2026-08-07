"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed.");
      }

      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative flex min-h-screen items-center justify-center pb-32 pt-28 font-mono">
        <div className="container-site relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-3xl glass-heavy p-8 sm:p-10 border border-white/15 shadow-2xl overflow-hidden relative"
          >
            {/* Top Accent Line */}
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ff1e4b] via-purple-600 to-sky-400" 
            />

            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff1e4b] to-purple-600 text-lg font-black text-white shadow-lg border border-white/20 mb-4 font-heading">
                DS
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white font-heading">
                CREATE DRAGONID
              </h1>
              <p className="mt-1 text-xs text-muted-foreground font-sans">
                One identity for all Dragon Studios games, launchers & support portal.
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-300 flex items-center justify-between"
                >
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Player Username / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="kaelen_voss"
                    className="w-full rounded-xl bg-black/60 px-4 py-3 pl-11 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full rounded-xl bg-black/60 px-4 py-3 pl-11 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl bg-black/60 px-4 py-3 pl-11 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-sans pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-black/40 border-white/20 text-[#ff1e4b] focus:ring-[#ff1e4b]"
                />
                <label htmlFor="agree" className="text-muted-foreground select-none">
                  I agree to the <Link href="/terms" className="text-white underline">Terms</Link> & <Link href="/privacy" className="text-white underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="solidRed"
                size="lg"
                className="w-full rounded-xl gap-2 mt-4 text-xs font-bold uppercase"
              >
                {loading ? (
                  <span>PROVISIONING DRAGONID...</span>
                ) : (
                  <>
                    <span>CREATE DRAGONID ACCOUNT</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer Prompt */}
            <div className="mt-8 text-center text-xs text-muted-foreground pt-6 border-t border-white/10 font-sans">
              Already have a DragonID?{" "}
              <Link href="/login" className="font-bold text-white hover:text-[#ff1e4b] transition-colors">
                Sign In →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
