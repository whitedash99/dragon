"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";

export default function PrivacyPolicyPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main id="main-content" className="cinematic-page relative min-h-screen pb-32 pt-32">
        <div className="container-site relative z-10 max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 shadow-2xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400 mb-4">
                <ShieldCheck className="size-3.5" />
                <span>Legal & Privacy Compliance</span>
              </div>

              <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl">
                Privacy Policy
              </h1>

              <p className="mt-2 text-xs font-mono text-muted-foreground">
                Effective Date: July 31, 2026 • Version 2.4-PROD
              </p>
            </div>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pt-6 border-t border-white/10">
              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">1. Information We Collect</h2>
                <p>
                  Dragon Studios Inc. (&quot;Dragon Studios&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects player analytics data, account credentials, and communication logs to deliver multiplayer services and Dragon Launcher updates.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Data:</strong> Email address, username, encrypted password hashes, and connected gaming handles (Steam, Discord).</li>
                  <li><strong>Analytics Data:</strong> IP address, hardware specifications (CPU, GPU, RAM), crash logs, and low-latency netcode ping benchmarks.</li>
                  <li><strong>Payment Data:</strong> Handled securely by PCI-DSS compliant payment gateways. We do not store raw credit card numbers.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">2. How We Use Information</h2>
                <p>
                  We utilize collected analytics data strictly to maintain server cluster uptime, optimize 120 FPS display performance, prevent anti-cheat tampering, and dispatch requested game updates.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold uppercase text-white">3. Data Retention & User Rights</h2>
                <p>
                  You hold full right to request account data export or permanent deletion of your Dragon Account under GDPR and CCPA regulations. You can exercise this right at any time via your <Link href="/settings" className="text-dragon-400 hover:underline font-semibold">Account Settings</Link> page.
                </p>
              </section>

              <section className="space-y-3 pt-4 border-t border-white/10">
                <h2 className="text-xl font-bold uppercase text-white">4. Corporate Legal Contact</h2>
                <p className="text-xs">
                  For privacy inquiries, GDPR data requests, or legal notices, contact our compliance officer at:
                </p>
                <div className="rounded-2xl bg-black/40 p-4 border border-white/5 font-mono text-xs text-white space-y-1">
                  <p><strong>Dragon Studios Compliance Officer</strong></p>
                  <p>Email: legal@dragonstudios.com</p>
                  <p className="text-muted-foreground">[REGISTERED CORPORATE ADDRESS / ENTITY PLACEHOLDER]</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SceneBackground>
  );
}
