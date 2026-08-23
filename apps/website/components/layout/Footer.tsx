"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUp, 
  Send, 
  Check, 
  Zap,
  Instagram,
  Youtube,
  MessageSquare,
  Play,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Gamepad2
} from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon, DiscordIcon } from "@/components/ui/social-icons";

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
    <footer className="relative bg-[#02050E] text-slate-200 border-t border-amber-500/30 pt-16 pb-24 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-16 overflow-hidden font-sans select-none">
      {/* Background Gold & Electric Blue Ambient Radiant Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[1100px] rounded-full bg-gradient-to-b from-amber-500/10 via-blue-600/10 to-transparent blur-[180px]"
      />

      {/* Top Gold-to-Cyan Apex Accent Ribbon */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-cyan-400 to-transparent shadow-[0_0_25px_#f59e0b]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16 relative z-10">
        
        {/* ═══ 1. GOLD-TIER WORLD-BEST DISCORD & SECOND GAME SHOWCASE ═══ */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Discord Realm Gold Showcase */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0c1433]/95 via-[#060b1e]/90 to-[#02050e] p-6 sm:p-8 lg:p-10 border border-blue-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.25)] backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-600/20 px-3.5 py-1 text-xs font-mono font-black uppercase tracking-widest text-indigo-300">
                <Sparkles className="size-3.5 text-indigo-400 animate-pulse" />
                <span>OFFICIAL DISCORD REALM</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading tracking-tight">
                JOIN THE DRAGON <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-blue-400">DISCORD COMMUNITY</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-xl">
                Connect directly with our game developers, get exclusive alpha playtest keys, submit direct feedback, and participate in community tournaments.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://discord.gg/23nyUsPG5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#4752C4] to-[#5865F2] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_30px_rgba(88,101,242,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <DiscordIcon className="size-4 fill-white" />
                  <span>JOIN OFFICIAL DISCORD</span>
                  <ExternalLink className="size-3.5" />
                </a>

                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>DISCORD SERVER ACTIVE</span>
                </span>
              </div>
            </div>
          </div>

          {/* Second Game: Reflex Rush Direct Play Card */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#180e04]/95 via-[#0e0702]/90 to-[#02050e] p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)] backdrop-blur-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-600/20 px-3 py-1 text-xs font-mono font-black uppercase tracking-widest text-amber-300">
                <Gamepad2 className="size-3.5 text-amber-400" />
                <span>OFFICIAL SECOND GAME</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-tight">
                REFLEX RUSH <span className="text-amber-400">• LIVE GAME</span>
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Test your lightning-fast reaction speed in our live arcade speed runner. Play instantly in your web browser with zero download required.
              </p>
            </div>

            <div className="pt-4 relative z-10">
              <a
                href="https://reflexrush-dragongamingstudio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="size-4 fill-black" />
                <span>PLAY REFLEX RUSH (ONLINE)</span>
                <ExternalLink className="size-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* ═══ 2. Spacious Newsletter Dispatch Banner ═══ */}
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

        {/* ═══ 3. Gold-Tier World-Best Brand & Navigation Sitemap ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pt-4 border-t border-white/10">
          {/* Brand Column with Authentic Dragon Logo Image */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-14 sm:size-16 rounded-2xl border-2 border-cyan-400/60 overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.5)] shrink-0 bg-black">
                <img
                  src="/images/dragon-logo.jpg"
                  alt="Dragon Gaming Studio Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-black tracking-widest text-white text-lg sm:text-xl uppercase block">
                  DRAGON GAMING STUDIO™
                </span>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  Next-Gen 3D & 2D Game Universe
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm font-sans leading-relaxed">
              Premier independent game development studio creating high-octane 3D open-world simulations and adrenaline 2D arcade universes powered by Dragon Engine technology.
            </p>
          </div>

          {/* Official Games Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white flex items-center gap-1.5">
              <Gamepad2 className="size-3.5 text-amber-400" />
              <span>GAMES</span>
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-sans">
              <li>
                <Link href="/games/uncharted-drive-beyond" className="hover:text-amber-300 transition-colors font-bold text-amber-400">
                  Uncharted Drive: Beyond
                </Link>
              </li>
              <li>
                <a
                  href="https://reflexrush-dragongamingstudio.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-cyan-400 font-bold"
                >
                  <span>Reflex Rush (Live)</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-cyan-300 transition-colors text-slate-300">
                  Dragon Client Downloads
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-cyan-300 transition-colors text-slate-400">
                  All Franchises →
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Social & Community Channels */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              COMMUNITY & CHANNELS
            </h3>
            <ul className="flex flex-col gap-2 text-xs font-sans">
              <li>
                <a
                  href="https://discord.gg/23nyUsPG5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-slate-300 hover:text-indigo-300 transition-colors"
                >
                  <div className="size-6 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] group-hover:border-[#5865F2] group-hover:scale-105 transition-all">
                    <DiscordIcon className="size-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-indigo-300">Official Discord Server</span>
                </a>
              </li>
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
            </ul>
          </div>

          {/* Company & Support Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              STUDIO & LEGAL
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-sans">
              <li><Link href="/studio" className="hover:text-cyan-300 transition-colors font-semibold text-cyan-400">About Studio</Link></li>
              <li><Link href="/team" className="hover:text-cyan-300 transition-colors">Leadership & Devs</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-300 transition-colors font-semibold text-cyan-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/careers" className="hover:text-cyan-300 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-cyan-300 transition-colors">Press & Media</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* ═══ 4. Bottom Authentic Copyright Bar with Official Trademark ═══ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-mono pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-slate-300">© 2026 Dragon Gaming Studio. All rights reserved.</span>
            <span className="text-slate-600">•</span>
            <Link href="/studio" className="hover:text-cyan-300 text-slate-400 transition-colors">About Us</Link>
            <span className="text-slate-600">•</span>
            <Link href="/privacy" className="hover:text-cyan-300 text-slate-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms" className="hover:text-cyan-300 text-slate-400 transition-colors">Terms</Link>
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-xl border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <span>TOP</span>
              <ArrowUp className="size-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

