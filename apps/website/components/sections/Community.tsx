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
      className="relative py-24 lg:py-36 overflow-hidden bg-[#040812]"
    >
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent blur-[200px]" 
      />

      <div className="container-site relative z-10">
        {/* Main CTA Banner */}
        <div className="relative rounded-3xl border border-blue-500/20 p-10 sm:p-16 overflow-hidden text-center bg-gradient-to-br from-[#0B132B]/90 via-[#060B18]/95 to-[#040812] shadow-2xl space-y-8">
          <div 
            aria-hidden="true" 
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#38bdf8]" 
          />

          <div className="max-w-3xl mx-auto space-y-4">
            <span data-cms-key="community.eyebrow" className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
              {cmsText.eyebrow}
            </span>

            <h2
              id="community-cta-heading"
              data-cms-key="community.title"
              className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              {cmsText.title.includes("GAMING") || cmsText.title.includes("Gaming") ? (
                <>SHAPE THE FUTURE OF <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300">GAMING WORLDS</span></>
              ) : (
                cmsText.title
              )}
            </h2>

            <p data-cms-key="community.subheadline" className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-sans">
              {cmsText.subheadline}
            </p>

            {/* Actions */}
            <div className="pt-6 flex flex-col items-center gap-6">
              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-xl gap-2 px-8 text-xs"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.youtube.href} target="_blank" rel="noopener noreferrer">
                    <Youtube className="size-4 text-white" />
                    <span>{cmsText.youtubeCta}</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl gap-2 px-8 text-xs border-slate-700/80 hover:border-cyan-400"
                  asChild
                >
                  <a href={OFFICIAL_SOCIALS.x.href} target="_blank" rel="noopener noreferrer">
                    <Twitter className="size-4 text-cyan-400" />
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
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3.5 text-emerald-300 font-mono text-xs font-bold"
                  >
                    <Check className="size-4 text-emerald-400" />
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
                      className="w-full rounded-xl bg-[#060B18] px-5 py-3.5 pr-32 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
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
