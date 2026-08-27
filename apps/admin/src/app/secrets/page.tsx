"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Lock, ShieldAlert, KeyRound, CheckCircle2, RotateCw, RefreshCw, EyeOff, History } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

interface SecretRecord {
  id: string;
  name: string;
  keyName: string;
  maskedValue: string;
  category: string;
  lastRotated: string;
  rotations?: { id: string; rotatedBy: string; reason: string; createdAt: string }[];
}

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<SecretRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSecret, setSelectedSecret] = useState<SecretRecord | null>(null);
  const [newMaskedValue, setNewMaskedValue] = useState("");
  const [rotationReason, setRotationReason] = useState("");
  const [rotating, setRotating] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSecrets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/secrets");
      const data = await res.json();
      if (data.success && Array.isArray(data.secrets)) {
        setSecrets(data.secrets);
      } else {
        setError(data.error || "Failed to load secrets vault.");
      }
    } catch {
      setError("An unexpected network error occurred while querying the secrets vault.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  const handleOpenRotate = (sec: SecretRecord) => {
    setSelectedSecret(sec);
    setNewMaskedValue(sec.maskedValue);
    setRotationReason("");
    setNoticeMsg(null);
  };

  const handleRotateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSecret) return;
    setRotating(true);
    setNoticeMsg(null);

    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretId: selectedSecret.id,
          newMaskedValue,
          reason: rotationReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNoticeMsg({ type: "success", text: "Secret metadata rotated successfully in audit vault." });
        setSelectedSecret(null);
        fetchSecrets();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Failed to rotate secret." });
      }
    } catch {
      setNoticeMsg({ type: "error", text: "Failed to rotate secret credential." });
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="size-3.5 text-cyan-400" />
                <span>Executive Secrets Vault & Rotation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Secrets & API Keys Governance
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchSecrets}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <RefreshCw className="size-3.5 text-cyan-400" />
                <span>Refresh Vault</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-400/40 text-rose-300 font-bold flex items-center gap-2 text-xs font-mono">
              <ShieldAlert className="size-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {noticeMsg && (
            <div className={`p-4 rounded-xl border font-bold flex items-center justify-between text-xs font-mono ${noticeMsg.type === "success" ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300" : "bg-rose-500/15 border-rose-400/40 text-rose-300"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Secrets Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs font-mono">
                <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-cyan-400" />
                Decrypting Secrets Vault metadata from PostgreSQL...
              </div>
            ) : (
              secrets.map((sec) => (
                <GlassCard key={sec.id} className="p-6 space-y-4 relative flex flex-col justify-between bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#02050E] text-cyan-300 border border-cyan-500/25 text-[10px] font-mono font-bold">
                        {sec.category}
                      </span>
                      <GlassBadge variant="published">
                        CONFIGURED
                      </GlassBadge>
                    </div>

                    <h3 className="font-bold text-white text-sm font-mono">{sec.name}</h3>
                    <code className="text-cyan-300 font-mono text-[11px] block bg-[#02050E] px-3 py-1.5 rounded-xl border border-cyan-500/20 truncate font-semibold">
                      {sec.keyName}
                    </code>

                    {/* Masked Value Display */}
                    <div className="flex items-center justify-between bg-[#02050E] p-3 rounded-xl border border-cyan-500/20 text-[11px] font-mono text-slate-300">
                      <span className="truncate">{sec.maskedValue}</span>
                      <EyeOff className="size-3.5 text-slate-500 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-cyan-500/20 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Last Rotated:</span>
                      <span className="text-white font-bold">{new Date(sec.lastRotated).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => handleOpenRotate(sec)}
                      className="w-full py-2 px-3 rounded-xl bg-[#02050E] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <RotateCw className="size-3.5 text-cyan-400" />
                      <span>Rotate Key Metadata</span>
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>

          {/* Rotation Modal */}
          {selectedSecret && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#03091D] border border-cyan-500/40 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                  <span className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                    <KeyRound className="size-4 text-cyan-400" />
                    <span>Key Rotation — {selectedSecret.name}</span>
                  </span>
                  <button onClick={() => setSelectedSecret(null)} className="text-slate-400 hover:text-white text-xs font-mono font-bold">Close</button>
                </div>

                <form onSubmit={handleRotateSubmit} className="space-y-4 font-mono">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-cyan-400">ENV VARIABLE NAME</label>
                    <input type="text" disabled value={selectedSecret.keyName} className="w-full bg-[#02050E] px-3.5 py-2.5 rounded-xl text-xs text-slate-400 border border-cyan-500/20" />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-cyan-400">NEW MASKED DISPLAY VALUE</label>
                    <input
                      type="text"
                      required
                      value={newMaskedValue}
                      onChange={(e) => setNewMaskedValue(e.target.value)}
                      placeholder="e.g. re_SAR55...9W"
                      className="w-full bg-[#02050E] px-3.5 py-2.5 rounded-xl text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-cyan-400">ROTATION REASON / AUDIT NOTE</label>
                    <input
                      type="text"
                      required
                      value={rotationReason}
                      onChange={(e) => setRotationReason(e.target.value)}
                      placeholder="e.g. Quarterly key rotation or compromise prevention"
                      className="w-full bg-[#02050E] px-3.5 py-2.5 rounded-xl text-xs text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSecret(null)}
                      className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/25 text-slate-300 text-xs font-bold font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={rotating}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs font-mono shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {rotating ? <RefreshCw className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
                      <span>Execute Rotation</span>
                    </button>
                  </div>
                </form>

                {selectedSecret.rotations && selectedSecret.rotations.length > 0 && (
                  <div className="pt-4 border-t border-cyan-500/20 space-y-2 font-mono">
                    <span className="text-[10px] font-bold uppercase text-cyan-400/80 flex items-center gap-1">
                      <History className="size-3 text-cyan-400" />
                      <span>Rotation Audit History</span>
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {selectedSecret.rotations.map((r) => (
                        <div key={r.id} className="text-[10px] bg-[#02050E] p-2.5 rounded-xl border border-cyan-500/20 flex items-center justify-between text-slate-300">
                          <span>{r.rotatedBy} — {r.reason || "Rotated"}</span>
                          <span className="text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
