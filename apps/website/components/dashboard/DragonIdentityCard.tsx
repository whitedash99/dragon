"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  Edit3,
  Award,
  Globe,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Key
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";
import { GOD_LEVEL_BANNERS, GOD_LEVEL_AVATARS } from "./PlayerIdentitySetupModal";

interface DragonIdentityCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    dragonId?: string;
    role: string;
    createdAt: string;
    gamerTag?: string;
    primaryTitle?: string;
    bannerTheme?: string;
    avatar?: string;
    image?: string;
    bio?: string;
    securityScore?: number;
  };
  onEdit: () => void;
}

export function DragonIdentityCard({ user, onEdit }: DragonIdentityCardProps) {
  const [copiedId, setCopiedId] = useState(false);

  const activeAvatar =
    GOD_LEVEL_AVATARS.find(
      (a) =>
        a.id === user.avatar ||
        a.imageSrc === user.image ||
        a.imageSrc === user.avatar
    ) || GOD_LEVEL_AVATARS[0];

  const activeBanner =
    GOD_LEVEL_BANNERS.find((b) => b.id === user.bannerTheme) ||
    GOD_LEVEL_BANNERS[0];

  const displayDragonId = user.dragonId || "DRG-2026-9842";

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  const handleCopyDragonId = async () => {
    try {
      await navigator.clipboard.writeText(displayDragonId);
      setCopiedId(true);
      soundFx.playClick();
      setTimeout(() => setCopiedId(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Crown className="size-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 font-heading tracking-tight drop-shadow">
              GOLDEN DRAGON ID IDENTITY COMMAND
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Universal Ecosystem Credentials, Golden Battle Banner & Second Portal Key
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onEdit();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer active:scale-95"
        >
          <Edit3 className="size-3.5" />
          <span>EDIT DRAGON ID</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large 3D Dragon Identity Card with Golden Frame */}
        <div className="lg:col-span-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`rounded-3xl p-8 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden ${activeBanner.bgClass}`}
          >
            {/* Watermark Logo */}
            <div className="absolute right-4 top-4 opacity-15 pointer-events-none">
              <DragonLogoIcon size="xl" className="w-48 h-48 text-amber-300" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Glowing Avatar Frame */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 shrink-0 ${activeAvatar.borderClass} shadow-[0_0_30px_rgba(245,158,11,0.5)]`}
              >
                <Image
                  src={activeAvatar.imageSrc}
                  alt={activeAvatar.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Player Metadata */}
              <div className="space-y-2 overflow-hidden flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300 uppercase shadow-inner">
                    <Crown className="size-3 text-amber-400" />
                    <span>{activeBanner.tag}</span>
                  </div>

                  {/* Golden DragonID Badge with 1-Click Copy */}
                  <button
                    type="button"
                    onClick={handleCopyDragonId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-400/60 text-[10px] font-mono font-black text-amber-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
                    title="Click to copy DragonID"
                  >
                    <Key className="size-3 text-amber-300" />
                    <span>ID: {displayDragonId}</span>
                    {copiedId ? (
                      <Check className="size-3 text-emerald-400 shrink-0 ml-0.5" />
                    ) : (
                      <Copy className="size-3 text-amber-400 shrink-0 ml-0.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading tracking-tight truncate drop-shadow-md">
                  {user.name || "Dragon Operative"}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="text-cyan-200 font-bold">
                    @{user.gamerTag || "operative"}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-amber-300 font-bold">
                    {user.primaryTitle || "Dragon Operative"}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-slate-300 uppercase">{user.role}</span>
                </div>

                <p className="text-xs text-slate-200 font-sans pt-1 leading-relaxed">
                  {user.bio || "Dragon Studios Player & VIP Member"}
                </p>
              </div>
            </div>

            {/* Bottom Card Strip */}
            <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-400" />
                <span className="font-bold text-amber-200 tracking-wider">OFFICIAL GOLDEN DRAGONID PASS</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-purple-400" />
                <span>MEMBER SINCE {joinDate.toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Public DragonID Identity Lookup Scanner */}
        <div className="lg:col-span-4 space-y-4">
          <DragonIdPublicLookupCard currentDragonId={displayDragonId} />

          {/* Security Telemetry */}
          <div className="rounded-3xl bg-[#03091D]/90 border-2 border-cyan-500/30 p-6 backdrop-blur-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                SECURITY POSTURE
              </span>
              <ShieldCheck className="size-4 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Security Score:</span>
                <span className="text-emerald-400 font-bold">95/100 (Optimal)</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[95%] shadow-[0_0_10px_#10b981]" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2">
                <span className="text-slate-400">Session Status:</span>
                <span className="text-cyan-300 font-bold">Encrypted (TLS 1.3)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Account Type:</span>
                <span className="text-amber-300 font-bold uppercase">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive DragonID Public Lookup & Verification Scanner
 */
function DragonIdPublicLookupCard({ currentDragonId }: { currentDragonId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearching(true);
    setSearchError(null);
    setResult(null);
    soundFx.playClick();

    try {
      const res = await fetch(`/api/user/dragon-id/lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.user) {
        setResult(data.user);
      } else {
        setSearchError(data.error || "No operative found with this DragonID.");
      }
    } catch {
      setSearchError("Failed to connect to DragonID verification database.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0B0D1F] to-[#040611] border-2 border-amber-500/40 p-6 backdrop-blur-2xl space-y-4 shadow-2xl relative overflow-hidden font-mono">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-amber-400" />
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
            DRAGON ID IDENTITY SCANNER
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[9px] font-bold text-cyan-300">
          PUBLIC VERIFIED
        </span>
      </div>

      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
        Verify identity details and check ownership of any <strong>DragonID</strong> or GamerTag across the studio ecosystem:
      </p>

      <form onSubmit={handleLookup} className="space-y-3">
        <div className="relative">
          <Key className="size-4 absolute left-3.5 top-3 text-amber-400" />
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`e.g. ${currentDragonId} or @handle`}
            className="w-full rounded-xl bg-[#02050E] pl-10 pr-4 py-2.5 text-xs text-white border border-amber-500/40 focus:outline-none focus:border-amber-400 placeholder-slate-500 transition-all font-mono shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={searching || !searchQuery.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer disabled:opacity-50"
        >
          {searching ? (
            <span>SCANNING DATABASE...</span>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              <span>VERIFY DRAGON ID →</span>
            </>
          )}
        </button>
      </form>

      {/* Error Output */}
      {searchError && (
        <div className="rounded-xl bg-red-500/15 border border-red-500/30 p-3 text-[11px] text-red-300 font-sans leading-snug">
          {searchError}
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="rounded-2xl bg-[#02050E] border border-amber-400/50 p-4 space-y-3 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                VERIFIED OPERATIVE
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-bold uppercase">{result.role}</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-white uppercase font-heading">{result.name}</h4>
            <div className="text-[11px] text-amber-300 font-mono font-bold">
              ID: {result.dragonId}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Title: <span className="text-cyan-300">{result.primaryTitle}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-sans italic border-t border-white/10 pt-2">
            "{result.bio}"
          </p>
        </div>
      )}
    </div>
  );
}
