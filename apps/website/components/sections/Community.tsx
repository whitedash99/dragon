"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, Twitter, Youtube } from "lucide-react";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function Community() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cmsText, setCmsText] = useState({
    eyebrow: "JOIN THE COMMUNITY",
    title: "SHAPE THE FUTURE OF GAMING WORLDS",
    subheadline: "Connect with our engineering leads, participate in closed pre-alpha playtests, and help influence design decisions inside official Dragon Studios channels.",
    youtubeCta: "SUBSCRIBE ON YOUTUBE",
    xCta: "FOLLOW ON X",
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsText({
            eyebrow: map["community.eyebrow"] || "JOIN THE COMMUNITY",
            title: map["community.title"] || "SHAPE THE FUTURE OF GAMING WORLDS",
            subheadline: map["community.subheadline"] || "Connect with our engineering leads, participate in closed pre-alpha playtests.",
            youtubeCta: map["community.youtube_cta"] || "SUBSCRIBE ON YOUTUBE",
            xCta: map["community.x_cta"] || "FOLLOW ON X",
          });
        }
      })
      .catch(() => {});
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
      className="relative py-24 lg:py-36 overflow-hidden bg-[#030304]"
    >
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-[#ff1e4b]/10 via-purple-900/10 to-transparent blur-[200px]" 
      />

      <div className="container-site relative z-10">
        {/* Main CTA Banner */}
        <div className="relative rounded-3xl border border-white/15 p-10 sm:p-16 overflow-hidden text-center bg-gradient-to-br from-white/[0.04] to-transparent shadow-2xl space-y-8">
          <div 
            aria-hidden="true" 
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ff1e4b] to-transparent shadow-[0_0_15px_#ff1e4b]" 
          />

          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b]">
              {cmsText.eyebrow}
            </span>

            <h2
              id="community-cta-heading"
              className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              {cmsText.title.includes("GAMING") || cmsText.title.includes("Gaming") ? (
                <>SHAPE THE FUTURE OF <br /><span className="text-[#ff1e4b]">GAMING WORLDS</span></>
              ) : (
                cmsText.title
              )}
            </h2>

            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto font-sans">
              {cmsText.subheadline}
            </p>

            {/* Actions */}
            <div className="pt-6 flex flex-col items-center gap-6">
              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="solidRed"
                  size="lg"
                  className="rounded-lg gap-2 px-8 text-xs"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.youtube.href} target="_blank" rel="noopener noreferrer">
                    <Youtube className="size-4" />
                    <span>{cmsText.youtubeCta}</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-lg gap-2 px-8 text-xs border-white/20"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.x.href} target="_blank" rel="noopener noreferrer">
                    <Twitter className="size-4 text-sky-400" />
                    <span>{cmsText.xCta}</span>
                  </a>
                </Button>
              </div>

              {/* Newsletter */}
              <div className="w-full max-w-md pt-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-400 font-mono text-xs font-bold"
                  >
                    <Check className="size-4" />
                    <span>SUBSCRIBED TO DRAGON DISPATCH!</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full rounded-xl bg-black/60 px-5 py-3.5 pr-32 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b] font-mono"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="glow"
                      size="sm"
                      className="absolute right-1.5 rounded-lg px-4 py-1.5 gap-1.5 text-xs h-9"
                    >
                      {loading ? "Sending..." : "SUBSCRIBE"}
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
