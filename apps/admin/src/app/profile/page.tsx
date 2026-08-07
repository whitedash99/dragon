"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { User, Lock, ShieldCheck, Save, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string; department: string } | null>(null);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }
      })
      .catch((e) => console.error("Fetch profile error", e))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, newPassword: newPassword || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Profile & security settings updated successfully!");
        setNewPassword("");
      }
    } catch (e) {
      console.error("Profile update error", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                ENTERPRISE OPERATOR PROFILE
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                ADMIN ACCOUNT PROFILE
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
              Loading profile data...
            </div>
          ) : (
            <div className="max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 space-y-6">
              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* User Overview Header */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#ff1e4b] to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-lg font-heading">
                  {user?.name ? user.name[0] : "A"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">{user?.name}</h2>
                  <span className="text-xs text-muted-foreground block">{user?.email}</span>
                  <span className="inline-block mt-1 rounded bg-[#ff1e4b]/20 text-[#ff1e4b] border border-[#ff1e4b]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                    {user?.role} • {user?.department || "Operations"}
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">DISPLAY NAME</label>
                  <div className="relative">
                    <User className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">EMAIL ADDRESS (READ-ONLY)</label>
                  <div className="relative">
                    <ShieldCheck className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full rounded-xl bg-black/40 pl-10 pr-4 py-2.5 text-xs text-muted-foreground border border-white/5 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <span className="text-xs font-bold uppercase text-white block">UPDATE SECURITY CREDENTIALS</span>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">NEW PASSWORD</label>
                    <div className="relative">
                      <Lock className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep existing password..."
                        className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={saving} variant="solidRed" size="md" className="gap-2 rounded-xl">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                    <span>SAVE PROFILE CHANGES</span>
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
