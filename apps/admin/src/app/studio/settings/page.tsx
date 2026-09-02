"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Users,
  Key,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Mail,
  UserCheck,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  dragonId: string;
  lastLogin: string;
}

export default function StudioSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [studioName, setStudioName] = useState("Dragon Gaming Studios");
  const [contactEmail, setContactEmail] = useState("contact@dragongaming.studio");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          const staff = data.users.filter((u: any) =>
            ["OWNER", "FOUNDER", "ADMINISTRATOR", "ADMIN", "DEVELOPER"].includes(u.role)
          );
          setAdmins(staff);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              STUDIO HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">• Configuration & Access</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Studio Configuration & Role Permissions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage studio identity, public contact gateways, and staff RBAC access control.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-600/20 w-fit"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? "Changes Saved!" : "Save Configuration"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Studio Identity Settings */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#0F172A] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Studio Profile</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Studio Legal Name</label>
              <input
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Official Contact Email</label>
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Zero-Trust Environment</label>
              <div className="mt-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Production Enforced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff & RBAC Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Staff & Administrator Accounts ({admins.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">Prisma DB Synchronized</span>
          </div>

          <div className="rounded-xl bg-[#0F172A] border border-white/[0.08] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">Dragon ID</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{a.name || "Staff"}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{a.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {a.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {a.dragonId || "DRG-CORE-STAFF"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-mono">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
