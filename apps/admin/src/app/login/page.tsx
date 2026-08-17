"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  Sparkles,
  KeyRound,
  Copy,
  Check,
  Wand2,
  Sliders,
  ShieldAlert
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

export default function LoginPage() {
  const router = useRouter();
  
  // Login Form States (NO PRE-FILLED SENSITIVE PASSWORDS)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showOwnerResetModal, setShowOwnerResetModal] = useState(false);

  // Form handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Password Generator States
  const [genLength, setGenLength] = useState(18);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // Owner Direct Password Set State
  const [ownerTargetEmail, setOwnerTargetEmail] = useState("whitedash99@gmail.com");
  const [ownerNewPassword, setOwnerNewPassword] = useState("");
  const [ownerKey, setOwnerKey] = useState("");
  const [ownerSetLoading, setOwnerSetLoading] = useState(false);
  const [ownerSetSuccess, setOwnerSetSuccess] = useState<string | null>(null);
  const [ownerSetError, setOwnerSetError] = useState<string | null>(null);

  // Secure Password Generator Logic
  const generateSecurePassword = useCallback(() => {
    let chars = "";
    if (genUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (genLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (genNumbers) chars += "0123456789";
    if (genSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);

    let result = "";
    for (let i = 0; i < genLength; i++) {
      result += chars[array[i] % chars.length];
    }

    setGeneratedPassword(result);
    setCopied(false);
  }, [genLength, genUpper, genLower, genNumbers, genSymbols]);

  useEffect(() => {
    generateSecurePassword();
  }, [generateSecurePassword]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleApplyGeneratedPassword = () => {
    setPassword(generatedPassword);
    setShowGeneratorModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Check credentials.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOwnerSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerSetLoading(true);
    setOwnerSetError(null);
    setOwnerSetSuccess(null);

    try {
      const res = await fetch("/api/auth/owner-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: ownerTargetEmail.trim(),
          newPassword: ownerNewPassword,
          securityCode: ownerKey,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update owner password.");
      }

      setOwnerSetSuccess(`Password successfully updated for ${ownerTargetEmail}! You can now sign in.`);
      setPassword(ownerNewPassword);
      setEmail(ownerTargetEmail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating owner password.";
      setOwnerSetError(msg);
    } finally {
      setOwnerSetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 font-sans flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Radiant Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Dragon Studios Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <DragonLogoIcon className="size-16" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>Dragon Studios Admin OS</span>
            </h1>
            <p className="text-xs text-blue-300/80 mt-1 font-medium">
              Enterprise Identity Platform (DIP) — Owner & Staff Authentication
            </p>
          </div>
        </div>

        {/* High-Contrast Obsidian & Electric Blue Card */}
        <div className="bg-[#0B132B]/95 border border-blue-500/30 rounded-2xl p-8 space-y-6 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                Company / Owner Email
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3.5 top-3.5 text-blue-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="whitedash99@gmail.com or dragongamingstudio1212@gmail.com"
                  className="w-full rounded-xl bg-[#060B18] pl-10 pr-4 py-3 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  Password
                </label>
                <div className="flex items-center gap-3">
                  {/* Open Password Generator */}
                  <button
                    type="button"
                    onClick={() => setShowGeneratorModal(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-semibold flex items-center gap-1"
                  >
                    <Wand2 className="size-3" />
                    <span>Generate Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-blue-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    Forgot?
                  </button>
                </div>
              </div>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-3.5 text-blue-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your private password"
                  className="w-full rounded-xl bg-[#060B18] pl-10 pr-10 py-3 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-slate-700 bg-[#060B18] text-blue-600 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>

              {/* Owner Password Manager Trigger */}
              <button
                type="button"
                onClick={() => setShowOwnerResetModal(true)}
                className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
              >
                <KeyRound className="size-3 text-blue-400" />
                <span>Owner Key Vault</span>
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold uppercase tracking-wider gap-2 py-3.5 text-xs shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              <span>AUTHENTICATE & ENTER ADMIN OS</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="size-3.5 text-blue-400" />
          <span>Strictly restricted to authorized Dragon Studios personnel.</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           1. BUILT-IN ENTERPRISE PASSWORD GENERATOR MODAL
         ══════════════════════════════════════════════════════════════════ */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-blue-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600/20 text-cyan-400">
                  <Wand2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Enterprise Password Generator</h3>
                  <p className="text-[10px] text-slate-400">Cryptographically secure high-entropy generator</p>
                </div>
              </div>
              <button onClick={() => setShowGeneratorModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="size-4" />
              </button>
            </div>

            {/* Generated Output Box */}
            <div className="relative">
              <div className="bg-[#060B18] border border-blue-500/40 rounded-xl p-3.5 font-mono text-sm text-cyan-300 break-all select-all flex items-center justify-between pr-12 shadow-inner">
                <span>{generatedPassword}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-white transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Length Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Password Length</span>
                  <span className="text-cyan-400 font-mono">{genLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={genLength}
                  onChange={(e) => setGenLength(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              {/* Character Options Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#060B18] border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genUpper}
                    onChange={(e) => setGenUpper(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-slate-300">Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#060B18] border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genLower}
                    onChange={(e) => setGenLower(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-slate-300">Lowercase (a-z)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#060B18] border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genNumbers}
                    onChange={(e) => setGenNumbers(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-slate-300">Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#060B18] border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genSymbols}
                    onChange={(e) => setGenSymbols(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-slate-300">Symbols (!@#$)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={generateSecurePassword}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="size-3.5" />
                <span>Regenerate</span>
              </button>
              <button
                type="button"
                onClick={handleApplyGeneratedPassword}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                <Check className="size-3.5" />
                <span>Use In Login</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
           2. OWNER MASTER KEY & DIRECT PASSWORD UPDATE VAULT
         ══════════════════════════════════════════════════════════════════ */}
      {showOwnerResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-blue-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600/20 text-cyan-400">
                  <ShieldAlert className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Owner Password Vault</h3>
                  <p className="text-[10px] text-slate-400">Set private master password for Supreme Owners</p>
                </div>
              </div>
              <button onClick={() => setShowOwnerResetModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="size-4" />
              </button>
            </div>

            {ownerSetSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                ✓ {ownerSetSuccess}
              </div>
            )}

            {ownerSetError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                ⚠️ {ownerSetError}
              </div>
            )}

            <form onSubmit={handleOwnerSetPassword} className="space-y-3.5 text-xs font-mono">
              <div className="space-y-1">
                <label className="block text-slate-300 font-bold uppercase text-[10px]">Owner Email Account</label>
                <select
                  value={ownerTargetEmail}
                  onChange={(e) => setOwnerTargetEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#060B18] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="whitedash99@gmail.com">whitedash99@gmail.com (Owner 1)</option>
                  <option value="dragongamingstudio1212@gmail.com">dragongamingstudio1212@gmail.com (Owner 2)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold uppercase text-[10px]">New Secret Password</label>
                <input
                  type="password"
                  required
                  value={ownerNewPassword}
                  onChange={(e) => setOwnerNewPassword(e.target.value)}
                  placeholder="Enter your new secret password"
                  className="w-full rounded-xl bg-[#060B18] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold uppercase text-[10px]">Owner Security Clearance Code</label>
                <input
                  type="password"
                  required
                  value={ownerKey}
                  onChange={(e) => setOwnerKey(e.target.value)}
                  placeholder="Enter DRAGON MASTER KEY"
                  className="w-full rounded-xl bg-[#060B18] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[9.5px] text-slate-400">Master Key: <code className="text-cyan-400">DRAGON-SUPREME-2026</code></span>
              </div>

              <button
                type="submit"
                disabled={ownerSetLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 text-xs flex items-center justify-center gap-2 mt-2"
              >
                {ownerSetLoading ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                <span>UPDATE OWNER PASSWORD</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
           3. FORGOT PASSWORD MODAL
         ══════════════════════════════════════════════════════════════════ */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-blue-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white uppercase text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-blue-400" />
                <span>Reset Password</span>
              </span>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                If your email address is registered, a password reset link has been dispatched via Resend.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-slate-300 font-sans text-xs">
                  Enter your registered staff or owner email address below to receive a secure reset link.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="whitedash99@gmail.com"
                  className="w-full rounded-xl bg-[#060B18] px-4 py-3 text-xs text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5">
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
