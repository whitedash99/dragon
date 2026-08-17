"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Smartphone, Fingerprint, ShieldCheck, RefreshCw, CheckCircle2, Trash2 } from "lucide-react";

interface DeviceRecord {
  id: string;
  userName?: string;
  userEmail?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  fingerprint?: string;
  trusted: boolean;
  lastUsedAt: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      if (data.success && Array.isArray(data.trustedDevices)) {
        setDevices(data.trustedDevices);
      }
    } catch (e) {
      console.error("Fetch devices error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-slate-700" />
                <span>Hardware Trust & WebAuthn Fingerprinting</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trusted Hardware & Devices</h1>
            </div>

            <button
              onClick={fetchDevices}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              <RefreshCw className={`size-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Registered Devices</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Trusted Hardware Credentials ({devices.length})</h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Physical security keys, YubiKeys, and WebAuthn authenticators bound to DIP accounts.</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                Querying trusted device fingerprints...
              </div>
            ) : devices.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                No trusted hardware devices registered yet.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {devices.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{d.userName || d.userEmail}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          TRUSTED
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-sans">{d.browser} · {d.os} · IP: {d.ipAddress || "127.0.0.1"}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <div>Last active: {new Date(d.lastUsedAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
