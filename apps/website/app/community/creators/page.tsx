"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Tv, 
  Youtube, 
  CheckCircle2, 
  Plus, 
  X, 
  Save, 
  ShieldCheck, 
  DollarSign 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { creatorsList, CreatorProfile } from "@/data/communityData";
import { Button } from "@/components/ui/button";

export default function CommunityCreatorsPage() {
  const [creators] = useState<CreatorProfile[]>(creatorsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        {/* Hero */}
        <section className="container-site relative z-10 mb-12">
          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 overflow-hidden relative text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400 mb-4">
              <Sparkles className="size-3.5" />
              <span>Dragon Partner Program</span>
            </div>

            <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl lg:text-6xl">
              Dragon Creator Network
            </h1>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed sm:text-lg max-w-2xl mx-auto">
              Stream, create content, and build your audience in the Dragon Studios ecosystem. Get early access builds, 70/30 revenue share on creator codes, and verified badges.
            </p>

            <Button onClick={() => setIsModalOpen(true)} variant="glow" size="xl" className="mt-8 rounded-full gap-2 px-8">
              <Plus className="size-5" />
              <span>Apply for Creator Verification</span>
            </Button>
          </div>
        </section>

        {/* Perks Grid */}
        <section className="container-site relative z-10 mb-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "70/30 Creator Revenue Share", desc: "Earn direct revenue on in-game cosmetic pack sales using your custom Creator Code.", icon: DollarSign, color: "text-emerald-400" },
              { title: "Alpha Build Early Access", desc: "Get priority access to Dragon Engine playtests before public reveals.", icon: Sparkles, color: "text-dragon-400" },
              { title: "Verified Partner Badge", desc: "Unlock official verified partner badges in Dragon Launcher, forums, and streams.", icon: ShieldCheck, color: "text-neon-cyan" },
            ].map((p, idx) => (
              <div key={idx} className="rounded-2xl glass-md p-6 border border-white/10">
                <p.icon className={`size-6 ${p.color} mb-4`} />
                <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Directory */}
        <section className="container-site relative z-10 mb-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Verified Partners
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase text-white">
              Featured Dragon Creators
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {creators.map((c) => (
              <div key={c.id} className="rounded-2xl glass-heavy p-6 border border-white/10 flex items-center gap-4">
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 shrink-0">
                  {c.platform === "Twitch" ? <Tv className="size-6 text-neon-purple" /> : <Youtube className="size-6 text-red-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-mono text-dragon-300">{c.handle} • {c.followers} Followers</span>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Apply Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl glass-heavy p-8 border border-white/20"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>

              <h2 className="text-2xl font-black uppercase text-white">Apply for Creator Verification</h2>

              {appliedSuccess ? (
                <div className="py-8 text-center text-emerald-400 font-bold text-sm">
                  ✓ Application submitted! Our creator ops team will review your channel metrics within 48 hours.
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Channel Handle / Link</label>
                    <input
                      type="text"
                      required
                      placeholder="https://twitch.tv/yourchannel"
                      className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Main Streaming Platform</label>
                    <select className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none">
                      <option value="Twitch">Twitch</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Kick">Kick</option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <Button type="button" onClick={() => setIsModalOpen(false)} variant="ghost" size="sm">
                      Cancel
                    </Button>
                    <Button type="submit" variant="glow" size="sm" className="rounded-full gap-2">
                      <Save className="size-3.5" />
                      <span>Submit Application</span>
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
