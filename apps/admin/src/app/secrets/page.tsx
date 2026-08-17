"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  KeyRound,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  Lock,
  History,
  RotateCw,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecretItem {
  id: string;
  name: string;
  category: string;
  keyName: string;
  maskedValue: string;
  isConfigured: boolean;
  lastRotated: string;
  rotations?: Array<{
    id: string;
    rotatedBy: string;
    reason?: string;
    createdAt: string;
  }>;
}

export default function SecretsVaultPage() {
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rotation Modal
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null);
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
    } catch (e: unknown) {
      setError("Failed to communicate with Secrets Vault API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchSecrets();
    });
    return () => { isMounted = false; };
  }, [fetchSecrets]);

  const handleOpenRotate = (sec: SecretItem) => {
    setSelectedSecret(sec);
    setNewMaskedValue(sec.maskedValue);
    setRotationReason("Routine quarterly key rotation");
  };

  const handleRotateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSecret) return;

    setRotating(true);
    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretId: selectedSecret.id,
          maskedValue: newMaskedValue.trim(),
          reason: rotationReason.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNoticeMsg({ type: "success", text: `Secret ${selectedSecret.name} successfully rotated & audited.` });
        setSelectedSecret(null);
        fetchSecrets();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Failed to rotate secret." });
      }
    } catch (e: unknown) {
      setNoticeMsg({ type: "error", text: "Failed to rotate secret credential." });
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8 font-sans text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="size-3.5 text-slate-700" />
                <span>Executive Secrets Vault & Rotation Engine</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Secrets & API Keys Governance
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchSecrets} variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs">
                <RefreshCw className="size-3.5 text-slate-500" />
                <span>Refresh Vault</span>
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-2 text-xs font-mono">
              <ShieldAlert className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {noticeMsg && (
            <div className={`p-4 rounded-xl border font-bold flex items-center justify-between text-xs font-mono ${noticeMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
          )}

          {/* Secrets Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs font-mono">
                <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-slate-500" />
                Decrypting Secrets Vault metadata from PostgreSQL...
              </div>
            ) : (
              secrets.map((sec) => (
                <div key={sec.id} className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4 relative flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
                        {sec.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-bold">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        <span>CONFIGURED</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{sec.name}</h3>
                    <code className="text-slate-900 font-mono text-[11px] block bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 truncate font-semibold">
                      {sec.keyName}
                    </code>

                    {/* Masked Value Display */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700">
                      <span className="truncate">{sec.maskedValue}</span>
                      <EyeOff className="size-3.5 text-slate-400 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Last Rotated:</span>
                      <span className="text-slate-900 font-bold">{new Date(sec.lastRotated).toLocaleDateString()}</span>
                    </div>

                    <Button onClick={() => handleOpenRotate(sec)} variant="outline" size="sm" className="w-full rounded-xl gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold shadow-xs">
                      <RotateCw className="size-3.5 text-slate-600" />
                      <span>Rotate Key Metadata</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rotation Modal */}
          {selectedSecret && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2 font-mono">
                    <KeyRound className="size-4 text-slate-700" />
                    <span>Key Rotation — {selectedSecret.name}</span>
                  </span>
                  <button onClick={() => setSelectedSecret(null)} className="text-slate-400 hover:text-slate-700 text-xs font-mono font-bold">Close</button>
                </div>

                <form onSubmit={handleRotateSubmit} className="space-y-4 font-mono">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">ENV VARIABLE NAME</label>
                    <input type="text" disabled value={selectedSecret.keyName} className="w-full bg-slate-100 px-3.5 py-2 rounded-xl text-xs text-slate-700 border border-slate-200" />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">NEW MASKED DISPLAY VALUE</label>
                    <input
                      type="text"
                      required
                      value={newMaskedValue}
                      onChange={(e) => setNewMaskedValue(e.target.value)}
                      placeholder="e.g. re_SAR55...9W"
                      className="w-full bg-slate-50 px-3.5 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">ROTATION REASON / AUDIT NOTE</label>
                    <input
                      type="text"
                      required
                      value={rotationReason}
                      onChange={(e) => setRotationReason(e.target.value)}
                      placeholder="e.g. Quarterly key rotation or compromise prevention"
                      className="w-full bg-slate-50 px-3.5 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" onClick={() => setSelectedSecret(null)} variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={rotating} variant="outline" size="sm" className="rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs">
                      {rotating ? <RefreshCw className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
                      <span>Execute Rotation</span>
                    </Button>
                  </div>
                </form>

                {selectedSecret.rotations && selectedSecret.rotations.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2 font-mono">
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <History className="size-3" />
                      <span>Rotation Audit History</span>
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedSecret.rotations.map((r) => (
                        <div key={r.id} className="text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-slate-700">
                          <span>{r.rotatedBy} — {r.reason || "Rotated"}</span>
                          <span className="text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
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
