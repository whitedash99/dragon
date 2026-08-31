"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Zap,
  Gamepad2,
  Key,
  Shield,
  Activity,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Radio,
  Server
} from "lucide-react";
import { soundFx } from "@/lib/sound-effects";

interface DragonExecutiveMatrixProps {
  dragonId?: string;
  dragonKey?: string;
  securityScore?: number;
  gamerTag?: string;
  userRole?: string;
  ticketCount?: number;
  onOpenIdentity: () => void;
  onOpenSupport: () => void;
}

export function DragonExecutiveMatrix({
  dragonId = "DRG-ZDF-9415",
  dragonKey = "DRG-KEY-8942-XF92",
  securityScore = 98,
  gamerTag = "operative",
  userRole = "OWNER",
  ticketCount = 0,
  onOpenIdentity,
  onOpenSupport,
}: DragonExecutiveMatrixProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Identity & Security Isolation Vault Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-3xl bg-[#03091D]/90 border-2 border-emerald-500/35 p-6 backdrop-blur-2xl shadow-[0_0_35px_rgba(16,185,129,0.15)] space-y-4 flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                <Lock className="size-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  SECURITY ISOLATION
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ZERO-IMPERSONATION PROTOCOL
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
              {securityScore}/100
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Your Dragon ID (<span className="text-amber-300 font-mono font-bold">{dragonId}</span>) is strictly bound to your individual account with encrypted hardware token signatures. No other user can authenticate or impersonate your credentials.
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Cipher Vault:</span>
              <span className="text-emerald-400 font-bold">AES-256-GCM / SHA-256</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Isolation Layer:</span>
              <span className="text-cyan-300 font-bold">100% Dedicated Session</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Anti-Impersonation:</span>
              <span className="text-emerald-400 font-bold">ENFORCED</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenIdentity();
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm active:scale-95"
        >
          VIEW CIPHER VAULT →
        </button>
      </motion.div>

      {/* 2. Linked Second Dragon Portal Gateway */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-3xl bg-[#03091D]/90 border-2 border-purple-500/35 p-6 backdrop-blur-2xl shadow-[0_0_35px_rgba(124,60,255,0.15)] space-y-4 flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40">
                <Gamepad2 className="size-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  SECOND DRAGON PORTAL
                </h3>
                <span className="text-[10px] text-purple-300 font-mono">
                  DRAGON WEB GAMES SSO PASS
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-mono font-bold text-purple-300">
              ● LINKED
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Direct Single Sign-On bridge to the companion Dragon Web Games ecosystem. One click authenticates your verified Dragon ID, player profile, and game session state instantly.
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Auth Mechanism:</span>
              <span className="text-purple-300 font-bold">OIDC / PKCE S256</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Mapped Subject:</span>
              <span className="text-amber-300 font-bold">{dragonId}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Sync Status:</span>
              <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
            </div>
          </div>
        </div>

        <a
          href="/api/auth/sso/launch"
          onClick={() => soundFx.playClick()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(255,43,214,0.35)] flex items-center justify-center gap-1.5 active:scale-95 text-center"
        >
          <span>LAUNCH WEB GAMES →</span>
        </a>
      </motion.div>

      {/* 3. Player Signals & Communication Hub */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-3xl bg-[#03091D]/90 border-2 border-cyan-500/35 p-6 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-4 flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40">
                <Headphones className="size-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  PLAYER SIGNALS
                </h3>
                <span className="text-[10px] text-cyan-300 font-mono">
                  DIRECT OPERATIVE HELPDESK
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300">
              {ticketCount} ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Dispatch prioritized operative signals directly to studio engineering. Track ticket resolution, system telemetry, and developer communications in real-time.
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Helpdesk Relay:</span>
              <span className="text-cyan-300 font-bold">ONLINE (24/7)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Response SLA:</span>
              <span className="text-amber-300 font-bold">&lt; 15 Minutes</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Ticket Encryption:</span>
              <span className="text-emerald-400 font-bold">TLS 1.3</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenSupport();
          }}
          className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm active:scale-95"
        >
          DISPATCH SIGNAL →
        </button>
      </motion.div>
    </div>
  );
}
