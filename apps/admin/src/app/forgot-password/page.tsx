"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#02040A] flex flex-col items-center justify-center p-4 font-mono select-none relative">
      <div className="w-full max-w-md bg-[#03091D]/95 backdrop-blur-2xl border border-cyan-500/35 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.2)] space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <DragonLogoIcon className="size-12 drop-shadow-[0_0_15px_#00E5FF]" />
          <h1 className="text-xl font-black text-white tracking-tight font-mono">
            Account Recovery
          </h1>
          <p className="text-xs text-slate-400 max-w-xs font-mono">
            Enter your studio executive email to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/15 border border-emerald-400/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="size-6 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold text-emerald-300 font-mono">Recovery Email Dispatched</h4>
            <p className="text-[11px] text-emerald-200/80 font-mono">
              If an account exists for {email}, you will receive a secure reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cyan-400 font-mono">Studio Staff Email</label>
              <div className="relative">
                <Mail className="size-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dragonstudios.com"
                  className="w-full bg-[#02050E] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black text-xs font-black font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
            >
              Send Recovery Instructions
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-cyan-500/20">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Studio Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
