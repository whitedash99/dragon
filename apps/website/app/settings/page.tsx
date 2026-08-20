"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Lock,
  Bell,
  Eye,
  Gamepad2,
  Key,
  Check,
  Save,
  Monitor,
  Sparkles,
  RefreshCw,
  Crown
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "accounts" | "notifications" | "privacy">("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Toggles State
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  // Fetch real profile data
  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setDisplayName(data.user.name || "");
          setUsername(data.user.gamerTag || data.user.name || "player");
          setEmail(data.user.email || "");
          setBio(data.user.bio || "");
        }
      })
      .catch((e) => console.error("Error loading settings:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          gamerTag: username,
          bio: bio,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (e) {
      console.error("Save error", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-24 font-sans select-none">
        <section className="container-site relative z-10">
          
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Crown className="size-3.5 text-amber-400" />
                <span>DRAGONID EXECUTIVE SUITE</span>
              </span>
              <h1 className="mt-1 text-3xl sm:text-5xl font-black uppercase text-white tracking-tight font-heading">
                ACCOUNT SETTINGS
              </h1>
            </div>
            <div className="text-xs font-mono text-slate-400">
              DragonID Passport: <strong className="text-cyan-300">{email || "Authenticated"}</strong>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3 rounded-3xl bg-[#040A18]/90 p-4 border border-cyan-500/30 space-y-1.5 shadow-2xl backdrop-blur-xl">
              {[
                { id: "general", label: "General Info", icon: User },
                { id: "security", label: "Security & 2FA", icon: Lock },
                { id: "accounts", label: "Connected Platforms", icon: Gamepad2 },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "privacy", label: "Privacy & Visibility", icon: Eye },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition-all text-left cursor-pointer",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <tab.icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right Active Panel */}
            <div className="lg:col-span-9 rounded-3xl bg-[#040A18]/90 p-8 sm:p-12 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
              <AnimatePresence>
                {savedSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-500/15 p-4 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 shadow-lg"
                  >
                    <Check className="size-4 text-emerald-400" />
                    <span>✓ Account settings saved and synced to DragonID Cloud!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. General Tab */}
              {activeTab === "general" && (
                <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white font-heading">General Information</h2>
                    <p className="text-xs text-slate-400 font-sans mt-1">Manage your public gamer identity and profile bio.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold uppercase text-[10px]">DISPLAY NAME</label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Marcus"
                        className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold uppercase text-[10px]">USERNAME / GAMERTAG</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="DragonMaster"
                        className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-cyan-300 border border-slate-700 focus:outline-none focus:border-cyan-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-300 font-bold uppercase text-[10px]">EMAIL ADDRESS (READ-ONLY)</label>
                    <input
                      type="email"
                      readOnly
                      value={email}
                      className="w-full rounded-xl bg-[#02050E]/60 px-4 py-3 text-xs text-slate-400 border border-slate-800 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-300 font-bold uppercase text-[10px]">GAMER BIO</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Specializing in dark fantasy RPGs and anti-gravity racing..."
                      className="w-full rounded-xl bg-[#02050E] px-4 py-3 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={saving}
                      variant="glow"
                      size="lg"
                      className="rounded-xl gap-2 font-mono font-bold text-xs uppercase px-8 cursor-pointer"
                    >
                      {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                      <span>SAVE CHANGES</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* 2. Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8 font-mono text-xs">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white font-heading">Security & Authentication</h2>
                    <p className="text-xs text-slate-400 font-sans mt-1">Manage military-grade 2FA protection, encryption, and active sessions.</p>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-cyan-500/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white font-heading uppercase">Two-Factor Authentication (2FA)</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">Protects your DragonID with TOTP hardware token verification.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={cn(
                        "relative h-7 w-12 rounded-full transition-colors cursor-pointer",
                        twoFactor ? "bg-cyan-500" : "bg-slate-800"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 rounded-full bg-black transition-transform transform mt-1 ml-1",
                          twoFactor ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white font-heading uppercase">Active Sessions</h3>
                    <div className="rounded-2xl bg-black/40 p-4 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="size-5 text-cyan-400" />
                        <div>
                          <span className="block text-xs font-bold text-white">Windows 11 PC • Primary Session</span>
                          <span className="text-[10px] text-emerald-400">Current Active Connection</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Military TLS 1.3</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Connected Platforms Tab */}
              {activeTab === "accounts" && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white font-heading">Connected Gaming Identities</h2>
                    <p className="text-xs text-slate-400 font-sans mt-1">Link your consoles and external launcher accounts for cross-progression.</p>
                  </div>

                  {[
                    { platform: "Steam Identity", handle: "Connected: DragonMaster99", status: "LINKED", icon: Gamepad2, connected: true },
                    { platform: "Discord Account", handle: "Connected: DragonMaster#0001", status: "LINKED", icon: Sparkles, connected: true },
                    { platform: "PlayStation Network", handle: "Ready for Link", status: "CONNECT", icon: Gamepad2, connected: false },
                    { platform: "Xbox Live Network", handle: "Ready for Link", status: "CONNECT", icon: Gamepad2, connected: false },
                  ].map((acc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10 text-cyan-400">
                          <acc.icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white uppercase">{acc.platform}</h3>
                          <span className="text-[10px] text-slate-400 font-sans">{acc.handle}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                          acc.connected
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-blue-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black"
                        )}
                      >
                        {acc.status}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white font-heading">Notification Preferences</h2>
                    <p className="text-xs text-slate-400 font-sans mt-1">Configure your email and launcher alerts for beta releases.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/10">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase">Email Notifications</h3>
                        <p className="text-[10px] text-slate-400 font-sans">Receive newsletters, beta keys, and security alerts.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifs(!emailNotifs)}
                        className={cn("relative h-7 w-12 rounded-full transition-colors cursor-pointer", emailNotifs ? "bg-cyan-500" : "bg-slate-800")}
                      >
                        <span className={cn("inline-block h-5 w-5 rounded-full bg-black transition-transform mt-1 ml-1", emailNotifs ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/10">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase">Launcher Push Notifications</h3>
                        <p className="text-[10px] text-slate-400 font-sans">In-game party invites, tournament alerts, and friend messages.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPushNotifs(!pushNotifs)}
                        className={cn("relative h-7 w-12 rounded-full transition-colors cursor-pointer", pushNotifs ? "bg-cyan-500" : "bg-slate-800")}
                      >
                        <span className={cn("inline-block h-5 w-5 rounded-full bg-black transition-transform mt-1 ml-1", pushNotifs ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white font-heading">Privacy & Visibility</h2>
                    <p className="text-xs text-slate-400 font-sans mt-1">Control your public player hub visibility and game activity status.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/10">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase">Public Gamer Profile</h3>
                        <p className="text-[10px] text-slate-400 font-sans">Allow players to view your trophy case and game library.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPublicProfile(!publicProfile)}
                        className={cn("relative h-7 w-12 rounded-full transition-colors cursor-pointer", publicProfile ? "bg-cyan-500" : "bg-slate-800")}
                      >
                        <span className={cn("inline-block h-5 w-5 rounded-full bg-black transition-transform mt-1 ml-1", publicProfile ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/10">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase">Broadcast Live Game Status</h3>
                        <p className="text-[10px] text-slate-400 font-sans">Show when you are active in Embers of Valyria or Neon Drift.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowActivity(!showActivity)}
                        className={cn("relative h-7 w-12 rounded-full transition-colors cursor-pointer", showActivity ? "bg-cyan-500" : "bg-slate-800")}
                      >
                        <span className={cn("inline-block h-5 w-5 rounded-full bg-black transition-transform mt-1 ml-1", showActivity ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
