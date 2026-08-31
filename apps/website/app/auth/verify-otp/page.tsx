"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  ChevronLeft,
  Key
} from "lucide-react";
import Link from "next/link";
import { DragonLogoIcon } from "@/components/ui/dragon-logo";
import { soundFx } from "@/lib/sound-effects";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 5-minute expiry countdown (300 seconds)
  const [expiresSeconds, setExpiresSeconds] = useState(300);
  // 60-second resend cooldown
  const [cooldown, setCooldown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiry Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cooldown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus first digit input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete 6 digits
    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    soundFx.playClick();

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid or expired verification code.");
      }

      setSuccess(true);
      soundFx.playForgeComplete();

      // Upgrade NextAuth session
      await updateSession({ otpVerified: true });

      setTimeout(() => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (!data.hasDragonId) {
          window.location.href = "/welcome";
        } else {
          window.location.href = "/dashboard";
        }
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired verification code.";
      setError(msg);
      soundFx.playClick();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError(null);
    setStatusMessage(null);
    soundFx.playClick();

    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Please wait before requesting another code.");
      }

      setStatusMessage("Verification code sent.");
      setCooldown(60);
      setExpiresSeconds(300);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      soundFx.playSlideWhoosh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please wait before requesting another code.";
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const rawEmail = session?.user?.email || "";
  const maskedEmail = rawEmail && rawEmail.includes("@")
    ? `${rawEmail.split("@")[0].slice(0, 1)}***@${rawEmail.split("@")[1]}`
    : "your Google email";

  return (
    <div className="min-h-screen w-full bg-[#02040A] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative select-none font-sans overflow-hidden">
      {/* Background Multi-Neon Auroras */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00E5FF]/15 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#FF2BD6]/15 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#7C3CFF]/15 rounded-full blur-[200px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-[#03091D]/90 backdrop-blur-2xl border-2 border-cyan-500/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(0,229,255,0.2)] space-y-7 overflow-hidden"
      >
        {/* Top Multi-Neon Accent Line */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#7C3CFF] to-[#FF2BD6]"
        />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="p-3 rounded-2xl bg-gradient-to-b from-[#08183d] to-[#02050f] border border-cyan-400/50 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <DragonLogoIcon size="md" />
            </div>
          </div>
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#A855F7] to-[#FF2BD6] block">
            DRAGON GAMING STUDIOS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            VERIFY YOUR DRAGON ACCOUNT
          </h1>
          <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm mx-auto">
            We sent a verification code to your Google email.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Mail className="size-3 text-cyan-400" />
            <span>{maskedEmail}</span>
          </div>
        </div>

        {/* Status / Error Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-300 font-mono flex items-center gap-2"
            >
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-3 text-xs text-cyan-300 font-mono flex items-center gap-2"
            >
              <CheckCircle2 className="size-4 shrink-0 text-cyan-400" />
              <span>{statusMessage}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-mono flex items-center gap-2"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-bold uppercase tracking-wider">VERIFIED</span>
                <span className="text-[11px] text-emerald-200">AUTHENTICATION SECURE • Transitioning...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6-Box OTP Inputs */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={loading || success}
                className="w-10 h-12 xs:w-12 xs:h-14 sm:w-14 sm:h-16 rounded-2xl bg-[#02050E] text-center font-mono text-lg sm:text-2xl font-black text-white border-2 border-cyan-500/30 focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {/* Expiry Timer & Resend */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-cyan-400" />
              <span>Code expires in <strong className="text-cyan-300">{formatTime(expiresSeconds)}</strong></span>
            </span>

            {/* Resend Action */}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending || loading}
              className={`font-bold transition-colors cursor-pointer ${
                cooldown > 0 || resending
                  ? "text-slate-500 cursor-not-allowed"
                  : "text-cyan-400 hover:text-cyan-300 underline uppercase"
              }`}
            >
              {resending ? (
                "Sending..."
              ) : cooldown > 0 ? (
                `Resend code (${cooldown}s)`
              ) : (
                "RESEND CODE"
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={loading || success || otp.join("").length !== 6}
          className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#1685FF] to-[#7C3CFF] text-[#020617] text-xs font-mono font-black uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          <span>{loading ? "VERIFYING IDENTITY..." : "VERIFY →"}</span>
        </button>

        {/* Return to login option */}
        <div className="border-t border-white/10 pt-4 text-center">
          <Link
            href="/login"
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            <ChevronLeft className="size-3.5" />
            <span>Change account</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
