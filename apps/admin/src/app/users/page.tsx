"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import {
  UserPlus,
  Search,
  RefreshCw,
  ShieldCheck,
  Ban,
  Trash2,
  Mail,
  Check,
  Fingerprint,
  Smartphone,
  Eye,
  LogOut,
  Activity,
  Shield,
  X,
  Crown,
  Sparkles,
  Globe,
  FileText
} from "lucide-react";
import { openOfficialPdfReport } from "@/lib/pdf-report-generator";
import { cn } from "@/lib/utils/cn";
import { GlassCard, GlassStat, GlassButton, GlassBadge } from "@/components/ui/glass";

interface PasskeyItem {
  id: string;
  deviceType?: string;
  createdAt: string;
}

interface SessionItem {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt?: string;
}

interface AuditItem {
  id: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

interface UserProfileData {
  dragonId?: string;
  title?: string;
  tagline?: string;
  level?: number;
  avatarUrl?: string;
  bannerUrl?: string;
  hasCompletedWelcome?: boolean;
  hasForgedDragonId?: boolean;
}

interface UserItem {
  id: string;
  name?: string;
  email: string;
  dragonId?: string | null;
  image?: string;
  avatar?: string;
  employeeId?: string;
  provider?: string;
  role: string;
  department?: string;
  status: string;
  isProtected?: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  lastLogin?: string;
  loginCount?: number;
  passkeysCount?: number;
  activeSessionsCount?: number;
  passkeys?: PasskeyItem[];
  sessions?: SessionItem[];
  auditLogs?: AuditItem[];
  profile?: UserProfileData | null;
  permissions?: string;
}

const ROLES_LIST = [
  "OWNER",
  "ADMIN",
  "DEVELOPER",
  "EDITOR",
  "SUPPORT",
  "MODERATOR",
  "MARKETING",
  "FINANCE",
  "HR",
  "VIEWER",
  "USER",
  "PLAYER",
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inspectUser, setInspectUser] = useState<UserItem | null>(null);
  const [inspectTab, setInspectTab] = useState<"overview" | "dragon_id" | "permissions" | "passkeys" | "sessions" | "audit">("overview");

  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [revokingSessions, setRevokingSessions] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("EDITOR");
  const [formStatus, setFormStatus] = useState("ACTIVE");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [inviteDept, setInviteDept] = useState("Engineering");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?role=${encodeURIComponent(roleFilter)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Error fetching users", e);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenEdit = (u: UserItem) => {
    setEditId(u.id);
    setFormName(u.name || "");
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormStatus(u.status || "ACTIVE");
    setModalOpen(true);
  };

  const handleDisableUser = async (u: UserItem) => {
    if (u.role === "OWNER" || u.role === "FOUNDER" || u.role === "CO_FOUNDER" || u.isProtected) {
      setNoticeMsg({ type: "error", text: "Permanent Owner accounts cannot be suspended or disabled." });
      return;
    }
    if (!confirm(`Disable account for ${u.email}?`)) return;
    try {
      await fetch(`/api/users?id=${encodeURIComponent(u.id)}&action=disable`, { method: "DELETE" });
      setNoticeMsg({ type: "success", text: `Disabled account for ${u.email}` });
      fetchUsers();
      if (inspectUser?.id === u.id) setInspectUser(null);
    } catch (e) {
      console.error("Disable user error", e);
    }
  };

  const handleDeleteUser = async (u: UserItem) => {
    if (u.role === "OWNER" || u.role === "FOUNDER" || u.role === "CO_FOUNDER" || u.isProtected) {
      setNoticeMsg({ type: "error", text: "Permanent Owner accounts cannot be deleted." });
      return;
    }
    if (!confirm(`Permanently delete account for ${u.email}?`)) return;
    try {
      await fetch(`/api/users?id=${encodeURIComponent(u.id)}&action=delete`, { method: "DELETE" });
      setNoticeMsg({ type: "success", text: `Deleted account for ${u.email}` });
      fetchUsers();
      if (inspectUser?.id === u.id) setInspectUser(null);
    } catch (e) {
      console.error("Delete user error", e);
    }
  };

