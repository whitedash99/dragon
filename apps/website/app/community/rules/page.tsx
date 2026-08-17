"use client";

import React from "react";
import { ShieldCheck, AlertOctagon, HeartHandshake, Lock, Flame, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";

const RULES = [
  {
    num: "01",
    title: "Respect All Insiders & Studio Staff",
    desc: "Treat all community members, moderators, and studio developers with basic courtesy. Harassment, targeted attacks, hate speech, and discrimination will result in an immediate and permanent hardware ban.",
  },
  {
    num: "02",
    title: "Zero Tolerance on Cheating & Exploits",
    desc: "Do not share, sell, or promote game memory injections, aimbots, packet tampering tools, or glitch exploits. All reports are verified directly by our telemetry pipeline.",
  },
  {
    num: "03",
    title: "Anti-Spam & Self-Promotion Limits",
    desc: "Refrain from sending duplicate messages, flood transmissions, unsolicited commercial promotions, or phishing links. Keep discussions on-topic in their designated channels.",
  },
  {
    num: "04",
    title: "Account Security & Privacy",
    desc: "Never impersonate Dragon Studios staff or request another member's credentials. Staff will never ask for your passwords or recovery codes in community chat.",
  },
  {
    num: "05",
    title: "Constructive Feedback & Bug Reporting",
    desc: "We actively welcome feedback! When reporting engine or gameplay issues, include reproduction steps, hardware specifications, and relevant screenshots in #suggestions or the Forums.",
  },
];

export default function CommunityRulesPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24">
        <CommunityNav />

        <section className="container-site relative z-10 max-w-4xl mx-auto my-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-[11px] text-cyan-300 font-mono font-bold uppercase">
              <ShieldCheck className="size-3.5 text-cyan-400" />
              <span>Studio Code of Conduct</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
              Community Safety & Rules
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Our standards for ensuring a high-performance, respectful, and competitive environment for all players.
            </p>
          </div>

          <div className="space-y-4">
            {RULES.map((rule) => (
              <div
                key={rule.num}
                className="rounded-3xl bg-[#07111F]/80 backdrop-blur-xl p-6 sm:p-8 border border-blue-500/20 flex flex-col sm:flex-row items-start gap-6 shadow-xl shadow-black/40"
              >
                <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-mono font-black text-lg text-white shadow-lg shadow-blue-500/30 shrink-0">
                  {rule.num}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">{rule.title}</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-[#0B132B] border border-blue-500/30 text-center space-y-2">
            <h4 className="font-bold text-sm text-white">Need to Report a Violation?</h4>
            <p className="text-xs text-slate-400">
              Hover over any chat message and click the Flag icon, or submit a formal ticket via the Support Desk.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
