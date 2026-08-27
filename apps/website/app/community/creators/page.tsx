"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Tv, 
  Youtube, 
  CheckCircle2, 
  Plus, 
  X, 
  ShieldCheck, 
  DollarSign 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CommunityNav } from "@/components/community/CommunityNav";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";

export default function CommunityCreatorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [creatorChannel, setCreatorChannel] = useState("");
  const [creatorPlatform, setCreatorPlatform] = useState("YouTube");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsModalOpen(false);
      setCreatorName("");
      setCreatorChannel("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative font-mono">
      <Navbar />
      <DragonAtmosphere world="core" />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24 z-10">
        <CommunityNav />

        {/* Hero */}
        <section className="container-site relative z-10 mb-12 px-4 sm:px-6">
          <div className="rounded-3xl bg-[#03091D]/90 p-8 sm:p-12 border border-cyan-500/30 overflow-hidden relative text-center max-w-4xl mx-auto shadow-[0_0_40px_rgba(0,229,255,0.15)] font-mono">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4">
              <Sparkles className="size-3.5 text-cyan-400" />
              <span>Dragon Partner Program</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight font-heading">
              Dragon Creator Network
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              Stream, create gameplay videos, and build your gaming community with UNCHARTED DRIVE: BEYOND. Get early access builds, direct developer support, and verified badges.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="size-4 text-black" />
              <span>Apply for Creator Partner Verification</span>
            </button>
          </div>
        </section>

        {/* Perks Grid */}
        <section className="container-site relative z-10 mb-16 px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "Direct Build Early Access", desc: "Get priority access to Dragon Engine driving builds before public releases.", icon: Sparkles, color: "text-cyan-400" },
              { title: "Developer Collaboration", desc: "Collaborate directly with studio leadership on vehicle physics and track trials.", icon: DollarSign, color: "text-amber-400" },
              { title: "Verified Partner Badge", desc: "Unlock official verified creator partner badges across forums and chat.", icon: ShieldCheck, color: "text-emerald-400" },
            ].map((p, idx) => (
              <div key={idx} className="rounded-2xl bg-[#03091D]/90 p-6 border border-cyan-500/25 shadow-[0_0_20px_rgba(0,0,0,0.5)] space-y-2">
                <p.icon className={`size-6 ${p.color} mb-3`} />
                <h3 className="text-sm font-bold text-white uppercase">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-bold text-white text-sm">
                Apply for Creator Verification
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-1">
                <CheckCircle2 className="size-6 text-emerald-400 mx-auto" />
                <div className="font-bold">Application Received</div>
                <div className="text-[11px] text-slate-400">Our studio team will review your channel and verify your account.</div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3 text-xs">
                <div>
                  <label className="text-cyan-400 block mb-1 font-bold">Creator / Channel Name *</label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. DragonSpeedRunner"
                    className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-cyan-400 block mb-1 font-bold">Primary Platform</label>
                  <select
                    value={creatorPlatform}
                    onChange={(e) => setCreatorPlatform(e.target.value)}
                    className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Twitch">Twitch</option>
                    <option value="Kick">Kick</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                <div>
                  <label className="text-cyan-400 block mb-1 font-bold">Channel Link / URL *</label>
                  <input
                    type="url"
                    required
                    value={creatorChannel}
                    onChange={(e) => setCreatorChannel(e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-wider"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
