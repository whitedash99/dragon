"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, Twitter, Youtube, ArrowUpRight } from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon, ThreadsIcon, XIcon, DiscordIcon } from "@/components/ui/social-icons";

import { getClientCmsBlocks } from "@/lib/client-cms-cache";

export default function Community() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cmsText, setCmsText] = useState({
    eyebrow: "JOIN THE COMMUNITY",
    title: "SHAPE THE FUTURE OF GAMING WORLDS",
    subheadline: "Connect with our engineering leads, participate in closed playtests, and follow official Dragon Studios channels.",
    youtubeCta: "SUBSCRIBE ON YOUTUBE",
    xCta: "FOLLOW ON X",
  });

  useEffect(() => {
    getClientCmsBlocks().then((map) => {
      if (Object.keys(map).length > 0) {
        setCmsText({
          eyebrow: map["community.eyebrow"] || "JOIN THE COMMUNITY",
          title: map["community.title"] || "SHAPE THE FUTURE OF GAMING WORLDS",
          subheadline: map["community.subheadline"] || "Connect with our engineering leads, participate in closed playtests.",
          youtubeCta: map["community.youtube_cta"] || "SUBSCRIBE ON YOUTUBE",
          xCta: map["community.x_cta"] || "FOLLOW ON X",
        });
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail("");
    }, 800);
  };

  return (
    <section
      id="community"
      aria-labelledby="community-cta-heading"
      className="relative pt-4 pb-16 sm:pt-6 sm:pb-24 overflow-hidden bg-transparent"
    >
      {/* Ambient Cyan + Emerald Section Lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10 blur-[200px]" 
      />

      <div className="container-site relative z-10 px-4 sm:px-6">
        {/* Main CTA Panel */}
        <div className="relative rounded-3xl bg-[#03091D]/90 border border-cyan-500/30 p-6 sm:p-12 overflow-hidden text-center shadow-[0_0_40px_rgba(0,229,255,0.15)] space-y-6">
          <div 
            aria-hidden="true" 
            className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 via-emerald-400/40 to-transparent" 
          />

          <div className="max-w-3xl mx-auto space-y-3">
            <span data-cms-key="community.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.eyebrow}
            </span>

            <h2
              id="community-cta-heading"
              data-cms-key="community.title"
              className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight font-heading"
            >
              {cmsText.title.includes("GAMING") || cmsText.title.includes("Gaming") ? (
                <>SHAPE THE FUTURE OF <br className="hidden sm:inline" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400">GAMING WORLDS</span></>
              ) : (
                cmsText.title
              )}
            </h2>

            <p data-cms-key="community.subheadline" className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-sans">
              {cmsText.subheadline}
            </p>

            {/* Official Channel Actions */}
            <div className="pt-4 flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full">
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[44px] rounded-2xl gap-2 px-5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold shadow-md transition-all active:scale-95 w-full xs:w-auto"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.whatsapp.href} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4 text-white" />
                    <span>WHATSAPP CHANNEL</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] rounded-2xl gap-2 px-5 text-xs border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:bg-cyan-500/10 font-mono font-bold transition-all active:scale-95 w-full xs:w-auto"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.threads.href} target="_blank" rel="noopener noreferrer">
                    <ThreadsIcon className="size-4 text-cyan-400" />
                    <span>THREADS FEED</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] rounded-2xl gap-2 px-5 text-xs border-rose-500/40 hover:border-rose-400 text-rose-300 hover:bg-rose-500/10 font-mono font-bold transition-all active:scale-95 w-full xs:w-auto"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.youtube.href} target="_blank" rel="noopener noreferrer">
                    <Youtube className="size-4 text-rose-400" />
                    <span>YOUTUBE</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] rounded-2xl gap-2 px-5 text-xs border-sky-500/40 hover:border-sky-300 text-sky-300 hover:bg-sky-500/10 font-mono font-bold transition-all active:scale-95 w-full xs:w-auto"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.x.href} target="_blank" rel="noopener noreferrer">
                    <XIcon className="size-4 text-sky-400" />
                    <span>X (TWITTER)</span>
                  </a>
                </Button>
              </div>

              {/* Newsletter Form */}
              <div className="w-full max-w-md pt-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 p-3.5 text-emerald-300 font-mono text-xs font-bold"
                  >
                    <Check className="size-4 text-emerald-400" />
                    <span>SUBSCRIBED TO DRAGON DISPATCH!</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address..."
                      required
                      className="w-full rounded-2xl bg-black/60 px-4 py-3.5 pr-28 sm:pr-32 text-xs text-white placeholder:text-slate-500 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono shadow-inner min-h-[44px]"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="glow"
                      size="sm"
                      className="absolute right-1.5 rounded-xl px-4 py-2 text-xs h-9 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black active:scale-95 cursor-pointer"
                    >
                      {loading ? "..." : "SUBSCRIBE"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
