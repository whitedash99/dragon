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
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface UserItem {
  id: string;
  name?: string;
  email: string;
  role: string;
  department?: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminsCount: 0,
    suspendedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Provisioning Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("ADMINISTRATOR");
  const [formDepartment, setFormDepartment] = useState("Engineering");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?role=${encodeURIComponent(roleFilter)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
        if (data.telemetry) setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching users", e);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchUsers();
    });
    return () => { isMounted = false; };
  }, [fetchUsers]);

  const handleOpenProvision = () => {
    setEditId(null);
    setFormName("");
    setFormEmail("");
    setFormRole("ADMINISTRATOR");
    setFormDepartment("Engineering");
    setModalOpen(true);
  };

  const handleOpenEdit = (u: UserItem) => {
    setEditId(u.id);
    setFormName(u.name || "");
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormDepartment(u.department || "Engineering");
    setModalOpen(true);
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Deactivate this employee account?")) return;
    try {
      await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      fetchUsers();
    } catch (e) {
      console.error("Deactivate user error", e);
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
          department: formDepartment.trim(),
          status: "ACTIVE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      console.error("Save user error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                IDENTITY & ACCESS MANAGEMENT (IAM)
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                USER DIRECTORY & GOVERNANCE
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchUsers} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH USER NODES</span>
              </Button>
              <Button onClick={handleOpenProvision} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <UserPlus className="size-4" />
                <span>PROVISION USER</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL USERS</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalUsers}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">ACTIVE STAFF</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.activeUsers}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">EXECUTIVE ADMNS</span>
              <span className="text-2xl font-black text-[#ff1e4b] block">{telemetry.adminsCount}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">SUSPENDED / INACTIVE</span>
              <span className="text-2xl font-black text-amber-400 block">{telemetry.suspendedCount}</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "SUPER_ADMIN", "ADMINISTRATOR", "DEVELOPER", "SUPPORT", "MARKETING", "EDITOR"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border shrink-0",
                    roleFilter === r ? "bg-[#ff1e4b] text-white border-[#ff1e4b]" : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, department..."
                className="w-full rounded-xl bg-black/60 px-3 py-1.5 pl-9 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          {/* Provision Modal Drawer */}
          {modalOpen && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-[#ff1e4b]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-[#ff1e4b] flex items-center gap-2">
                  <UserPlus className="size-4" />
                  <span>{editId ? "UPDATE USER SPECIFICATION" : "PROVISION NEW EMPLOYEE ACCOUNT"}</span>
                </span>
                <button onClick={() => setModalOpen(false)} className="text-xs text-muted-foreground hover:text-white">
                  CANCEL
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="marcus@dragonstudios.com"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">ROLE TIER</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                    <option value="SUPPORT">SUPPORT</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="EDITOR">EDITOR</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">DEPARTMENT</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Engineering"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-12 flex justify-end pt-2">
                  <Button type="submit" disabled={saving} variant="solidRed" size="md" className="gap-2">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>PROVISION ACCOUNT IN POSTGRESQL</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* User Directory Table */}
          <div className="rounded-3xl glass-panel overflow-hidden border border-white/15">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground text-xs">
                <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
                Loading PostgreSQL user records...
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-xs">
                No users found for selected role filter.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-black/40 text-muted-foreground uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-6 py-4">USER IDENTITY</th>
                    <th className="px-6 py-4">ROLE TIER</th>
                    <th className="px-6 py-4">DEPARTMENT</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/90">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <strong className="block text-white font-sans text-sm">{usr.name || "Employee"}</strong>
                        <span className="text-[#ff1e4b]">{usr.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-white/10 px-2 py-1 font-bold text-[10px] text-white">
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{usr.department || "General"}</td>
                      <td className="px-6 py-4">
                        <span className={cn("font-bold text-[10px]", usr.status === "ACTIVE" ? "text-emerald-400" : "text-amber-400")}>
                          {usr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(usr)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          >
                            <ShieldCheck className="size-3.5 text-[#ff1e4b]" />
                          </button>
                          <button
                            onClick={() => handleDeactivate(usr.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                          >
                            <Ban className="size-3.5" />
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
    </div>
  );
}
