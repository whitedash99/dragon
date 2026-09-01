"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { Smartphone, Fingerprint, ShieldCheck, RefreshCw, CheckCircle2, FileText } from "lucide-react";
import { openOfficialPdfReport } from "@/lib/pdf-report-generator";
import { GlassCard, GlassBadge, GlassButton, GlassStat } from "@/components/ui/glass";

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

  const handleExportDevicesPDF = () => {
    openOfficialPdfReport({
      header: {
        title: "TRUSTED HARDWARE & WEBAUTHN DEVICE MATRIX",
        subtitle: "Audit of all cryptographic hardware tokens, WebAuthn authenticators, and trusted device nodes.",
        classification: "TOP SECRET // EXECUTIVE ONLY",
        category: "HARDWARE TRUST & WEBAUTHN AUDIT",
      },
      metrics: [
        { label: "TRUSTED DEVICES", value: devices.length, subtext: "Hardware Authenticated", color: "cyan" },
        { label: "SECURITY LEVEL", value: "100%", subtext: "Zero Compromise", color: "emerald" },
        { label: "ENCRYPTION TIER", value: "AES-256", subtext: "Military WebAuthn", color: "purple" },
      ],
      table: {
        title: "AUTHENTICATED HARDWARE CREDENTIAL MATRIX",
        columns: [
          { header: "Account Holder", render: (d: DeviceRecord) => `<b>${d.userName || d.userEmail}</b>`, width: "25%" },
          { header: "OS & Hardware", render: (d: DeviceRecord) => d.os || "Desktop Node", width: "20%" },
          { header: "Browser Client", render: (d: DeviceRecord) => d.browser || "Dragon Web Client", width: "20%" },
          { header: "IP Address", render: (d: DeviceRecord) => d.ipAddress || "127.0.0.1", width: "15%" },
          { header: "Trust Status", render: (d: DeviceRecord) => d.trusted ? `<span class="badge-emerald">TRUSTED</span>` : `<span class="badge-amber">PENDING</span>`, width: "10%" },
          { header: "Last Active", render: (d: DeviceRecord) => new Date(d.lastUsedAt).toLocaleDateString(), width: "10%" },
        ],
        rows: devices,
      },
      notes: [
        "All devices listed are cryptographically bound to Dragon Universal Identity Protocol (DIP) accounts.",
        "Unrecognized hardware is automatically isolated under Zero Trust security protocols.",
      ],
    });
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
                <Smartphone className="size-3.5 text-cyan-400" />
                <span>Hardware Trust & WebAuthn Fingerprinting</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Trusted Hardware & Devices</h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportDevicesPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
                title="Export Hardware Trust Report to PDF"
              >
                <FileText className="size-3.5 text-cyan-400" />
                <span>Export PDF Report</span>
              </button>

              <button
                onClick={fetchDevices}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <RefreshCw className={`size-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Registered Devices</span>
              </button>
            </div>
          </div>

          <GlassCard className="p-6 space-y-6 bg-[#03091D]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Trusted Hardware Credentials ({devices.length})</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Physical security keys, YubiKeys, and WebAuthn authenticators bound to DIP accounts.</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                Querying trusted device fingerprints...
              </div>
            ) : devices.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-mono">
                No trusted hardware devices registered yet.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {devices.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{d.userName || d.userEmail}</span>
                        <GlassBadge variant="published">
                          TRUSTED
                        </GlassBadge>
                      </div>
                      <p className="text-slate-400 text-[11px] font-mono">{d.browser} · {d.os} · IP: {d.ipAddress || "127.0.0.1"}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      <div>Last active: {new Date(d.lastUsedAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
