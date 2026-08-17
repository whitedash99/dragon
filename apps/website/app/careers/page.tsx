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
  Award,
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
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-28">
        {/* Hero Section */}
        <section className="container-site relative pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400">
              <Briefcase className="size-3.5" />
              <span>Join The Dragon Collective</span>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase tracking-tight sm:text-6xl lg:text-7rem text-white leading-[0.85]">
              Build The <span className="text-gradient">Unbuilt</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              We&apos;re looking for curious, autonomous engineers, artists, and designers who want to craft world-class AAA games without industrial crunch.
            </p>
          </div>
        </section>

        {/* Benefits & Perks Grid */}
        <section className="container-site relative z-10 py-16 border-t border-b border-white/10">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Why Dragon Studios
            </span>
            <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">
              Studio Benefits & Culture
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Zero-Crunch Guarantee", desc: "Predictable milestones and strict work-life boundaries.", icon: ShieldCheck, color: "text-emerald-400" },
              { title: "Top-Tier Hardware", desc: "Custom dual-GPU workstations & devkits shipped to your home.", icon: Cpu, color: "text-neon-cyan" },
              { title: "Global Relocation", desc: "Full relocation assistance & visa sponsorship for hybrid campuses.", icon: MapPin, color: "text-neon-purple" },
              { title: "Creative Sabbatical", desc: "4 weeks paid annual research sabbatical to explore personal projects.", icon: Sparkles, color: "text-amber-400" },
            ].map((perk, idx) => (
              <div key={idx} className="rounded-2xl glass-md p-6 border border-white/10">
                <perk.icon className={cn("size-7 mb-4", perk.color)} />
                <h3 className="text-lg font-bold text-white">{perk.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Open Roles Board */}
        <section className="container-site relative z-10 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Career Opportunities
              </span>
              <h2 className="mt-2 text-4xl font-black uppercase text-white">
                Open Positions
              </h2>
            </div>

            {/* Department & Location Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full glass-sm p-1.5 border border-white/10">
                {["All", "Engineering", "Art & Animation", "Design", "Audio"].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                      selectedDept === dept ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
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
              <div className="rounded-2xl glass-md p-12 text-center border border-white/10">
                <p className="text-lg font-bold text-white">No roles match your selected filter.</p>
                <button
                  onClick={() => { setSelectedDept("All"); setSelectedLoc("All"); }}
                  className="mt-4 text-xs font-bold text-dragon-400 underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative rounded-2xl glass-heavy p-8 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="rounded-full bg-dragon-500/20 px-3 py-0.5 text-xs font-bold text-dragon-300 border border-dragon-500/30">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-0.5 text-xs font-medium text-muted-foreground border border-white/5 flex items-center gap-1">
                        <MapPin className="size-3 text-neon-cyan" />
                        <span>{job.location}</span>
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-0.5 text-xs font-medium text-muted-foreground border border-white/5">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-dragon-200 transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                      {job.summary}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      onClick={() => setApplyModalJob(job)}
                      variant="glow"
                      size="lg"
                      className="rounded-full gap-2 w-full lg:w-auto"
                    >
                      <span>Apply For Position</span>
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4-Step Hiring Process */}
        <section className="container-site relative z-10 py-24 border-t border-white/10">
          <div className="mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Transparent Evaluation
            </span>
            <h2 className="mt-2 text-4xl font-black uppercase text-white">
              The Hiring Pipeline
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Application Sync", desc: "Review of portfolio, C++ codebase samples, or technical art reels." },
              { step: "02", title: "Technical / Creative Conversation", desc: "1-on-1 video sync with a peer lead to discuss past projects & architecture." },
              { step: "03", title: "System Deep-Dive", desc: "Hands-on architectural blockout or design breakdown (no unpaid take-home work)." },
              { step: "04", title: "Offer & Onboarding", desc: "Competitive compensation package, relocation planning, and team match." },
            ].map((st) => (
              <div key={st.step} className="rounded-2xl glass-md p-6 border border-white/10">
                <span className="text-3xl font-black text-dragon-400">{st.step}</span>
                <h3 className="mt-3 text-lg font-bold text-white">{st.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {applyModalJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-2xl glass-heavy p-8 border border-white/20 my-8"
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-5" />
              </button>

              {formSubmitted ? (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                    <Check className="size-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase">Application Transmitted!</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you for applying for <strong>{applyModalJob.title}</strong>. Our engineering leads will review your portfolio and reach out within 3 business days.
                  </p>
                  <Button onClick={closeModal} variant="glow" size="sm" className="mt-6 rounded-full">
                    Done
                  </Button>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold text-dragon-400 uppercase tracking-widest">
                    Direct Application
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {applyModalJob.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{applyModalJob.department} • {applyModalJob.location}</p>

                  <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Maya Sharma"
                        className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Portfolio / GitHub / ArtStation Link</label>
                      <input
                        type="url"
                        required
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://github.com/username or portfolio link"
                        className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Cover Note / Shipped Titles Summary</label>
                      <textarea
                        rows={3}
                        required
                        value={applicantNote}
                        onChange={(e) => setApplicantNote(e.target.value)}
                        placeholder="Tell us about your C++ / HLSL experience, shipped titles, or technical achievements..."
                        className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <Button type="button" onClick={closeModal} variant="ghost" size="sm">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={formLoading} variant="glow" size="sm" className="rounded-full gap-2">
                        {formLoading ? <span>Transmitting...</span> : <><span>Submit Application</span><Send className="size-3.5" /></>}
                      </Button>
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
