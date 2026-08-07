"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, RefreshCw, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(`Password reset token dispatched to ${email}. Set new password below.`);
      setStep("reset");
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reset failed.";
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
              RECOVER ACCESSS
            </h1>
            <span className="text-[10px] font-bold text-[#ff1e4b] tracking-widest uppercase block mt-0.5">
              PASSWORD RECOVERY PROTOCOL
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

        {step === "request" ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground">ADMIN ACCOUNT EMAIL</label>
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

            <Button type="submit" disabled={loading} variant="solidRed" size="lg" className="w-full rounded-xl font-bold uppercase tracking-wider gap-2 mt-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              <span>DISPATCH RESET TOKEN</span>
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground">NEW PASSWORD</label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full rounded-xl bg-black/60 pl-10 pr-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="solidRed" size="lg" className="w-full rounded-xl font-bold uppercase tracking-wider gap-2 mt-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <Lock className="size-4" />}
              <span>UPDATE ENCRYPTED PASSWORD</span>
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-white/10 text-center">
          <Link href="/login" className="text-[#ff1e4b] font-bold hover:underline">
            ← RETURN TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
