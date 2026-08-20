"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { User, Lock, ShieldCheck, Save, RefreshCw, CheckCircle2, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string; department: string } | null>(null);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword) {
      setErrorMsg("Please enter a new personal password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Password confirmation does not match.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("✓ Your personal password has been securely saved to the database!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(data.error || "Failed to update password.");
      }
    } catch (e) {
      console.error("Profile update error", e);
      setErrorMsg("Failed to communicate with authentication server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                SUPREME OWNER SECURITY CREDENTIALS
              </span>
              <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mt-1 font-heading">
                Account & Personal Password
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-cyan-400" />
              Loading profile data...
            </div>
          ) : (
            <div className="space-y-6">
              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="text-rose-400 font-bold">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* User Overview Header */}
              <div className="bg-[#050C17]/95 border border-blue-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-500 flex items-center justify-center font-black text-black text-2xl shadow-lg font-mono">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "DS"}
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-white">{user?.name || "Executive Owner"}</h2>
                  <span className="text-xs text-slate-400 font-mono block">{user?.email}</span>
                  <span className="inline-block mt-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                    DIP ROLE: {user?.role || "OWNER"} ROOT
                  </span>
                </div>
              </div>

              {/* Personal Password Form */}
              <div className="bg-[#050C17]/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                    <Key className="size-4" />
                    <span>Set Your Own Private Personal Password</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enter your custom secret password below. It will be encrypted with military-grade bcrypt hashing in the database.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold uppercase text-[10px]">NEW PERSONAL PASSWORD</label>
                      <div className="relative">
                        <Lock className="size-4 absolute left-3.5 top-3 text-cyan-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Type your secret password..."
                          className="w-full rounded-xl bg-[#030712] pl-10 pr-10 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold uppercase text-[10px]">CONFIRM PASSWORD</label>
                      <div className="relative">
                        <Lock className="size-4 absolute left-3.5 top-3 text-cyan-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter secret password..."
                          className="w-full rounded-xl bg-[#030712] pl-10 pr-4 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs font-mono hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? <RefreshCw className="size-4 animate-spin text-black" /> : <Save className="size-4 text-black" />}
                      <span>SAVE MY PERSONAL PASSWORD →</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
