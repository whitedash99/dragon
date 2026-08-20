"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, Key } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#02040A] flex items-center justify-center p-4 font-mono text-xs text-white relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#050C17]/95 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-3xl relative z-10 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center mx-auto text-[#00f0ff] shadow-lg shadow-cyan-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-heading font-black tracking-widest text-white uppercase">
            RESTRICTED ADMINISTRATIVE GATEWAY
          </h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Public registration is disabled. Administrative access to Dragon Control OS is strictly governed by single-use cryptographic invitations.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#030712] border border-cyan-500/20 text-left space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>HOW TO OBTAIN ACCESS:</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-normal">
            1. An authorized Dragon Studios Owner must issue an invitation to your corporate email.<br />
            2. Follow the secure link inside the email to establish your credentials and MFA.<br />
            3. Once activated, authenticate via the administrative login portal.
          </p>
        </div>

        <Link
          href="/login"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-heading font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SECURE LOGIN</span>
        </Link>
      </div>
    </div>
  );
}
