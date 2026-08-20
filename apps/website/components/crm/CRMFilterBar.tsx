import React from "react";
import { Search, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CRMFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function CRMFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  loading,
}: CRMFilterBarProps) {
  const statuses = [
    "All",
    "OPEN",
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "WAITING_FOR_CUSTOMER",
    "RESOLVED",
    "CLOSED",
    "SPAM",
    "ARCHIVED",
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Ticket ID, Customer Email, Subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === status
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "bg-slate-950/40 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {status}
          </button>
        ))}

        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          className="ml-auto md:ml-2 text-xs border-white/10 text-slate-300 hover:bg-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
          Sync
        </Button>
      </div>
    </div>
  );
}
