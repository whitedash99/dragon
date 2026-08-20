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
  X,
  ExternalLink,
  Briefcase,
  Sparkles,
  Building,
  Mail,
  Phone,
  Globe,
  Award,
  Layers,
  ArrowUpRight,
  Filter,
  Search,
  ChevronRight
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
  phone?: string;
  country?: string;
  portfolioUrl: string;
  linkedinUrl?: string;
  primarySkill?: string;
  experience?: string;
  whyJoin?: string;
  relevantProjects?: string;
  resumeUrl?: string;
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
  "DEVELOPER",
  "EDITOR",
  "SUPPORT",
  "MODERATOR",
  "MARKETING",
  "QA",
  "ADMIN",
  "VIEWER",
];

const DEPARTMENTS_LIST = [
  "Engineering",
  "Game Design",
  "Creative & Concept Art",
  "Audio & Music",
  "Quality Assurance",
  "Operations & Support",
  "Executive Leadership",
];

export default function DragonTeamKeyPortalPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "create" | "invitations" | "audit">("applications");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Modal State for Candidate Review
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [evalRole, setEvalRole] = useState("DEVELOPER");
  const [evalDepartment, setEvalDepartment] = useState("Engineering");
  const [evalExpiry, setEvalExpiry] = useState("48");
  const [evalNotes, setEvalNotes] = useState("");
  const [evalPermissions, setEvalPermissions] = useState<string[]>(["cms.read", "games.read"]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Direct Invitation Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("DEVELOPER");
  const [department, setDepartment] = useState("Engineering");
  const [expirationHours, setExpirationHours] = useState("48");
  const [notes, setNotes] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["cms.read", "games.read"]);

  const [creating, setCreating] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ inviteUrl: string; rawToken: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPortalData = useCallback(async () => {
    setLoading(true);
    try {
      const portalRes = await fetch("/api/team-key-portal");
      const data = await portalRes.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setInvitationsList(data.invitations || []);
        setApplicationsList(data.applications || []);
        setAuditLogs(data.auditLogs || []);
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

  const handleToggleEvalPermission = (perm: string) => {
    setEvalPermissions((prev) =>
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
    setIsProcessing(true);
    try {
      const res = await fetch("/api/team-key-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          id: appId,
          role: evalRole.toUpperCase(),
          department: evalDepartment,
          permissions: evalPermissions,
          expirationHours: evalExpiry,
          notes: extraNotes || evalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (actionType === "approve_application" && data.rawToken) {
          setCreatedResult({ inviteUrl: data.inviteUrl, rawToken: data.rawToken });
          setNoticeMsg({ type: "success", text: `Candidate Approved! Single-use invitation emailed to candidate.` });
        } else if (actionType === "reject_application") {
          setNoticeMsg({ type: "success", text: "Candidate application marked as Rejected." });
        } else if (actionType === "request_info_application") {
          setNoticeMsg({ type: "success", text: "Information request email dispatched to candidate." });
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
    } finally {
      setIsProcessing(false);
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

  const handleCopySecret = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered applications list
  const filteredApplications = applicationsList.filter((app) => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesQuery =
      !searchQuery ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicationNumber && app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">PENDING REVIEW</span>;
      case "UNDER_REVIEW":
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold">UNDER REVIEW</span>;
      case "APPROVED":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">APPROVED & INVITED</span>;
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold">REJECTED</span>;
      case "MORE_INFORMATION":
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold">INFO REQUESTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02040A] text-slate-100 font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-500/20 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                <Briefcase className="size-3.5" />
                <span>Dragon Studios — Executive Recruitment Command Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Careers & Team Applications</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 font-bold">
                  {applicationsList.length} Candidates
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Review candidate applications from the public website, inspect portfolios, and issue encrypted single-use invitations with 1 click.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={fetchPortalData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050C17] hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition-all shadow-inner cursor-pointer"
              >
                <RefreshCw className={cn("size-3.5 text-cyan-400", loading && "animate-spin")} />
                <span>Refresh List</span>
              </button>

              <button
                onClick={() => setActiveTab("create")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer uppercase tracking-wider"
              >
                <UserPlus className="size-4" />
                <span>Direct Invitation</span>
              </button>
            </div>
          </div>

          {noticeMsg && (
            <div className={`p-4 rounded-2xl border font-bold flex items-center justify-between text-xs font-mono backdrop-blur-xl ${noticeMsg.type === "success" ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" : "bg-rose-950/60 border-rose-500/40 text-rose-300"}`}>
              <span>{noticeMsg.text}</span>
              <button onClick={() => setNoticeMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#050C17]/90 border border-blue-500/20 rounded-2xl p-5 space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
                <span>Total Applications</span>
                <FileText className="size-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{telemetry.applicationsCount}</div>
              <div className="text-[11px] text-cyan-400 font-mono">From public careers portal</div>
            </div>

            <div className="bg-[#050C17]/90 border border-amber-500/20 rounded-2xl p-5 space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between text-amber-400 text-xs font-mono uppercase">
                <span>Pending Review</span>
                <Clock className="size-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {applicationsList.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Awaiting owner decision</div>
            </div>

            <div className="bg-[#050C17]/90 border border-emerald-500/20 rounded-2xl p-5 space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-mono uppercase">
                <span>Approved & Invited</span>
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {applicationsList.filter((a) => a.status === "APPROVED").length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Invitation tokens issued</div>
            </div>

            <div className="bg-[#050C17]/90 border border-purple-500/20 rounded-2xl p-5 space-y-2 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between text-purple-400 text-xs font-mono uppercase">
                <span>Active Staff</span>
                <Users className="size-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400 font-mono">{telemetry.activeTeamCount}</div>
              <div className="text-[11px] text-slate-400 font-mono">PostgreSQL Active IAM</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-blue-500/20 pb-3">
            {[
              { id: "applications" as const, label: `Candidate Applications (${applicationsList.length})`, icon: Briefcase },
              { id: "create" as const, label: "Issue Direct Invitation", icon: UserPlus },
              { id: "invitations" as const, label: `Invitations Vault (${invitationsList.length})`, icon: Key },
              { id: "audit" as const, label: "Recruitment Audit Trail", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB: CANDIDATE APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              {/* Search and Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#050C17]/90 border border-blue-500/20 p-4 rounded-2xl">
                <div className="relative w-full sm:w-80">
                  <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate, role, email..."
                    className="w-full bg-[#030712] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <Filter className="size-3.5 text-slate-400 shrink-0" />
                  {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "MORE_INFORMATION", "REJECTED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer",
                        statusFilter === st
                          ? "bg-cyan-500 text-black"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      )}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applications List */}
              {filteredApplications.length === 0 ? (
                <div className="bg-[#050C17]/90 border border-blue-500/20 rounded-3xl p-12 text-center space-y-3">
                  <Briefcase className="size-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-300">No applications match your filter</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    When candidates submit applications on the Dragon Studios website careers section, they will appear here in real-time for your review.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#050C17]/95 border border-blue-500/20 hover:border-cyan-500/40 rounded-2xl p-5 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-black text-sm text-white">{app.applicantName}</span>
                          <span className="text-xs text-slate-400 font-mono">({app.applicantEmail})</span>
                          {getStatusBadge(app.status)}
                          {app.applicationNumber && (
                            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">
                              {app.applicationNumber}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                          <span className="text-cyan-300 font-semibold">{app.jobTitle}</span>
                          <span>•</span>
                          <span>{app.department}</span>
                          <span>•</span>
                          <span className="text-slate-500">{app.experience || "Senior"}</span>
                          <span>•</span>
                          <span className="text-slate-500">{app.country || "Global"}</span>
                        </div>

                        {app.primarySkill && (
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-2xl">
                            <span className="text-slate-500">Skills: </span>
                            {app.primarySkill}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-all"
                            title="Open Portfolio Link"
                          >
                            <Globe className="size-4" />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setEvalRole("DEVELOPER");
                            setEvalDepartment(app.department || "Engineering");
                            setEvalNotes(app.ownerNotes || "");
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs hover:scale-105 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                        >
                          <Eye className="size-3.5" />
                          <span>Review & Action</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: DIRECT INVITATION */}
          {activeTab === "create" && (
            <div className="bg-[#050C17]/95 border border-blue-500/20 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="size-5 text-cyan-400" />
                  <span>Issue Direct Team Invitation</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Generate a cryptographically random, SHA-256 hashed single-use invitation token.
                </p>
              </div>

              <form onSubmit={handleCreateInvitation} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Candidate / Staff Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-[#030712] border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Corporate / Target Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-[#030712] border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Role Assignment</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#030712] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {ROLES_LIST.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#030712] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {DEPARTMENTS_LIST.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Link Expiry</label>
                    <select
                      value={expirationHours}
                      onChange={(e) => setExpirationHours(e.target.value)}
                      className="w-full bg-[#030712] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                      <option value="72">72 Hours</option>
                      <option value="168">7 Days</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-slate-300 font-bold">Granted Capabilities / Permissions</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PERMISSION_OPTIONS.map((p) => {
                      const isChecked = selectedPermissions.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleTogglePermission(p)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-mono transition-all flex items-center justify-between cursor-pointer",
                            isChecked
                              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                              : "bg-[#030712] border-slate-800 text-slate-500 hover:text-slate-300"
                          )}
                        >
                          <span>{p}</span>
                          {isChecked && <Check className="size-3 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-black text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 cursor-pointer uppercase tracking-wider"
                >
                  {creating ? "Generating & Dispatching..." : "Generate Single-Use Invitation →"}
                </button>
              </form>

              {createdResult && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                  <div className="text-cyan-300 font-bold text-xs">Invitation Generated:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdResult.inviteUrl}
                      className="w-full bg-[#030712] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                    />
                    <button
                      onClick={() => handleCopySecret(createdResult.inviteUrl)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs shrink-0 cursor-pointer"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: INVITATIONS VAULT */}
          {activeTab === "invitations" && (
            <div className="bg-[#050C17]/90 border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-blue-500/20 bg-[#030712] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Issued By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invitationsList.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-white">{inv.email}</td>
                      <td className="py-3 px-4 text-cyan-400">{inv.role}</td>
                      <td className="py-3 px-4 text-slate-400">{inv.department || "Engineering"}</td>
                      <td className="py-3 px-4">
                        {inv.status === "PENDING" && <span className="text-amber-400">PENDING</span>}
                        {inv.status === "ACCEPTED" && <span className="text-emerald-400">ACCEPTED</span>}
                        {inv.status === "REVOKED" && <span className="text-rose-400">REVOKED</span>}
                        {inv.status === "EXPIRED" && <span className="text-slate-500">EXPIRED</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{inv.createdBy}</td>
                      <td className="py-3 px-4 text-right">
                        {inv.status === "PENDING" && (
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: AUDIT LOG */}
          {activeTab === "audit" && (
            <div className="bg-[#050C17]/90 border border-blue-500/20 rounded-2xl p-6 space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase">Recruitment & Invitation Audit Events</h3>
              <div className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-cyan-400 font-bold">{log.action}</span>
                      <span className="text-slate-400 ml-2">{log.details}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CANDIDATE REVIEW MODAL DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#050C17] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <div className="text-xs text-cyan-400 font-mono font-bold uppercase">
                  Candidate Evaluation & Decision Portal
                </div>
                <h2 className="text-xl font-heading font-black text-white">{selectedApp.applicantName}</h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Candidate Card Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#030712] p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500">Email: </span>
                <span className="text-slate-200">{selectedApp.applicantEmail}</span>
              </div>
              <div>
                <span className="text-slate-500">Applied Role: </span>
                <span className="text-cyan-400 font-bold">{selectedApp.jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-500">Department: </span>
                <span className="text-slate-200">{selectedApp.department}</span>
              </div>
              <div>
                <span className="text-slate-500">Experience Level: </span>
                <span className="text-slate-200">{selectedApp.experience || "Senior"}</span>
              </div>
              <div>
                <span className="text-slate-500">Country / Location: </span>
                <span className="text-slate-200">{selectedApp.country || "Global / Remote"}</span>
              </div>
              <div>
                <span className="text-slate-500">Phone: </span>
                <span className="text-slate-200">{selectedApp.phone || "Not provided"}</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3">
              {selectedApp.portfolioUrl && (
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-cyan-300 hover:bg-blue-600/30 text-xs font-mono flex items-center gap-1.5"
                >
                  <Globe className="size-3.5" />
                  <span>Portfolio URL ↗</span>
                </a>
              )}
              {selectedApp.linkedinUrl && (
                <a
                  href={selectedApp.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-cyan-300 hover:bg-blue-600/30 text-xs font-mono flex items-center gap-1.5"
                >
                  <ExternalLink className="size-3.5" />
                  <span>LinkedIn Profile ↗</span>
                </a>
              )}
              {selectedApp.resumeUrl && (
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-mono flex items-center gap-1.5"
                >
                  <FileText className="size-3.5" />
                  <span>View Resume ↗</span>
                </a>
              )}
            </div>

            {/* Why Join statement */}
            {selectedApp.whyJoin && (
              <div className="space-y-1 bg-[#030712] p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="text-slate-400 font-bold font-mono">Why Join Dragon Studios:</div>
                <p className="text-slate-200 leading-relaxed">{selectedApp.whyJoin}</p>
              </div>
            )}

            {/* Primary Skills & Projects */}
            {selectedApp.primarySkill && (
              <div className="space-y-1 bg-[#030712] p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="text-slate-400 font-bold font-mono">Key Skills & Projects:</div>
                <p className="text-slate-200 leading-relaxed font-mono">{selectedApp.primarySkill}</p>
              </div>
            )}

            {/* OWNER ACTION SECTION */}
            <div className="border-t border-slate-800 pt-4 space-y-4">
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Award className="size-4 text-cyan-400" />
                <span>Executive Decision & Offer Configuration:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Granted Staff Role</label>
                  <select
                    value={evalRole}
                    onChange={(e) => setEvalRole(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {ROLES_LIST.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Department</label>
                  <select
                    value={evalDepartment}
                    onChange={(e) => setEvalDepartment(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {DEPARTMENTS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Invitation Expiry</label>
                  <select
                    value={evalExpiry}
                    onChange={(e) => setEvalExpiry(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="72">72 Hours</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-mono">Owner Evaluation Notes / Feedback</label>
                <textarea
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Add evaluation notes or questions for candidate..."
                  className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 h-20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAppAction("reject_application", selectedApp.id)}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  Reject Candidate
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAppAction("request_info_application", selectedApp.id)}
                    className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-bold font-mono transition-all cursor-pointer"
                  >
                    Request Info
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAppAction("approve_application", selectedApp.id)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 text-black font-black text-xs font-mono hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer uppercase tracking-wider"
                  >
                    {isProcessing ? "Issuing Invitation..." : "✓ Approve & Issue Staff Invitation →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
