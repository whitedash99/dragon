"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ArrowRight, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { signIn } from "next-auth/react";
import { soundFx } from "@/lib/sound-effects";

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
    soundFx.playClick();

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

      soundFx.playForgeComplete();
      window.location.href = data.redirectUrl || "/welcome";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative flex min-h-screen items-center justify-center pb-32 pt-28 font-mono select-none">
        <div className="container-site relative z-10 flex justify-center w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl bg-[#03091D]/90 backdrop-blur-2xl p-8 sm:p-10 border border-cyan-500/35 shadow-[0_0_50px_rgba(0,229,255,0.18)] overflow-hidden relative"
          >
            {/* Top Multi-Neon Accent Line */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6]"
            />

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <DragonLogoIcon size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
                CREATE DRAGON<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3CFF]">ID</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                One unified credential for studio games, downloads & player command center.
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-5 rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-300 flex items-center justify-between"
                >
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth One-Click Registration */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  signIn("google", { callbackUrl: "/dashboard?welcome=true" });
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all border border-slate-200 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign Up with Google</span>
              </button>
            </div>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 border-t border-white/10" />
              <span className="relative bg-[#03091D] px-3 text-[10px] uppercase text-slate-400 font-mono">
                OR REGISTER WITH EMAIL
              </span>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Operative Callsign / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="dragon_operative"
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-11 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  DragonID Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@dragonstudios.com"
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-11 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl bg-[#02050E] px-4 py-3 pl-11 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-black/40 border-white/20 text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="agree" className="text-slate-400 text-[11px] select-none">
                  I agree to the <Link href="/terms" className="text-cyan-400 underline">Terms</Link> & <Link href="/privacy" className="text-cyan-400 underline">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#1677FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                <span>PROVISION DRAGONID ACCOUNT</span>
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400 pt-6 border-t border-white/10 font-mono">
              Already have a DragonID?{" "}
              <Link href="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
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
