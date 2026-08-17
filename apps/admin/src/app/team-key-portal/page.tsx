"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  UserPlus,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Ban,
  Clock,
  Send,
  Lock,
  Key,
  Users,
  Fingerprint,
  Trash2,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InvitationItem {
  id: string;
  email: string;
  name?: string;
  role: string;
  department?: string;
  permissions: string[];
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  createdBy: string;
  expiresAt: string;
  createdAt: string;
}

interface ApplicationItem {
  id: string;
  applicationNumber?: string;
  jobTitle: string;
  department: string;
  applicantName: string;
  applicantEmail: string;
  portfolioUrl: string;
  linkedinUrl?: string;
  primarySkill?: string;
  experience?: string;
  note?: string;
  status: "PENDING" | "UNDER_REVIEW" | "MORE_INFORMATION" | "APPROVED" | "REJECTED" | "WITHDRAWN";
  ownerNotes?: string;
  reviewedBy?: string;
  createdAt: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  userEmail?: string;
  details?: string;
  createdAt: string;
}

interface PasskeyItem {
  id: string;
  credentialId: string;
  deviceType: string;
  transports: string;
  createdAt: string;
}

const PERMISSION_OPTIONS = [
  "cms.read",
  "cms.write",
  "studio.read",
  "studio.write",
  "tickets.read",
  "tickets.write",
  "users.read",
  "users.manage",
  "games.read",
  "games.write",
  "analytics.read",
  "security.manage",
];

const ROLES_LIST = [
  "Owner",
  "Admin",
  "Developer",
  "Editor",
  "Support",
  "Moderator",
  "Marketing",
  "Viewer",
];

export default function DragonTeamKeyPortalPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "create" | "invitations" | "passkeys" | "audit">("overview");

  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({
    activeTeamCount: 0,
    pendingCount: 0,
    expiredCount: 0,
    revokedCount: 0,
    applicationsCount: 0,
    totalCount: 0,
  });

  const [invitationsList, setInvitationsList] = useState<InvitationItem[]>([]);
  const [applicationsList, setApplicationsList] = useState<ApplicationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);

  // Modal State
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");
  const [department, setDepartment] = useState("Engineering");
  const [expirationHours, setExpirationHours] = useState("24");
  const [notes, setNotes] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["cms.read", "games.read"]);

  const [creating, setCreating] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ inviteUrl: string; rawToken: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPortalData = useCallback(async () => {
    setLoading(true);
    try {
      const [portalRes, passkeyRes] = await Promise.all([
        fetch("/api/team-key-portal"),
        fetch("/api/auth/passkeys").catch(() => null),
      ]);

      const data = await portalRes.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setInvitationsList(data.invitations || []);
        setApplicationsList(data.applications || []);
        setAuditLogs(data.auditLogs || []);
      }

      if (passkeyRes?.ok) {
        const pkData = await passkeyRes.json();
        if (pkData.success && Array.isArray(pkData.passkeys)) {
          setPasskeys(pkData.passkeys);
        }
      }
    } catch (e) {
      console.error("Fetch portal error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortalData();
  }, [fetchPortalData]);

  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setCreating(true);
    setCreatedResult(null);

    try {
      const res = await fetch("/api/team-key-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_invitation",
          email: email.trim(),
          name: name.trim(),
          role: role.toUpperCase(),
          department: department.trim(),
          permissions: selectedPermissions,
          expirationHours,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedResult({
          inviteUrl: data.inviteUrl,
          rawToken: data.rawToken,
        });
        setNoticeMsg({ type: "success", text: `Single-use invitation generated & emailed to ${email.trim()}.` });
        setEmail("");
        setName("");
        setNotes("");
        fetchPortalData();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Failed to create invitation." });
      }
    } catch (err) {
      console.error("Create invitation error", err);
    } finally {
      setCreating(false);
    }
  };

  const handleAppAction = async (actionType: string, appId: string, extraNotes?: string) => {
    try {
      const res = await fetch("/api/team-key-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          id: appId,
          role: role.toUpperCase(),
          permissions: selectedPermissions,
          expirationHours,
          notes: extraNotes || notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (actionType === "approve_application" && data.rawToken) {
          setCreatedResult({ inviteUrl: data.inviteUrl, rawToken: data.rawToken });
          setNoticeMsg({ type: "success", text: "Application Approved! Single-use invitation URL generated & emailed to candidate." });
        } else {
          setNoticeMsg({ type: "success", text: `Application updated successfully: ${actionType}` });
        }
        setSelectedApp(null);
        fetchPortalData();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Action failed." });
      }
    } catch (e) {
      console.error("App action error", e);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this single-use invitation permanently?")) return;
    try {
      const res = await fetch("/api/team-key-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_invitation", id }),
      });
      const data = await res.json();
      if (data.success) fetchPortalData();
    } catch (e) {
      console.error("Revoke error", e);
    }
  };

  const handleRevokePasskey = async (id: string) => {
    if (!confirm("Revoke this WebAuthn Passkey credential?")) return;
    try {
      const res = await fetch("/api/auth/passkeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_passkey", id }),
      });
      const data = await res.json();
      if (data.success) fetchPortalData();
    } catch (e) {
      console.error("Revoke passkey error", e);
    }
  };

  const handleCopySecret = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-bold mb-1">
                <Lock className="size-3.5" />
                <span>RECRUITMENT & IDENTITY PLANE</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Recruitment & Invitation Portal
              </h1>
            </div>

            <button
              onClick={fetchPortalData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all self-start sm:self-auto shadow-xs"
            >
              <RefreshCw className={cn("size-3.5 text-slate-500 dark:text-slate-400", loading && "animate-spin")} />
              <span>Refresh Vault</span>
            </button>
          </div>

          {noticeMsg && (
            <div className={`p-4 rounded-xl border font-bold flex items-center justify-between text-xs font-mono ${noticeMsg.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {[
              { id: "overview" as const, label: "Overview" },
              { id: "applications" as const, label: `Candidate Applications (${applicationsList.length})` },
              { id: "create" as const, label: "Create Invitation" },
              { id: "invitations" as const, label: "Invitations" },
              { id: "passkeys" as const, label: "Passkeys" },
              { id: "audit" as const, label: "Audit Log" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Active Team Members", val: telemetry.activeTeamCount, icon: Users, desc: "Active in PostgreSQL" },
                  { label: "Candidate Applications", val: telemetry.applicationsCount, icon: FileText, desc: "Submitted from Website" },
                  { label: "Pending Invitations", val: telemetry.pendingCount, icon: Clock, desc: "Single-use active tokens" },
                  { label: "Revoked Invitations", val: telemetry.revokedCount, icon: ShieldCheck, desc: "Cancelled by Owners" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase">{item.label}</span>
                        <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <Icon className="size-4" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">{item.val}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-base font-bold text-slate-900">Review Candidate Applications or Issue Direct Invitation</h3>
                  <p className="text-xs text-slate-500">
                    Review public career applications or directly generate cryptographically random SHA-256 single-use tokens.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shrink-0 flex items-center gap-2 shadow-xs"
                >
                  <UserPlus className="size-4" />
                  <span>Issue New Invitation</span>
                </button>
              </div>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Ref</th>
                    <th className="px-6 py-3.5">Applicant</th>
                    <th className="px-6 py-3.5">Position</th>
                    <th className="px-6 py-3.5">Skill</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applicationsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No team applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    applicationsList.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{app.applicationNumber || "DRG-APP"}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{app.applicantName}</div>
                          <div className="text-[11px] text-slate-500">{app.applicantEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700">{app.jobTitle}</div>
                          <div className="text-[11px] text-slate-500">{app.department}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{app.primarySkill || "Engine Architecture"}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-bold border",
                            app.status === "PENDING" && "bg-amber-50 text-amber-800 border-amber-200",
                            app.status === "UNDER_REVIEW" && "bg-sky-50 text-sky-800 border-sky-200",
                            app.status === "MORE_INFORMATION" && "bg-purple-50 text-purple-800 border-purple-200",
                            app.status === "APPROVED" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                            app.status === "REJECTED" && "bg-rose-50 text-rose-800 border-rose-200"
                          )}>
                            {app.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <Eye className="size-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* CREATE INVITATION TAB */}
          {activeTab === "create" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Generate Cryptographic Team Invitation Token</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Invitation tokens are single-use, short-lived, hashed with SHA-256, and bound to the recipient email.
                </p>
              </div>

              {createdResult && (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Check className="size-4 text-emerald-600" />
                    <span>Invitation Token Generated & Dispatched via Resend</span>
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[11px] font-bold">SINGLE-USE INVITATION SECRET (SHOWN ONCE):</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={createdResult.rawToken}
                        className="w-full bg-white p-3 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs shadow-xs"
                      />
                      <button
                        onClick={() => handleCopySecret(createdResult.rawToken)}
                        className="p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                      >
                        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 block text-[11px] font-bold">INVITATION DIRECT URL:</label>
                    <input
                      type="text"
                      readOnly
                      value={createdResult.inviteUrl}
                      className="w-full bg-white p-3 rounded-xl border border-slate-200 text-slate-700 font-mono text-xs mt-1 shadow-xs"
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateInvitation} className="space-y-6 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl bg-slate-50 p-3 text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Recipient Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@dragonstudios.com"
                      className="w-full rounded-xl bg-slate-50 p-3 text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
                  >
                    {creating ? <RefreshCw className="size-4 animate-spin" /> : <Key className="size-4" />}
                    <span>Generate & Send Token</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* INVITATIONS LIST TAB */}
          {activeTab === "invitations" && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Recipient</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Expires</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invitationsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No invitation records found in PostgreSQL.
                      </td>
                    </tr>
                  ) : (
                    invitationsList.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{inv.name || inv.email}</div>
                          <div className="text-[11px] text-slate-500">{inv.email}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{inv.role}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-bold border",
                            inv.status === "PENDING" && "bg-amber-50 text-amber-800 border-amber-200",
                            inv.status === "ACCEPTED" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                            inv.status === "REVOKED" && "bg-rose-50 text-rose-800 border-rose-200",
                            inv.status === "EXPIRED" && "bg-slate-50 text-slate-600 border-slate-200"
                          )}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(inv.expiresAt).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          {inv.status === "PENDING" && (
                            <button
                              onClick={() => handleRevoke(inv.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                              title="Revoke Token"
                            >
                              <Ban className="size-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PASSKEYS TAB */}
          {activeTab === "passkeys" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Fingerprint className="size-4 text-emerald-600" /> Registered WebAuthn Passkeys
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                    Hardware Authenticators (Windows Hello, Touch ID, Face ID, Security Keys). Private keys remain on authenticator.
                  </p>
                </div>
              </div>

              {passkeys.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  No WebAuthn passkeys registered for active session user.
                </div>
              ) : (
                <div className="space-y-2">
                  {passkeys.map((pk) => (
                    <div key={pk.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Fingerprint className="size-4 text-emerald-600" />
                          <span>{pk.deviceType}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-1 font-mono">Credential ID: {pk.credentialId}</div>
                      </div>
                      <button
                        onClick={() => handleRevokePasskey(pk.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Trash2 className="size-3.5" /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === "audit" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Cryptographic Identity Audit Trail
              </h2>
              <div className="space-y-2 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{log.action}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{log.details || log.userEmail}</div>
                    </div>
                    <div className="text-slate-400 text-[11px]">{new Date(log.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-8 space-y-6 font-mono text-xs shadow-2xl">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] text-slate-500 font-bold uppercase">{selectedApp.applicationNumber || "DRG-APP"}</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedApp.applicantName}</h2>
              <p className="text-slate-500">{selectedApp.applicantEmail} • {selectedApp.jobTitle} ({selectedApp.department})</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><span className="text-slate-500 font-bold">Portfolio / GitHub:</span> <a href={selectedApp.portfolioUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">{selectedApp.portfolioUrl}</a></div>
              {selectedApp.linkedinUrl && <div><span className="text-slate-500 font-bold">LinkedIn:</span> <a href={selectedApp.linkedinUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">{selectedApp.linkedinUrl}</a></div>}
              <div><span className="text-slate-500 font-bold">Primary Skill:</span> <span className="text-slate-900">{selectedApp.primarySkill || "Engine Architecture"}</span></div>
              <div><span className="text-slate-500 font-bold">Experience:</span> <span className="text-slate-900">{selectedApp.experience || "Senior"}</span></div>
              {selectedApp.note && <div><span className="text-slate-500 font-bold">Candidate Note:</span> <p className="text-slate-700 font-sans mt-1 text-xs">{selectedApp.note}</p></div>}
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 font-bold block">Owner Evaluation Notes / Feedback</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal evaluation notes..."
                className="w-full rounded-xl bg-slate-50 p-3 text-slate-900 border border-slate-200 focus:outline-none font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleAppAction("review_application", selectedApp.id)}
                className="px-4 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="size-3.5" /> Mark Under Review
              </button>
              <button
                onClick={() => handleAppAction("request_info_application", selectedApp.id)}
                className="px-4 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <HelpCircle className="size-3.5" /> Request Info
              </button>
              <button
                onClick={() => handleAppAction("reject_application", selectedApp.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <XCircle className="size-3.5" /> Reject Candidate
              </button>
              <button
                onClick={() => handleAppAction("approve_application", selectedApp.id)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
              >
                <CheckCircle2 className="size-3.5" /> Approve & Issue Invitation Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
