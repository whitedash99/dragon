"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  Lock,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Copy,
  Check,
  Wand2,
  X,
  Crown,
  Zap,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";

const OWNER_EMAILS = [
  "whitedash99@gmail.com",
  "dragongamingstudio1212@gmail.com",
];

export default function LoginPage() {
  const router = useRouter();
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Owner Access Mode (Auto-unlocked when typing owner email or clicking owner toggle)
  const [ownerModeUnlocked, setOwnerModeUnlocked] = useState(false);
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState<string>("whitedash99@gmail.com");

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Form handling
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [directLoading, setDirectLoading] = useState(false);
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

  // Check if current email input matches an owner email
  const isOwnerEmailEntered = OWNER_EMAILS.includes(email.trim().toLowerCase());
  const showOwnerOptions = isOwnerEmailEntered || ownerModeUnlocked;

  // Keyboard shortcut: Ctrl + Shift + O to unlock Owner Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        setOwnerModeUnlocked((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    } catch {}
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
      setError("Failed to initialize Google authentication.");
      setGoogleLoading(false);
    }
  };

  const handleDirectOwnerLogin = async (targetEmail?: string) => {
    const ownerEmailToUse = targetEmail || email.trim() || selectedOwnerEmail;
    if (!ownerEmailToUse) return;

    setDirectLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "owner_direct_access", email: ownerEmailToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Owner direct access failed.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to access as Owner.";
      setError(msg);
    } finally {
      setDirectLoading(false);
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

  return (
    <div className="min-h-screen bg-[#02040A] text-slate-100 font-mono flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Radiant Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Dragon Studios Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setOwnerModeUnlocked((prev) => !prev)}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
              title="Dragon Studios Administrative OS — Click to toggle Owner Mode"
            >
              <DragonLogoIcon className="size-14 drop-shadow-[0_0_20px_#00E5FF]" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2 font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              <span>Dragon Control</span>
            </h1>
            <p className="text-xs text-cyan-400/80 font-mono">
              Studio Executive Command & Operations
            </p>
          </div>
        </div>

        {/* Level 4 3D Glass Login Card */}
        <div className="bg-[#03091D]/95 border border-cyan-500/35 rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_0_50px_rgba(0,229,255,0.2)] backdrop-blur-2xl">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-400/40 text-red-300 text-xs font-semibold flex items-center gap-2 font-mono">
              <span className="text-red-400 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* OWNER FAST-TRACK OPTIONS */}
          {showOwnerOptions && (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200 bg-[#02050E] p-4 rounded-2xl border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-bold uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1.5">
                  <Crown className="size-3.5 text-amber-400" />
                  <span>Supreme Owner Instant Access</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">✓ VERIFIED</span>
              </div>

              {/* Owner Email Selector */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono">
                {OWNER_EMAILS.map((oEmail) => (
                  <button
                    key={oEmail}
                    type="button"
                    onClick={() => {
                      setEmail(oEmail);
                      setSelectedOwnerEmail(oEmail);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold truncate transition-all text-left cursor-pointer border ${
                      email === oEmail || selectedOwnerEmail === oEmail
                        ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold"
                        : "bg-[#03091D] border-cyan-500/20 text-slate-400 hover:text-white"
                    }`}
                  >
                    ⚡ {oEmail.split("@")[0]}
                  </button>
                ))}
              </div>

              {/* 1. Google 1-Click */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full rounded-xl bg-[#03091D] hover:bg-[#040D28] border border-cyan-500/30 text-white font-bold text-xs py-2.5 px-4 flex items-center justify-center gap-2.5 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer disabled:opacity-50 font-mono"
              >
                {googleLoading ? (
                  <RefreshCw className="size-4 animate-spin text-cyan-400" />
                ) : (
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>

              {/* 2. Direct 1-Click Instant Entry */}
              <button
                type="button"
                onClick={() => handleDirectOwnerLogin()}
                disabled={directLoading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-black text-xs py-2.5 px-4 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer disabled:opacity-50 tracking-wide font-mono"
              >
                {directLoading ? (
                  <RefreshCw className="size-4 animate-spin text-black" />
                ) : (
                  <Zap className="size-4 text-black" />
                )}
                <span>⚡ Instant Owner 1-Click Entry →</span>
              </button>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-cyan-500/20" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase font-mono">or email & password</span>
                <div className="flex-1 h-px bg-cyan-500/20" />
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Input */}
            {/* Email or DragonID Input */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-cyan-400 font-bold text-xs">
                DragonID or Staff Email
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="DRG-2026-XXXX / whitedash99@gmail.com"
                  className="w-full rounded-xl bg-[#02050E] pl-10 pr-4 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 placeholder-slate-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <label className="block text-cyan-400 font-bold text-xs">
                  Personal Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-cyan-300 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full rounded-xl bg-[#02050E] pl-10 pr-10 py-2.5 text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 placeholder-slate-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between pt-1 font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-cyan-500/30 bg-[#02050E] text-cyan-400 focus:ring-0"
                />
                <span className="text-xs">Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => setShowGeneratorModal(true)}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                <Wand2 className="size-3 text-cyan-400" />
                <span>Password Generator</span>
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] text-black font-black font-mono uppercase tracking-wider gap-2 py-3 text-xs transition-all mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            >
              {loading ? <RefreshCw className="size-4 animate-spin text-black" /> : <ShieldCheck className="size-4 text-black" />}
              <span>AUTHENTICATE & ENTER ADMIN OS →</span>
            </button>
          </form>

          {/* Subtle Owner Access Mode Trigger */}
          <div className="pt-2 border-t border-cyan-500/20 text-center font-mono">
            <button
              type="button"
              onClick={() => setOwnerModeUnlocked((prev) => !prev)}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
            >
              <Crown className="size-3.5 text-amber-400" />
              <span>{ownerModeUnlocked ? "Hide Owner Quick-Track" : "⚡ Owner 1-Click Fast-Track"}</span>
              {ownerModeUnlocked ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="size-3 text-cyan-400" />
          <span>Strictly restricted to authorized Dragon Studios personnel.</span>
        </div>
      </div>

      {/* PASSWORD GENERATOR MODAL */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-[0_0_50px_rgba(0,229,255,0.25)] animate-in fade-in zoom-in duration-200 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  <Wand2 className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Enterprise Password Generator</h3>
                  <p className="text-xs text-slate-400">Cryptographically secure generator</p>
                </div>
              </div>
              <button onClick={() => setShowGeneratorModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-[#02050E] border border-cyan-500/30 rounded-xl p-3.5 font-mono text-sm text-cyan-300 break-all select-all flex items-center justify-between pr-12">
                <span>{generatedPassword}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all cursor-pointer border border-cyan-400/30"
              >
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={generateSecurePassword}
                className="flex-1 py-2.5 rounded-xl bg-[#02050E] border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <RefreshCw className="size-3.5 text-cyan-400" />
                <span>Regenerate</span>
              </button>
              <button
                type="button"
                onClick={handleApplyGeneratedPassword}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Use Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white text-sm">Reset Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs space-y-1">
                <p className="font-bold font-mono">Password Reset Dispatched</p>
                <p className="text-xs text-slate-300 font-mono">If an active account exists for {forgotEmail}, an email has been sent.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-mono">
                <p className="text-slate-400">Enter your email to receive a password reset link.</p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full rounded-xl bg-[#02050E] px-3.5 py-2.5 text-xs text-white placeholder-slate-600 border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.35)]"
                >
                  Send Reset Link →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
