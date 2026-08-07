"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Eye, 
  Gamepad2, 
  Key, 
  Trash2, 
  Check, 
  Save, 
  AlertTriangle,
  Monitor,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { currentUser } from "@/data/userData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "accounts" | "notifications" | "privacy">("general");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <DashboardNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        <section className="container-site relative z-10">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Account Control Center
            </span>
            <h1 className="mt-1 text-4xl font-black uppercase text-white sm:text-5xl">
              Account Settings
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3 rounded-2xl glass-heavy p-4 border border-white/15 space-y-1">
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
                    "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <tab.icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right Active Panel */}
            <div className="lg:col-span-9 rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15">
              {savedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-500/20 p-4 text-emerald-400 text-xs font-semibold border border-emerald-500/30"
                >
                  <Check className="size-4" />
                  <span>Account settings updated successfully!</span>
                </motion.div>
              )}

              {/* General Tab */}
              {activeTab === "general" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-2xl font-black uppercase text-white">General Information</h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue={currentUser.name}
                        className="w-full rounded-xl bg-black/40 px-4 py-3.5 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-2">Username</label>
                      <input
                        type="text"
                        defaultValue={currentUser.username}
                        className="w-full rounded-xl bg-black/40 px-4 py-3.5 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full rounded-xl bg-black/40 px-4 py-3.5 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue={currentUser.bio}
                      className="w-full rounded-xl bg-black/40 px-4 py-3.5 text-sm text-white border border-white/10 focus:outline-none focus:border-dragon-400"
                    />
                  </div>

                  <Button type="submit" variant="glow" size="lg" className="rounded-full gap-2">
                    <Save className="size-4" />
                    <span>Save Changes</span>
                  </Button>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-white">Security & Authentication</h2>
                    <p className="text-xs text-muted-foreground mt-1">Manage 2FA protection and password security.</p>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="flex items-center justify-between p-6 rounded-2xl glass-md border border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-emerald-400" />
                        <h3 className="text-base font-bold text-white">Two-Factor Authentication (2FA)</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Protects your Dragon Account with TOTP authenticator apps.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        twoFactor ? "bg-primary" : "bg-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 rounded-full bg-white transition-transform transform",
                          twoFactor ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-base font-bold text-white mb-4">Active Sessions</h3>
                    <div className="rounded-xl bg-black/30 p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="size-5 text-dragon-400" />
                        <div>
                          <span className="block text-xs font-bold text-white">Windows 11 PC • Bengaluru, India</span>
                          <span className="text-[10px] text-emerald-400">Current Active Session</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">Chrome v126</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Connected Accounts Tab */}
              {activeTab === "accounts" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black uppercase text-white">Connected Gaming Identities</h2>

                  {[
                    { platform: "Steam Identity", handle: "kaelen_voss_official", status: "Connected", icon: Gamepad2, connected: true },
                    { platform: "Discord Account", handle: "KaelenVoss#4092", status: "Connected", icon: Sparkles, connected: true },
                    { platform: "PlayStation Network", handle: "Not Linked", status: "Link Account", icon: Gamepad2, connected: false },
                    { platform: "Xbox Live Network", handle: "Not Linked", status: "Link Account", icon: Gamepad2, connected: false },
                  ].map((acc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-xl glass-md border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                          <acc.icon className="size-5 text-dragon-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{acc.platform}</h3>
                          <span className="text-xs text-muted-foreground">{acc.handle}</span>
                        </div>
                      </div>

                      <Button
                        variant={acc.connected ? "glass" : "glow"}
                        size="sm"
                        className="rounded-full text-xs"
                      >
                        {acc.status}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black uppercase text-white">Notification Preferences</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-xl glass-md border border-white/10">
                      <div>
                        <h3 className="text-sm font-bold text-white">Email Dispatches & Patch Notes</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Receive Dragon Engine updates & early playtest invites.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifs(!emailNotifs)}
                        className={cn("h-6 w-11 rounded-full transition-colors", emailNotifs ? "bg-primary" : "bg-white/20")}
                      >
                        <span className={cn("inline-block h-4 w-4 rounded-full bg-white transition-transform transform", emailNotifs ? "translate-x-6" : "translate-x-1")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl glass-md border border-white/10">
                      <div>
                        <h3 className="text-sm font-bold text-white">In-App Push Alerts</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Trophy unlocks and match notifications in Dragon Launcher.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPushNotifs(!pushNotifs)}
                        className={cn("h-6 w-11 rounded-full transition-colors", pushNotifs ? "bg-primary" : "bg-white/20")}
                      >
                        <span className={cn("inline-block h-4 w-4 rounded-full bg-white transition-transform transform", pushNotifs ? "translate-x-6" : "translate-x-1")} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black uppercase text-white">Privacy & Visibility</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-xl glass-md border border-white/10">
                      <div>
                        <h3 className="text-sm font-bold text-white">Public Player Profile</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Allow other players to view your trophies, level & games.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPublicProfile(!publicProfile)}
                        className={cn("h-6 w-11 rounded-full transition-colors", publicProfile ? "bg-primary" : "bg-white/20")}
                      >
                        <span className={cn("inline-block h-4 w-4 rounded-full bg-white transition-transform transform", publicProfile ? "translate-x-6" : "translate-x-1")} />
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-8 border-t border-red-500/20">
                    <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                        <AlertTriangle className="size-4" />
                        <span>Danger Zone — Delete Dragon Account</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Permanently delete your player profile, game licenses, and achievement data. This action is irreversible.
                      </p>
                      <Button variant="destructive" size="sm" className="mt-4 rounded-full text-xs">
                        Delete Account Permanently
                      </Button>
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
