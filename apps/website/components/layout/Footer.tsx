"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowUp, 
  Send, 
  Check, 
  Zap,
  Instagram,
  Youtube,
  MessageSquare
} from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      setYear(new Date().getFullYear());
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
    <footer className="relative bg-[#01040D] text-slate-200 border-t border-cyan-500/20 pt-16 pb-24 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-16 overflow-hidden font-sans select-none">
      {/* Background Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[350px] w-[900px] rounded-full bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-[160px]"
      />

      {/* Top Electric Cyan Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16 relative z-10">
        {/* ═══ 1. Spacious Newsletter Dispatch Banner ═══ */}
        <div className="rounded-3xl bg-[#03091D]/90 p-6 sm:p-10 lg:p-12 border border-cyan-500/30 overflow-hidden relative shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-blue-600/15 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                <Zap className="size-3.5 text-cyan-400 animate-pulse" />
                <span>Dragon Dispatch Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-tight font-heading">
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
                  <span>SUBSCRIPTION VERIFIED • WELCOME WARRIOR</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter warrior email..."
                    className="flex-1 rounded-2xl bg-[#01040D] border border-cyan-500/30 px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{newsletterLoading ? "CONNECTING..." : "DISPATCH"}</span>
                    <Send className="size-3.5" />
                  </button>
                </form>
              )}
              {newsletterError && (
                <p className="mt-2 text-xs font-mono text-red-400">{newsletterError}</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ 2. Clean, Ultra-Spacious Minimal Sitemap with Official Social Channels (Symbol + Name) ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pt-4 border-t border-white/10">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <DragonLogoIcon size="md" className="shadow-[0_0_20px_rgba(0,240,255,0.4)] border-cyan-400/50" />
              <span className="font-heading font-black tracking-widest text-white text-lg uppercase">
                DRAGON STUDIOS
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm font-sans leading-relaxed">
              Premier game development studio crafting next-generation interactive worlds powered by Dragon Engine technology.
            </p>
          </div>

          {/* Games Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              GAMES
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-sans">
              <li><Link href="/games/dragon-slayer-3d" className="hover:text-cyan-300 transition-colors">Dragon Slayer 3D</Link></li>
              <li><Link href="/games/cyber-drift-3d" className="hover:text-cyan-300 transition-colors">Cyber Drift 3D</Link></li>
              <li><Link href="/games/shadow-ninja-2d" className="hover:text-cyan-300 transition-colors">Shadow Ninja 2D</Link></li>
              <li><Link href="/games" className="hover:text-cyan-300 transition-colors text-cyan-400 font-bold">All Franchises →</Link></li>
            </ul>
          </div>

          {/* Official Channels Column (Clean: Symbol + Handle Name) */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              OFFICIAL CHANNELS
            </h3>
            <ul className="flex flex-col gap-2 text-xs font-sans">
              <li>
                <a
                  href={OFFICIAL_SOCIALS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                    <WhatsAppIcon className="size-3.5" />
                  </div>
                  <span>WhatsApp Channel</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_SOCIALS.threads.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
                    <ThreadsIcon className="size-3.5" />
                  </div>
                  <span>Threads Feed</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_SOCIALS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-pink-400 group-hover:border-pink-400 group-hover:scale-105 transition-all">
                    <Instagram className="size-3.5" />
                  </div>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_SOCIALS.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-red-400 group-hover:border-red-400 group-hover:scale-105 transition-all">
                    <Youtube className="size-3.5" />
                  </div>
                  <span>YouTube Channel</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_SOCIALS.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-slate-300 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
                    <XIcon className="size-3.5" />
                  </div>
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_SOCIALS.reddit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#040D24] border border-cyan-500/20 flex items-center justify-center text-orange-400 group-hover:border-orange-400 group-hover:scale-105 transition-all">
                    <MessageSquare className="size-3.5" />
                  </div>
                  <span>Reddit Hub</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              STUDIO
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-sans">
              <li><Link href="/studio" className="hover:text-cyan-300 transition-colors font-semibold text-cyan-400">About Me / About Studio</Link></li>
              <li><Link href="/team" className="hover:text-cyan-300 transition-colors">Leadership & Devs</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-300 transition-colors font-semibold text-cyan-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/careers" className="hover:text-cyan-300 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-cyan-300 transition-colors">Press & Media</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* ═══ 3. Bottom Clean Minimal Copyright Bar ═══ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-mono pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {year} Dragon Studios Inc. All rights reserved.</span>
            <span className="text-slate-600">•</span>
            <Link href="/studio" className="hover:text-cyan-300 text-slate-300 transition-colors">About Me</Link>
            <span className="text-slate-600">•</span>
            <Link href="/privacy" className="hover:text-cyan-300 text-slate-300 transition-colors">Privacy Policy</Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms" className="hover:text-cyan-300 text-slate-300 transition-colors">Terms of Service</Link>
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>TOP</span>
              <ArrowUp className="size-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
