"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowUp, 
  Twitter, 
  Youtube, 
  Instagram, 
  MessageSquare, 
  Send, 
  Check, 
  Globe,
  Zap,
  ShieldCheck,
  MousePointer,
  Sliders,
  X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_SOCIALS } from "@/lib/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  // Cursor Settings Modal State
  const [showCursorSettings, setShowCursorSettings] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      setYear(new Date().getFullYear());
      const userCursorDisabled = localStorage.getItem("dragon_cursor_enabled") === "false";
      const userGlowDisabled = localStorage.getItem("dragon_cursor_glow") === "false";
      setCursorEnabled(!userCursorDisabled);
      setGlowEnabled(!userGlowDisabled);
    });
    return () => { isMounted = false; };
  }, []);

  const toggleCursorSetting = (key: "enabled" | "glow", val: boolean) => {
    if (key === "enabled") {
      setCursorEnabled(val);
      localStorage.setItem("dragon_cursor_enabled", val ? "true" : "false");
      if (val) {
        document.documentElement.classList.add("dragon-cursor-active");
      } else {
        document.documentElement.classList.remove("dragon-cursor-active");
      }
    } else if (key === "glow") {
      setGlowEnabled(val);
      localStorage.setItem("dragon_cursor_glow", val ? "true" : "false");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);
    if (!email.trim()) return;

    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Subscription failed.");
      }

      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err: any) {
      setNewsletterError(err.message || "Failed to subscribe.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="relative bg-[#02050E] text-slate-100 border-t border-blue-500/20 pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* Background Ambient Lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[1000px] rounded-full bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-[200px]" 
      />

      {/* Top Electric Blue Separator Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#38bdf8]" />

      <div className="container-site relative z-10 space-y-20">
        {/* ═══ 1. Studio Newsletter Dispatch Banner ═══ */}
        <div className="rounded-3xl bg-[#0B132B]/90 p-8 sm:p-12 border border-blue-500/30 overflow-hidden relative shadow-2xl backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/15 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                <Zap className="size-3.5 text-cyan-400 animate-pulse" />
                <span>Dragon Dispatch Network</span>
              </div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight sm:text-3xl lg:text-4xl">
                Stay Connected to the Realm
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-sans">
                Receive official developer dispatches, playtest invitations, and Dragon Engine technology releases directly in your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/15 p-4 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                  <Check className="size-5 text-emerald-400" />
                  <span>Subscribed! Saved to Dragon Studios dispatch database.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full rounded-xl bg-[#060B18] px-4 py-3.5 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors font-mono shadow-inner"
                  />
                  <Button type="submit" disabled={newsletterLoading} variant="default" size="lg" className="rounded-xl px-6 shrink-0 w-full sm:w-auto text-xs font-black">
                    <span>{newsletterLoading ? "SENDING..." : "SUBSCRIBE"}</span>
                    <Send className="size-3.5" />
                  </Button>
                </form>
              )}
              {newsletterError && (
                <p className="mt-2 text-xs font-mono text-red-400">{newsletterError}</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ 2. 7-Column Enterprise Grid ═══ */}
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 pt-4 pb-12 border-b border-slate-800">
          {/* Column 1: Dragon Studios Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl font-black tracking-[0.06em] text-white uppercase">
                  DRAGON<span className="text-blue-500">STUDIOS</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.28em] text-cyan-400/80 uppercase mt-0.5 font-mono">
                  ENTERPRISE AAA GAME STUDIO
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-sans">
              Premier game development studio crafting next-generation interactive worlds powered by Dragon Engine technology.
            </p>

            {/* Official Social Channels */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { href: OFFICIAL_SOCIALS.youtube.href, icon: Youtube, label: "YouTube" },
                { href: OFFICIAL_SOCIALS.instagram.href, icon: Instagram, label: "Instagram" },
                { href: OFFICIAL_SOCIALS.x.href, icon: Twitter, label: "X" },
                { href: OFFICIAL_SOCIALS.reddit.href, icon: MessageSquare, label: "Reddit" },
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-blue-600/20 transition-colors"
                >
                  <soc.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Games */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              GAMES
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-sans">
              <li><Link href="/games/embers-of-valyria" className="hover:text-cyan-300 transition-colors">Embers of Valyria</Link></li>
              <li><Link href="/games/parking-nightmare" className="hover:text-cyan-300 transition-colors">Parking Nightmare</Link></li>
              <li><Link href="/games/neon-drift" className="hover:text-cyan-300 transition-colors">Neon Drift</Link></li>
              <li><Link href="/games/blacksite-zero" className="hover:text-cyan-300 transition-colors">Blacksite Zero</Link></li>
              <li><Link href="/games" className="text-cyan-400 font-bold hover:underline transition-colors">All Titles →</Link></li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              COMMUNITY
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-sans">
              <li><a href={OFFICIAL_SOCIALS.youtube.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">YouTube Channel</a></li>
              <li><a href={OFFICIAL_SOCIALS.instagram.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Instagram</a></li>
              <li><a href={OFFICIAL_SOCIALS.x.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">X (Twitter)</a></li>
              <li><a href={OFFICIAL_SOCIALS.reddit.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Reddit Hub</a></li>
            </ul>
          </div>

          {/* Column 4: Developers */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              DEVELOPERS
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-sans">
              <li><Link href="/studio#tech" className="hover:text-cyan-300 transition-colors">Dragon Engine</Link></li>
              <li><Link href="/press" className="hover:text-cyan-300 transition-colors">Press Documentation</Link></li>
              <li><Link href="/news" className="hover:text-cyan-300 transition-colors">Developer Dispatches</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              COMPANY
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-sans">
              <li><Link href="/studio" className="hover:text-cyan-300 transition-colors">About Studio</Link></li>
              <li><Link href="/team" className="hover:text-cyan-300 transition-colors">Leadership</Link></li>
              <li><Link href="/careers" className="hover:text-cyan-300 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-cyan-300 transition-colors">Media Kit</Link></li>
            </ul>
          </div>

          {/* Column 6: Support & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              SUPPORT & LEGAL
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 font-sans">
              <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-cyan-300 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* ═══ 3. Bottom Enterprise Utility Bar ═══ */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {year} Dragon Studios Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>POSTGRESQL DB CONNECTED</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Cursor Controls Button */}
            <button
              onClick={() => setShowCursorSettings(!showCursorSettings)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs hover:border-cyan-400 hover:text-white transition-colors"
              title="Customize Cursor"
            >
              <MousePointer className="size-3.5 text-cyan-400" />
              <span>CURSOR SETTINGS</span>
            </button>

            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5 text-xs border-slate-700 hover:border-cyan-400"
            >
              <span>TOP</span>
              <ArrowUp className="size-3.5 text-cyan-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cursor Settings Modal Overlay */}
      {showCursorSettings && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="rounded-3xl bg-[#0B132B] p-8 max-w-md w-full border border-blue-500/30 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="size-5 text-cyan-400" />
                <h3 className="text-lg font-black uppercase text-white font-heading">CURSOR SYSTEM SETTINGS</h3>
              </div>
              <button onClick={() => setShowCursorSettings(false)} className="text-slate-400 hover:text-white">
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Custom Cursor</span>
                  <span className="text-[10px] text-slate-400">Toggle GPU custom cursor on/off</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCursorSetting("enabled", !cursorEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${cursorEnabled ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform transform ${cursorEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#060B18] border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Cursor Glow & Reticle</span>
                  <span className="text-[10px] text-slate-400">Toggle ambient cursor lighting</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCursorSetting("glow", !glowEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${glowEnabled ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform transform ${glowEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setShowCursorSettings(false)} variant="default" size="sm" className="w-full rounded-xl">
                SAVE PREFERENCES
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
