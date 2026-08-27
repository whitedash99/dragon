"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Sparkles, 
  Check, 
  X, 
  Send, 
  ArrowUpRight, 
  Heart, 
  ShieldCheck, 
  Cpu, 
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { careerPositions, CareerPosition } from "@/data/expandedContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedLoc, setSelectedLoc] = useState("All");
  const [applyModalJob, setApplyModalJob] = useState<CareerPosition | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [applicantNote, setApplicantNote] = useState("");

  const filteredJobs = careerPositions.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesLoc = selectedLoc === "All" || job.location.includes(selectedLoc);
    return matchesDept && matchesLoc;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !portfolioUrl.trim()) return;

    setFormLoading(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyModalJob?.id,
          jobTitle: applyModalJob?.title || "Core Software Engineer",
          department: applyModalJob?.department || "Engineering",
          applicantName: applicantName.trim(),
          applicantEmail: applicantEmail.trim(),
          portfolioUrl: portfolioUrl.trim(),
          note: applicantNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
      } else {
        alert(data.error || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Submit application error", err);
      alert("Application submission failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setApplyModalJob(null);
    setFormSubmitted(false);
    setApplicantName("");
    setApplicantEmail("");
    setPortfolioUrl("");
    setApplicantNote("");
  };

  return (
    <SceneBackground world3D="creative" gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-28">
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="container-site relative pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-[#050D24]/90 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-purple-300 backdrop-blur-xl shadow-[0_0_20px_rgba(157,0,255,0.3)]">
              <Briefcase className="size-3.5 text-purple-400" />
              <span>Join The Dragon Collective</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black uppercase tracking-tight text-white leading-[0.88]">
              Build The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-300 to-amber-300 drop-shadow-[0_0_35px_rgba(157,0,255,0.5)]">Unbuilt</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              We&apos;re looking for curious, autonomous engineers, artists, and designers who want to craft world-class 3D and 2D games without industrial crunch.
            </p>
          </div>
        </section>

        {/* ═══ 2. STUDIO BENEFITS & CULTURE (DARK NEON STYLING) ═══ */}
        <section className="container-site relative z-10 py-16">
          <div className="mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
              [ WHY DRAGON STUDIOS ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-wide">
              Studio Benefits & Culture
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: "Zero-Crunch Guarantee", 
                desc: "Predictable milestones and strict work-life boundaries with transparent sprint roadmaps.", 
                icon: ShieldCheck, 
                borderGlow: "border-emerald-500/35 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,217,139,0.35)]",
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-500/15 border-emerald-500/40"
              },
              { 
                title: "Top-Tier Hardware", 
                desc: "Custom dual-GPU workstations & devkits shipped directly to your home office.", 
                icon: Cpu, 
                borderGlow: "border-cyan-500/35 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.35)]",
                iconColor: "text-cyan-400",
                iconBg: "bg-cyan-500/15 border-cyan-500/40"
              },
              { 
                title: "100% Global Remote", 
                desc: "Work from anywhere in the world with flexible hours, high autonomy, and asynchronous velocity.", 
                icon: MapPin, 
                borderGlow: "border-purple-500/35 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(157,0,255,0.35)]",
                iconColor: "text-purple-400",
                iconBg: "bg-purple-500/15 border-purple-500/40"
              },
              { 
                title: "Creative Sabbatical", 
                desc: "4 weeks paid annual research sabbatical to prototype personal games & creative ideas.", 
                icon: Sparkles, 
                borderGlow: "border-amber-500/35 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(255,184,0,0.35)]",
                iconColor: "text-amber-400",
                iconBg: "bg-amber-500/15 border-amber-500/40"
              },
            ].map((perk, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "rounded-3xl bg-[#050D24]/90 p-7 border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-lg",
                  perk.borderGlow
                )}
              >
                <div>
                  <div className={cn("size-12 rounded-2xl border flex items-center justify-center mb-5", perk.iconBg)}>
                    <perk.icon className={cn("size-6", perk.iconColor)} />
                  </div>
                  <h3 className="text-lg font-heading font-black text-white uppercase tracking-wide">{perk.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3. INTERACTIVE OPEN ROLES BOARD ═══ */}
        <section className="container-site relative z-10 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                [ CAREER OPPORTUNITIES ]
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-wide">
                Open Positions
              </h2>
            </div>

            {/* Department Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#050D24]/90 p-1.5 border border-purple-500/30 backdrop-blur-xl">
                {["All", "Engineering", "Art & Animation", "Audio"].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={cn(
                      "rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all",
                      selectedDept === dept 
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(157,0,255,0.4)]" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="grid gap-6">
            {filteredJobs.length === 0 ? (
              <div className="rounded-3xl bg-[#050D24]/90 p-12 text-center border border-purple-500/30 backdrop-blur-2xl">
                <p className="text-lg font-heading font-bold text-white">No roles match your selected filter.</p>
                <button
                  onClick={() => setSelectedDept("All")}
                  className="mt-4 text-xs font-mono font-bold text-purple-400 underline hover:text-purple-300"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative rounded-3xl bg-[#050D24]/90 p-8 border border-purple-500/30 hover:border-purple-400/80 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl hover:shadow-[0_0_35px_rgba(157,0,255,0.3)] backdrop-blur-2xl"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-mono font-bold text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(157,0,255,0.2)]">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                        <MapPin className="size-3 text-cyan-400" />
                        <span>100% Global Remote</span>
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-mono font-medium text-slate-300 border border-white/10">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-heading font-black text-white group-hover:text-purple-200 transition-colors uppercase tracking-wide">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
                      {job.summary}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setApplyModalJob(job)}
                      className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(157,0,255,0.4)] hover:shadow-[0_0_30px_rgba(157,0,255,0.7)] hover:-translate-y-0.5 active:scale-95 transition-all w-full lg:w-auto"
                    >
                      <span>Apply For Position</span>
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ═══ 4. 4-STEP HIRING PIPELINE ═══ */}
        <section className="container-site relative z-10 py-20">
          <div className="mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
              [ TRANSPARENT EVALUATION ]
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-wide">
              The Hiring Pipeline
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Application Sync", desc: "Review of portfolio, C++ codebase samples, or technical art reels with prompt feedback." },
              { step: "02", title: "Technical Conversation", desc: "1-on-1 video sync with a lead to discuss past shipped games and architectural vision." },
              { step: "03", title: "System Deep-Dive", desc: "Hands-on architectural blockout or design breakdown (no unpaid take-home work)." },
              { step: "04", title: "Offer & Onboarding", desc: "Competitive equity package, hardware stipend, and immediate devkit delivery." },
            ].map((st) => (
              <div 
                key={st.step} 
                className="rounded-3xl bg-[#050D24]/90 p-7 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-lg backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(157,0,255,0.5)]">
                    {st.step}
                  </span>
                  <h3 className="mt-3 text-lg font-heading font-black text-white uppercase tracking-wide">{st.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ═══ APPLICATION MODAL ═══ */}
      <AnimatePresence>
        {applyModalJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#050D24] p-8 sm:p-10 border border-purple-500/40 my-8 shadow-[0_0_50px_rgba(157,0,255,0.4)]"
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-5" />
              </button>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="size-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,217,139,0.4)]">
                    <Check className="size-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-white uppercase">Application Transmitted!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                    Thank you for applying for <strong>{applyModalJob.title}</strong>. Our engineering leads will review your portfolio and reach out within 3 business days.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-heading font-bold text-xs uppercase tracking-widest shadow-lg"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                      [ DIRECT APPLICATION ]
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mt-1">
                      {applyModalJob.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">{applyModalJob.department} • {applyModalJob.location}</p>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-200 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Maya Sharma"
                        className="w-full rounded-2xl bg-black/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 border border-purple-500/30 focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-200 uppercase mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-2xl bg-black/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 border border-purple-500/30 focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-200 uppercase mb-1.5">Portfolio / GitHub / ArtStation Link</label>
                      <input
                        type="url"
                        required
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://github.com/username or portfolio link"
                        className="w-full rounded-2xl bg-black/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 border border-purple-500/30 focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-200 uppercase mb-1.5">Cover Note / Shipped Titles Summary</label>
                      <textarea
                        rows={3}
                        required
                        value={applicantNote}
                        onChange={(e) => setApplicantNote(e.target.value)}
                        placeholder="Tell us about your C++ / HLSL experience, shipped titles, or technical achievements..."
                        className="w-full rounded-2xl bg-black/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 border border-purple-500/30 focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={closeModal} 
                        className="px-5 py-2.5 rounded-2xl text-xs font-mono font-bold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={formLoading} 
                        className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-heading font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(157,0,255,0.5)] active:scale-95 transition-all"
                      >
                        {formLoading ? <span>Transmitting...</span> : <><span>Submit Application</span><Send className="size-3.5" /></>}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
