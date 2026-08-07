"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@dragonstudios.com");
  const [password, setPassword] = useState("DragonOwner#2026");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedOwner = async () => {
    setSeeding(true);
    setError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/auth/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedMessage(`Owner Account Ready! Email: owner@dragonstudios.com | Password: ${data.user?.defaultPassword || "DragonOwner#2026"}`);
        setEmail("owner@dragonstudios.com");
        setPassword(data.user?.defaultPassword || "DragonOwner#2026");
      } else {
        setError(data.error || "Seeding failed.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Seeding failed.";
      setError(msg);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center p-4 font-mono text-xs text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff1e4b]/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-heavy p-8 sm:p-10 border border-white/15 space-y-8 relative z-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-[#ff1e4b] to-purple-600 items-center justify-center font-black text-white text-2xl shadow-lg shadow-[#ff1e4b]/30">
            D
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight font-heading text-white">
              DRAGON ADMIN OS
            </h1>
            <span className="text-[10px] font-bold text-[#ff1e4b] tracking-widest uppercase block mt-1">
              ENTERPRISE SECURITY AUTHENTICATION
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {seedMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0" />
            <span>{seedMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-muted-foreground">ADMIN EMAIL</label>
            <div className="relative">
              <Mail className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@dragonstudios.com"
                className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-muted-foreground">PASSWORD</label>
            <div className="relative">
              <Lock className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} variant="solidRed" size="lg" className="w-full rounded-xl font-bold uppercase tracking-wider gap-2 mt-2">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            <span>AUTHENTICATE SESSION</span>
          </Button>
        </form>

        {/* Owner Account Provisioning Trigger */}
        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <span className="text-[10px] text-muted-foreground uppercase block">FIRST TIME INITIALIZATION?</span>
          <Button onClick={handleSeedOwner} disabled={seeding} variant="outline" size="sm" className="w-full rounded-xl text-xs gap-2 border-white/20">
            {seeding ? <RefreshCw className="size-3.5 animate-spin text-[#ff1e4b]" /> : <Sparkles className="size-3.5 text-[#ff1e4b]" />}
            <span>PROVISION OWNER ACCOUNT</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
