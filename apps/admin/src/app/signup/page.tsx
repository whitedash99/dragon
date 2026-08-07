"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("EDITOR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed.");
      }

      setSuccess("Admin account provisioned! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center p-4 font-mono text-xs text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff1e4b]/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-heavy p-8 sm:p-10 border border-white/15 space-y-6 relative z-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 rounded-2xl bg-gradient-to-tr from-[#ff1e4b] to-purple-600 items-center justify-center font-black text-white text-xl shadow-lg shadow-[#ff1e4b]/30 font-heading">
            D
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight font-heading text-white">
              CREATE ADMIN ACCOUNT
            </h1>
            <span className="text-[10px] font-bold text-[#ff1e4b] tracking-widest uppercase block mt-0.5">
              ENTERPRISE SAAS REGISTRATION
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-muted-foreground">FULL NAME</label>
            <div className="relative">
              <User className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kaelen Voss"
                className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-muted-foreground">ADMIN EMAIL</label>
            <div className="relative">
              <Mail className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@dragonstudios.com"
                className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-muted-foreground">ADMIN ROLE</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl bg-black/60 px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
            >
              <option value="ADMIN">Administrator</option>
              <option value="DEVELOPER">Developer / DevOps</option>
              <option value="SUPPORT">Support Agent</option>
              <option value="EDITOR">Content Editor</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground">PASSWORD</label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-black/60 pl-10 pr-3 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-black/60 pl-10 pr-3 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} variant="solidRed" size="lg" className="w-full rounded-xl font-bold uppercase tracking-wider gap-2 mt-2">
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            <span>PROVISION ADMIN USER</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <span className="text-[10px] text-muted-foreground">ALREADY HAVE AN ADMIN ACCOUNT? </span>
          <Link href="/login" className="text-[#ff1e4b] font-bold hover:underline">
            SIGN IN HERE →
          </Link>
        </div>
      </div>
    </div>
  );
}