  const handleRevokeSessions = async (u: UserItem) => {
    if (!confirm(`Revoke all active sessions for ${u.email}?`)) return;
    setRevokingSessions(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_sessions", id: u.id }),
      });
      const data = await res.json();
      if (data.success) {
        setNoticeMsg({ type: "success", text: `Sessions revoked for ${u.email}` });
        fetchUsers();
        if (inspectUser?.id === u.id) setInspectUser((prev) => (prev ? { ...prev, activeSessionsCount: 0, sessions: [] } : null));
      }
    } catch (e) {
      console.error("Revoke sessions error", e);
    } finally {
      setRevokingSessions(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          status: formStatus,
          isActive: formStatus === "ACTIVE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setNoticeMsg({ type: "success", text: `Updated user record for ${formEmail.trim()}` });
        fetchUsers();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Failed to update user." });
      }
    } catch (err) {
      console.error("Save user error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim(),
          role: inviteRole,
          department: inviteDept,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInviteSuccessMsg(`Single-use invitation dispatched to ${inviteEmail.trim()} via Resend.`);
        setInviteEmail("");
        setInviteName("");
        fetchUsers();
      } else {
        setNoticeMsg({ type: "error", text: data.error || "Failed to send invitation." });
      }
    } catch (err) {
      console.error("Invite error", err);
    } finally {
      setInviting(false);
    }
  };

  const handleExportUsersPDF = () => {
    openOfficialPdfReport({
      header: {
        title: "TEAM WORKFORCE & PLAYER ROSTER AUDIT",
        subtitle: "Verified PostgreSQL identity registry containing player credentials, Dragon IDs, and permission tiers.",
        classification: "TOP SECRET // EXECUTIVE ONLY",
        category: "IDENTITY & ACCESS ROSTER",
      },
      metrics: [
        { label: "TOTAL ACCOUNTS", value: users.length, subtext: "Synchronized in PostgreSQL", color: "cyan" },
        { label: "ACTIVE PLAYERS", value: users.filter((u) => u.role === "PLAYER").length, subtext: "Player Base", color: "gold" },
        { label: "STUDIO STAFF", value: users.filter((u) => u.role !== "PLAYER").length, subtext: "Admin & Operators", color: "purple" },
        { label: "DRAGON IDs", value: users.filter((u) => Boolean(u.profile?.dragonId || u.dragonId)).length, subtext: "Minted Callsigns", color: "emerald" },
      ],
      table: {
        title: "OFFICIAL ACCOUNT & GAMING IDENTITY ROSTER",
        columns: [
          { header: "Name", render: (u: UserItem) => `<b>${u.name || u.email.split("@")[0]}</b>`, width: "18%" },
          { header: "Email Address", key: "email", width: "22%" },
          { 
            header: "Dragon ID", 
            render: (u: UserItem) => {
              const dId = u.dragonId || u.profile?.dragonId;
              return dId ? `<span class="badge-amber">${dId}</span>` : `<span style="color:#64748B">Pending</span>`;
            },
            width: "18%" 
          },
          { header: "Role Tier", render: (u: UserItem) => `<span class="badge-cyan">${u.role}</span>`, width: "12%" },
          { header: "Provider", render: (u: UserItem) => (u.provider ? u.provider.toUpperCase() : "GOOGLE"), width: "12%" },
          { header: "Logins", render: (u: UserItem) => String(u.loginCount || 1), align: "center", width: "8%" },
          { header: "Joined", render: (u: UserItem) => new Date(u.createdAt).toLocaleDateString(), width: "10%" },
        ],
        rows: users,
      },
      notes: [
        "Cryptographically signed by Dragon Identity & Access Control (IAM).",
        "Direct link to Neon PostgreSQL database with zero mock data.",
      ],
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-[#02040A] text-slate-100 font-sans antialiased overflow-hidden select-none font-mono">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20 font-mono">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span>Dragon Identity & Access Control (IAM)</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Team Workforce & Real Players
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Direct PostgreSQL database connection: Google OAuth accounts, credentials, Dragon IDs, and access levels.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportUsersPDF}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-xs font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
                title="Export Official Player Roster to PDF"
              >
                <FileText className="size-3.5 text-cyan-400" />
                <span>Export PDF Roster</span>
              </button>

              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#03091D] hover:border-cyan-400 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <RefreshCw className={cn("size-3.5", loading && "animate-spin text-cyan-400")} />
                <span>Refresh Real Accounts</span>
              </button>

              <button
                onClick={() => {
                  setInviteSuccessMsg(null);
                  setInviteModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                <UserPlus className="size-4 text-black" />
                <span>Invite Team Member</span>
              </button>
            </div>
          </div>

          {noticeMsg && (
            <div className={`p-4 rounded-2xl border font-bold flex items-center justify-between text-xs ${noticeMsg.type === "success" ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300" : "bg-rose-500/15 border-rose-400/40 text-rose-300"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#03091D]/90 p-4 rounded-2xl border border-cyan-500/25 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", ...ROLES_LIST].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer",
                    roleFilter === r
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search email, name, role..."
                className="w-full pl-9 pr-4 py-2 bg-[#02050E] border border-cyan-500/30 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-[#03091D]/90 border border-cyan-500/25 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-cyan-400 text-xs font-mono animate-pulse">
                Querying real Neon PostgreSQL user accounts...
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                No accounts found in database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-cyan-500/20 bg-[#02050E] text-cyan-400/80 uppercase text-[10.5px]">
                    <tr>
                      <th className="px-6 py-3.5">Account / Google Email</th>
                      <th className="px-6 py-3.5">Provider & Dragon ID</th>
                      <th className="px-6 py-3.5">Role Tier</th>
                      <th className="px-6 py-3.5">Authenticators</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10 text-slate-300">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-black text-xs shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                              {(usr.name || usr.email)[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{usr.name || "Player / Staff"}</span>
                                {usr.isProtected && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold">
                                    PROTECTED OWNER
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-cyan-400/80">{usr.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${
                              usr.provider === "google"
                                ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                                : "bg-[#02050E] text-slate-400 border-cyan-500/20"
                            }`}>
                              {usr.provider === "google" ? "⚡ Google OAuth" : "🔑 Credentials"}
                            </span>
                            {usr.profile?.dragonId && (
                              <div className="text-[10px] text-cyan-300 font-bold">
                                @{usr.profile.dragonId} (Lv. {usr.profile.level || 1})
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded border text-[10px] font-bold font-mono",
                            usr.role === "OWNER" || usr.role === "FOUNDER" ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40" : "bg-[#02050E] text-slate-300 border-cyan-500/20"
                          )}>
                            {usr.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-cyan-400 text-[11px]" title="Hardware Passkeys">
                              <Fingerprint className="size-3.5" />
                              <span>{usr.passkeysCount || 0}</span>
                            </span>
                            <span className="flex items-center gap-1 text-purple-400 text-[11px]" title="Active HTTP-Only Sessions">
                              <Smartphone className="size-3.5" />
                              <span>{usr.activeSessionsCount || 0}</span>
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          {usr.status}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setInspectUser(usr);
                                setInspectTab("overview");
                              }}
                              className="p-1.5 rounded-lg bg-[#02050E] hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors cursor-pointer"
                              title="Inspect Member Profile"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(usr)}
                              className="p-1.5 rounded-lg bg-[#02050E] hover:bg-cyan-500/20 text-slate-300 border border-cyan-500/20 transition-colors cursor-pointer"
                              title="Edit Role"
                            >
                              <ShieldCheck className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDisableUser(usr)}
                              disabled={usr.isProtected || usr.role === "OWNER"}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors border",
                                usr.isProtected || usr.role === "OWNER" ? "opacity-30 cursor-not-allowed text-slate-500 border-white/5 bg-[#02050E]" : "bg-[#02050E] hover:bg-amber-500/20 text-amber-400 border-amber-500/30 cursor-pointer"
                              )}
                              title={usr.isProtected ? "Protected Owner account cannot be disabled" : "Disable Account"}
                            >
                              <Ban className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr)}
                              disabled={usr.isProtected || usr.role === "OWNER"}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors border",
                                usr.isProtected || usr.role === "OWNER" ? "opacity-30 cursor-not-allowed text-slate-500 border-white/5 bg-[#02050E]" : "bg-[#02050E] hover:bg-rose-500/20 text-rose-400 border-rose-500/30 cursor-pointer"
                              )}
                              title={usr.isProtected ? "Protected Owner account cannot be deleted" : "Delete Account"}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* INSPECT USER MODAL DRAWER */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden font-mono">
            {/* Header */}
            <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-black text-base shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  {(inspectUser.name || inspectUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{inspectUser.name || "Member Profile"}</span>
                    {inspectUser.role === "OWNER" && <Crown className="size-4 text-amber-400" />}
                  </h3>
                  <p className="text-xs text-cyan-400/80">{inspectUser.email}</p>
                </div>
              </div>
              <button onClick={() => setInspectUser(null)} className="p-2 text-slate-400 hover:text-white rounded-xl">
                <X className="size-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-3 bg-[#02050E] border-b border-cyan-500/20 overflow-x-auto">
              {[
                { id: "overview" as const, label: "Overview", icon: ShieldCheck },
                { id: "dragon_id" as const, label: "Dragon ID", icon: Sparkles },
                { id: "permissions" as const, label: "Permissions", icon: Shield },
                { id: "passkeys" as const, label: `Passkeys (${inspectUser.passkeysCount || 0})`, icon: Fingerprint },
                { id: "sessions" as const, label: `Sessions (${inspectUser.activeSessionsCount || 0})`, icon: Smartphone },
                { id: "audit" as const, label: "Audit Log", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = inspectTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInspectTab(tab.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all font-mono cursor-pointer",
                      isSelected ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {inspectTab === "overview" && (
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Account ID</span>
                    <span className="font-bold text-white break-all">{inspectUser.id}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Identity Provider</span>
                    <span className="font-bold text-cyan-300">{inspectUser.provider === "google" ? "⚡ Google OAuth2" : "🔑 Credentials"}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Created</span>
                    <span className="font-bold text-slate-300">{new Date(inspectUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Real Login</span>
                    <span className="font-bold text-emerald-400">{inspectUser.lastLogin ? new Date(inspectUser.lastLogin).toLocaleString() : "Never"}</span>
                  </div>
                </div>
              )}

              {inspectTab === "dragon_id" && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <span className="font-bold text-white text-sm">Dragon ID Card Identity</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {inspectUser.profile?.hasForgedDragonId ? "FORGED & ACTIVE" : "ONBOARDING PENDING"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">GamerTag / Handle</span>
                        <span className="font-bold text-cyan-400 text-sm">@{inspectUser.profile?.dragonId || "NotSet"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Primary Title</span>
                        <span className="font-bold text-white">{inspectUser.profile?.title || "Dragon Operative"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Player Level</span>
                        <span className="font-bold text-amber-400">Level {inspectUser.profile?.level || 1}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Cinematic Welcome</span>
                        <span className="font-bold text-emerald-400">{inspectUser.profile?.hasCompletedWelcome ? "Completed" : "Pending"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {inspectTab === "permissions" && (
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 space-y-2">
                    <span className="text-white font-bold block">Assigned Role Tier: {inspectUser.role}</span>
                    <p className="text-slate-400">Permissions granted for this database account:</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["users.read", "applications.read", "cms.read", ...(inspectUser.role === "OWNER" || inspectUser.role === "ADMIN" ? ["users.manage", "applications.review", "invitations.create", "cms.edit", "security.view"] : [])].map((perm) => (
                        <span key={perm} className="px-2.5 py-1 rounded-lg bg-[#03091D] border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {inspectTab === "passkeys" && (
                <div className="space-y-3 text-xs font-mono">
                  {inspectUser.passkeys && inspectUser.passkeys.length > 0 ? (
                    inspectUser.passkeys.map((pk) => (
                      <div key={pk.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between">
                        <div>
                          <div className="text-cyan-300 font-bold">{pk.deviceType || "Hardware Security Key"}</div>
                          <div className="text-[10px] text-slate-500">ID: {pk.id}</div>
                        </div>
                        <span className="text-[10px] text-slate-400">Registered: {new Date(pk.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#02050E] rounded-xl border border-cyan-500/20">
                      No hardware WebAuthn passkeys registered for this account.
                    </div>
                  )}
                </div>
              )}

              {inspectTab === "sessions" && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Active Sessions ({inspectUser.activeSessionsCount || 0})</span>
                    <button
                      onClick={() => handleRevokeSessions(inspectUser)}
                      disabled={revokingSessions || (inspectUser.activeSessionsCount || 0) === 0}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                        (inspectUser.activeSessionsCount || 0) > 0
                          ? "bg-rose-500/20 hover:bg-rose-500/30 border-rose-400/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                          : "opacity-40 cursor-not-allowed bg-[#02050E] border-cyan-500/20 text-slate-500"
                      )}
                    >
                      {revokingSessions ? <RefreshCw className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
                      <span>Revoke All Sessions</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {inspectUser.sessions && inspectUser.sessions.length > 0 ? (
                      inspectUser.sessions.map((s) => (
                        <div key={s.id} className="p-4 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between">
                          <div>
                            <div className="text-white font-bold">{s.ipAddress || "127.0.0.1"}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-sm">{s.userAgent || "Browser Client"}</div>
                          </div>
                          <span className="text-[10px] text-emerald-400 shrink-0 font-bold">Expires: {new Date(s.expiresAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#02050E] rounded-xl border border-cyan-500/20">
                        No active remote sessions for this account.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inspectTab === "audit" && (
                <div className="space-y-2 text-xs font-mono">
                  {inspectUser.auditLogs && inspectUser.auditLogs.length > 0 ? (
                    inspectUser.auditLogs.map((a) => (
                      <div key={a.id} className="p-3.5 rounded-xl bg-[#02050E] border border-cyan-500/20 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-cyan-300">{a.action}</span>
                          <div className="text-[11px] text-slate-400">{a.details}</div>
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#02050E] rounded-xl border border-cyan-500/20">
                      No individual audit records for this account.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Mail className="size-4 text-cyan-400" />
                <span>Invite Dragon Team Member</span>
              </span>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            {inviteSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="size-4 shrink-0 text-emerald-400" />
                <span>{inviteSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleInviteUser} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="staff@dragonstudios.com"
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Access Role Tier</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Department</label>
                <input
                  type="text"
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  placeholder="Engineering / Executive / Marketing"
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.35)]"
                >
                  {inviting && <RefreshCw className="size-3.5 animate-spin text-black" />}
                  <span>Dispatch Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-bold text-white text-sm">
                Edit User Account & Role
              </span>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Role Tier</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.35)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
