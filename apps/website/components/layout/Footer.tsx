"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowUp, 
  Gamepad2, 
  Youtube, 
  Instagram 
} from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon, DiscordIcon } from "@/components/ui/social-icons";

export default function Footer() {
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

  return (
    <footer className="relative bg-transparent text-slate-300 border-t border-cyan-500/20 pt-12 pb-[calc(env(safe-area-inset-bottom,1.5rem)+3rem)] sm:pt-20 sm:pb-16 overflow-hidden font-sans select-none">
      {/* Background Ambient Royal Blue Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[1100px] rounded-full bg-cyan-500/10 blur-[180px]"
      />

      {/* Top Subtle Cyan Gradient Accent Rim */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-blue-500/30 to-transparent" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-12 relative z-10">
        
        {/* SITEMAP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl border border-cyan-400/40 overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.25)] shrink-0 bg-black">
                <img
                  src="/images/dragon-logo.jpg"
                  alt="Dragon Gaming Studio Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-black tracking-widest text-white text-base sm:text-lg uppercase block">
                  DRAGON GAMING STUDIOS™
                </span>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  Next-Gen 3D & 2D Game Universe
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm font-sans leading-relaxed">
              Premier independent game development studio creating high-octane 3D open-world simulations and adrenaline 2D arcade universes powered by Dragon Engine technology.
            </p>
          </div>

          {/* Official Games Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white flex items-center gap-1.5">
              <Gamepad2 className="size-3.5 text-cyan-400" />
              <span>GAMES & ARCADE</span>
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-slate-300 font-sans">
              <li>
                <Link href="/games/uncharted-drive-beyond" className="hover:text-cyan-300 transition-colors py-1 inline-block font-bold text-white">
                  ★ Uncharted Drive: Beyond (Flagship)
                </Link>
              </li>
              <li>
                <a
                  href="https://reflexrush-dragongamingstudio.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors py-1 inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
                >
                  <span>Reflex Rush (Web Arcade)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">WEB</span>
                </a>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white transition-colors py-1 inline-block">
                  Direct Client Downloads (.exe / .apk)
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Social & Community Channels with Authentic Brand Colors */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              COMMUNITY & CHANNELS
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-sans text-slate-300">
              {/* Discord: Official Blurple (#5865F2) */}
              <li>
                <a
                  href="https://discord.gg/23nyUsPG5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] flex items-center justify-center shadow-[0_0_12px_rgba(88,101,242,0.35)] group-hover:shadow-[0_0_20px_rgba(88,101,242,0.7)] group-hover:scale-105 transition-all">
                    <DiscordIcon className="size-4 fill-current" />
                  </div>
                  <span className="group-hover:text-[#5865F2] transition-colors font-medium">Discord Community</span>
                </a>
              </li>

              {/* WhatsApp: Official Green (#25D366) */}
              <li>
                <a
                  href={OFFICIAL_SOCIALS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] flex items-center justify-center shadow-[0_0_12px_rgba(37,211,102,0.35)] group-hover:shadow-[0_0_20px_rgba(37,211,102,0.7)] group-hover:scale-105 transition-all">
                    <WhatsAppIcon className="size-4" />
                  </div>
                  <span className="group-hover:text-[#25D366] transition-colors font-medium">WhatsApp Channel</span>
                </a>
              </li>

              {/* YouTube: Official Red (#FF0000) */}
              <li>
                <a
                  href={OFFICIAL_SOCIALS.youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#FF0000]/20 border border-[#FF0000]/50 text-[#FF0000] flex items-center justify-center shadow-[0_0_12px_rgba(255,0,0,0.35)] group-hover:shadow-[0_0_20px_rgba(255,0,0,0.7)] group-hover:scale-105 transition-all">
                    <Youtube className="size-4" />
                  </div>
                  <span className="group-hover:text-[#FF0000] transition-colors font-medium">YouTube Channel</span>
                </a>
              </li>

              {/* Instagram: Official Gradient Pink/Magenta (#E1306C / #E4405F) */}
              <li>
                <a
                  href={OFFICIAL_SOCIALS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#E4405F]/20 border border-[#E4405F]/50 text-[#E4405F] flex items-center justify-center shadow-[0_0_12px_rgba(228,64,95,0.35)] group-hover:shadow-[0_0_20px_rgba(228,64,95,0.7)] group-hover:scale-105 transition-all">
                    <Instagram className="size-4" />
                  </div>
                  <span className="group-hover:text-[#E4405F] transition-colors font-medium">Instagram</span>
                </a>
              </li>

              {/* X (Twitter): Official Cyan/Sky Blue (#1DA1F2) */}
              <li>
                <a
                  href={OFFICIAL_SOCIALS.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#1DA1F2]/20 border border-[#1DA1F2]/50 text-[#1DA1F2] flex items-center justify-center shadow-[0_0_12px_rgba(29,161,242,0.35)] group-hover:shadow-[0_0_20px_rgba(29,161,242,0.7)] group-hover:scale-105 transition-all">
                    <XIcon className="size-4" />
                  </div>
                  <span className="group-hover:text-[#1DA1F2] transition-colors font-medium">X (Twitter)</span>
                </a>
              </li>

              {/* Threads: Official Violet/Purple (#A855F7) */}
              <li>
                <a
                  href={OFFICIAL_SOCIALS.threads.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors py-1"
                >
                  <div className="size-7 rounded-xl bg-[#A855F7]/20 border border-[#A855F7]/50 text-[#C084FC] flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] group-hover:scale-105 transition-all">
                    <ThreadsIcon className="size-4" />
                  </div>
                  <span className="group-hover:text-[#C084FC] transition-colors font-medium">Threads Feed</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Support Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-white">
              STUDIO & LEGAL
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-slate-300 font-sans">
              <li><Link href="/studio" className="hover:text-white transition-colors py-1 inline-block">About Studio</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors py-1 inline-block">Leadership & Devs</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors py-1 inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors py-1 inline-block">Terms of Service</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors py-1 inline-block">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors py-1 inline-block">Press & Media</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors py-1 inline-block">Contact & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-mono pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-slate-300 font-medium">© {year} Dragon Gaming Studio.</span>
            <span className="text-slate-600">•</span>
            <Link href="/studio" className="hover:text-white text-slate-400 transition-colors py-1">About</Link>
            <span className="text-slate-600">•</span>
            <Link href="/privacy" className="hover:text-white text-slate-400 transition-colors py-1">Privacy</Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms" className="hover:text-white text-slate-400 transition-colors py-1">Terms</Link>
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="size-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
