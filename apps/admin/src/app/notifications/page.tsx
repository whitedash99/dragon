"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Bell, Check, ShieldCheck, Gamepad2, Users, HardDrive, Trash2 } from "lucide-react";
import { GlassCard, GlassStat, GlassButton } from "@/components/ui/glass";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Game Snapshot Created", desc: "Uncharted Drive: Beyond snapshot v1 published to Neon DB.", time: "10 mins ago", unread: true },
    { id: "2", title: "AI Vision Analysis Completed", desc: "Focal coordinates and text safe-areas calculated for new banner.", time: "1 hour ago", unread: false },
    { id: "3", title: "Security Posture Verified", desc: "Database connection pool and session tokens passed SAIF audit.", time: "3 hours ago", unread: false },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider">Dragon Control • Notification Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Studio Alerts & Notifications</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">Real-time alerts regarding releases, AI audits, and staff actions.</p>
            </div>

            <button
              onClick={markAllRead}
              className="px-3.5 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-bold font-mono shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer transition-all"
            >
              Mark all as read
            </button>
          </div>

          <GlassCard className="divide-y divide-cyan-500/15 overflow-hidden bg-[#03091D]/90 border border-cyan-500/30">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 flex items-start justify-between gap-3 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={"size-2.5 rounded-full mt-1.5 shrink-0 " + (n.unread ? "bg-cyan-400 shadow-[0_0_8px_#00E5FF]" : "bg-slate-600")} />
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{n.title}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-cyan-400/70 font-mono pt-1 block">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
