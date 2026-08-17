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
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

interface UserItem {
  id: string;
  name?: string;
  email: string;
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
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inspectUser, setInspectUser] = useState<UserItem | null>(null);
  const [inspectTab, setInspectTab] = useState<"overview" | "permissions" | "passkeys" | "sessions" | "audit">("overview");

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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Dragon Identity Platform (DIP) IAM
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Team Directory & Access Roles</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
              >
                <RefreshCw className={cn("size-3.5 text-slate-500 dark:text-slate-400", loading && "animate-spin")} />
                <span>Refresh Directory</span>
              </button>

              <button
                onClick={() => {
                  setInviteSuccessMsg(null);
                  setInviteModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white border border-slate-900 dark:border-slate-100 text-xs font-semibold text-white dark:text-slate-900 transition-all shadow-xs"
              >
                <UserPlus className="size-4" />
                <span>Invite Team Member</span>
              </button>
            </div>
          </div>

          {noticeMsg && (
            <div className={`p-4 rounded-xl border font-bold flex items-center justify-between text-xs font-mono ${noticeMsg.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...ROLES_LIST].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    roleFilter === r
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, email, role, or IP..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                Loading Neon PostgreSQL user records...
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                No team accounts found.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Team Member</th>
                    <th className="px-6 py-3.5">Role Tier</th>
                    <th className="px-6 py-3.5">Department</th>
                    <th className="px-6 py-3.5">Authenticators</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-900 text-xs">
                            {(usr.name || usr.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{usr.name || "Staff Member"}</span>
                              {usr.isProtected && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold">
                                  PROTECTED OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{usr.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <span className={cn(
                          "px-2 py-0.5 rounded border text-[11px] font-semibold",
                          usr.role === "OWNER" || usr.role === "FOUNDER" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"
                        )}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {usr.department || "Engineering"}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-sky-700 text-[11px]" title="Hardware Passkeys">
                            <Fingerprint className="size-3.5" />
                            <span>{usr.passkeysCount || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 text-purple-700 text-[11px]" title="Active HTTP-Only Sessions">
                            <Smartphone className="size-3.5" />
                            <span>{usr.activeSessionsCount || 0}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-emerald-700 font-medium">
                        {usr.status}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setInspectUser(usr);
                              setInspectTab("overview");
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sky-700 transition-colors"
                            title="Inspect Member Profile"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(usr)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Role"
                          >
                            <ShieldCheck className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDisableUser(usr)}
                            disabled={usr.isProtected || usr.role === "OWNER"}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              usr.isProtected || usr.role === "OWNER" ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-100" : "bg-slate-100 hover:bg-slate-200 text-amber-700"
                            )}
                            title={usr.isProtected ? "Protected Owner account cannot be disabled" : "Disable Account"}
                          >
                            <Ban className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usr)}
                            disabled={usr.isProtected || usr.role === "OWNER"}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              usr.isProtected || usr.role === "OWNER" ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-100" : "bg-slate-100 hover:bg-slate-200 text-rose-700"
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
            )}
          </div>
        </main>
      </div>

      {/* Spacious Member Inspection Workspace Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            {/* Header section matching Requirement 12 */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-900 text-lg">
                  {(inspectUser.name || inspectUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{inspectUser.name || "Staff Member"}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono">
                      {inspectUser.status}
                    </span>
                    {inspectUser.isProtected && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                        PROTECTED OWNER
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{inspectUser.email}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{inspectUser.role} · {inspectUser.department || "Engineering"}</div>
                </div>
              </div>
              <button onClick={() => setInspectUser(null)} className="text-slate-400 hover:text-slate-700 text-xs font-mono">
                Close
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              {[
                { id: "overview" as const, label: "Overview", icon: Eye },
                { id: "permissions" as const, label: "Permissions", icon: Shield },
                { id: "passkeys" as const, label: `Passkeys (${inspectUser.passkeysCount || 0})`, icon: Fingerprint },
                { id: "sessions" as const, label: `Sessions (${inspectUser.activeSessionsCount || 0})`, icon: Smartphone },
                { id: "audit" as const, label: "Audit", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = inspectTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInspectTab(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all font-mono",
                      isSelected ? "bg-slate-900 text-white font-semibold shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {inspectTab === "overview" && (
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Staff ID</span>
                  <span className="font-bold text-slate-900">{inspectUser.employeeId || inspectUser.id}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Identity Provider</span>
                  <span className="font-bold text-sky-700">{inspectUser.provider || "credentials"}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Created</span>
                  <span className="font-bold text-slate-700">{new Date(inspectUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Activity</span>
                  <span className="font-bold text-emerald-700">{inspectUser.lastLogin ? new Date(inspectUser.lastLogin).toLocaleString() : "Never"}</span>
                </div>
              </div>
            )}

            {inspectTab === "permissions" && (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-slate-900 font-bold block">Assigned Role Tier: {inspectUser.role}</span>
                  <p className="text-slate-500 text-sans">Fine-grained permissions granted for this account tier:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["users.read", "applications.read", "cms.read", ...(inspectUser.role === "OWNER" || inspectUser.role === "ADMIN" ? ["users.manage", "applications.review", "invitations.create", "cms.edit", "security.view"] : [])].map((perm) => (
                      <span key={perm} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold shadow-xs">
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
                    <div key={pk.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-sky-700 font-bold">{pk.deviceType || "Hardware Security Key"}</div>
                        <div className="text-[10px] text-slate-500">ID: {pk.id}</div>
                      </div>
                      <span className="text-[10px] text-slate-500">Registered: {new Date(pk.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-xl border border-slate-200">
                    No hardware WebAuthn passkeys registered for this account.
                  </div>
                )}
              </div>
            )}

            {inspectTab === "sessions" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-bold">Active Sessions ({inspectUser.activeSessionsCount || 0})</span>
                  <button
                    onClick={() => handleRevokeSessions(inspectUser)}
                    disabled={revokingSessions || (inspectUser.activeSessionsCount || 0) === 0}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all",
                      (inspectUser.activeSessionsCount || 0) > 0
                        ? "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
                        : "opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                    )}
                  >
                    {revokingSessions ? <RefreshCw className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
                    <span>Revoke All Sessions</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {inspectUser.sessions && inspectUser.sessions.length > 0 ? (
                    inspectUser.sessions.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-slate-900 font-semibold">{s.ipAddress || "127.0.0.1"}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-sm">{s.userAgent || "Browser Client"}</div>
                        </div>
                        <span className="text-[10px] text-emerald-700 shrink-0 font-medium">Expires: {new Date(s.expiresAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-xl border border-slate-200">
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
                    <div key={a.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{a.action}</span>
                        <div className="text-[11px] text-zinc-400">{a.details}</div>
                      </div>
                      <span className="text-[10px] text-zinc-500">{new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs bg-white/[0.01] rounded-xl border border-white/5">
                    No individual audit records for this account.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Team Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="surface-card rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-semibold text-white text-sm flex items-center gap-2">
                <Mail className="size-4 text-white" />
                <span>Invite Dragon Team Member</span>
              </span>
              <button onClick={() => setInviteModalOpen(false)} className="text-zinc-500 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            {inviteSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <Check className="size-4 shrink-0" />
                <span>{inviteSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleInviteUser} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl bg-white/[0.03] p-3 text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jane@dragonstudios.com"
                  className="w-full rounded-xl bg-white/[0.03] p-3 text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Access Role Tier</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl bg-[#09090b] p-3 text-white border border-white/10 focus:outline-none"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  placeholder="Engineering / Executive / Marketing"
                  className="w-full rounded-xl bg-white/[0.03] p-3 text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  {inviting && <RefreshCw className="size-3.5 animate-spin" />}
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
          <div className="surface-card rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-semibold text-white text-sm">
                Edit Staff Role
              </span>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.03] p-3 text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.03] p-3 text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Role Tier</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full rounded-xl bg-[#09090b] p-3 text-white border border-white/10 focus:outline-none"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all"
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
