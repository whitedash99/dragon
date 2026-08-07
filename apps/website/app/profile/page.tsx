"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Edit3, 
  Trophy, 
  Clock, 
  Gamepad2, 
  BarChart3, 
  MapPin, 
  Calendar, 
  LifeBuoy,
  X, 
  Save, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success) {
        setUserData(data.user);
        setEditName(data.user.name || "");
        if (data.tickets) setTickets(data.tickets);
      }
    } catch (e) {
      console.error("Error loading user profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchProfile();
    });
    return () => { isMounted = false; };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditOpen(false);
        fetchProfile();
      }
    } catch (e) {
      console.error("Save profile error", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <DashboardNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        {/* Profile Header Card */}
        <section className="container-site relative z-10 mb-12">
          <div className="rounded-3xl glass-heavy overflow-hidden border border-white/15 shadow-2xl">
            {/* Banner Artwork */}
            <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-dragon-600 via-purple-900 to-[#ff1e4b] relative p-8 flex items-end">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#ff1e4b] border border-white/20 backdrop-blur-md">
                  DRAGONID VERIFIED PLAYER
                </span>
                <Button
                  onClick={() => setIsEditOpen(true)}
                  variant="glass"
                  size="sm"
                  className="rounded-full gap-2 text-xs border-white/30 backdrop-blur-md font-mono"
                >
                  <Edit3 className="size-3.5" />
                  <span>EDIT PROFILE</span>
                </Button>
              </div>
            </div>

            {/* Profile Details Header */}
            <div className="p-8 sm:p-10 pt-0 relative font-mono">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-8">
                <div className="flex items-end gap-6">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#ff1e4b] to-purple-600 text-3xl font-black text-white shadow-2xl border-4 border-[#050505] shrink-0 font-heading">
                    {userData?.name ? userData.name[0] : "D"}
                  </div>

                  <div>
                    <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl font-heading">
                      {loading ? "Loading..." : userData?.name || "Player Insider"}
                    </h1>
                    <span className="text-xs text-[#ff1e4b] font-mono block mt-0.5">
                      {userData?.email || "user@dragonstudios.com"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="max-w-3xl">
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Official DragonID player profile. Access cloud saves, beta playtests, community trophies, and support ticket history.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-6 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>ROLE: {userData?.role || "PLAYER"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-[#ff1e4b]" />
                    <span>MEMBER SINCE {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "2026"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Tickets Showcase Section */}
        <section className="container-site relative z-10 mb-16 font-mono text-xs">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                SUPPORT TICKETS HISTORY
              </span>
              <h2 className="mt-0.5 text-2xl font-black uppercase text-white font-heading">
                YOUR RECENT SUPPORT REQUESTS
              </h2>
            </div>

            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-white/10" asChild>
              <Link href="/contact">
                <span>SUBMIT NEW TICKET</span>
                <ExternalLink className="size-3.5 text-[#ff1e4b]" />
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl glass-heavy p-6 border border-white/15 space-y-3">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                Loading your support ticket history...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-sans">
                You have no support tickets submitted. Visit the Contact page to create a ticket.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#ff1e4b]">{t.ticketId}</span>
                      <span className="text-[10px] text-muted-foreground">• {t.category}</span>
                    </div>
                    <span className="text-sm font-bold text-white block mt-0.5 font-sans">{t.subject}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px] uppercase">
                      STATUS: {t.status}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-xl text-[11px] h-8 border-white/10" asChild>
                      <Link href={`/support/${t.ticketId}`}>
                        <span>TRACK</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-mono text-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl glass-heavy p-8 border border-white/20 space-y-6"
            >
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>

              <div>
                <h2 className="text-2xl font-black uppercase text-white font-heading">EDIT DRAGONID PROFILE</h2>
                <p className="text-xs text-muted-foreground mt-1">Update your display name stored in PostgreSQL.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase">Full Name / Display Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-4 py-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button type="button" onClick={() => setIsEditOpen(false)} variant="ghost" size="sm" className="rounded-xl">
                    CANCEL
                  </Button>
                  <Button type="submit" disabled={saving} variant="solidRed" size="sm" className="rounded-xl gap-2">
                    <Save className="size-3.5" />
                    <span>{saving ? "SAVING..." : "SAVE CHANGES"}</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
