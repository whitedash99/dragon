"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Gamepad2, 
  RefreshCw, 
  Search, 
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  genre: string;
  status: string;
  releaseDate: string;
  platforms: string;
  description: string;
  isPublished: boolean;
  developer?: string;
  publisher?: string;
  engine?: string;
  createdAt: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalGames: 0,
    publishedGames: 0,
    inDevelopment: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer / Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formGenre, setFormGenre] = useState("Action RPG");
  const [formStatus, setFormStatus] = useState("In Development");
  const [formReleaseDate, setFormReleaseDate] = useState("Q3 2027");
  const [formPlatforms, setFormPlatforms] = useState("PC, PS5, Xbox Series X");
  const [formDescription, setFormDescription] = useState("");

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.games)) {
        setGames(data.games);
        if (data.telemetry) setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Error fetching games", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchGames();
    });
    return () => { isMounted = false; };
  }, [fetchGames]);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormName("");
    setFormGenre("Action RPG");
    setFormStatus("In Development");
    setFormReleaseDate("Q3 2027");
    setFormPlatforms("PC, PS5, Xbox Series X");
    setFormDescription("An epic AAA experience forged by Dragon Studios.");
    setModalOpen(true);
  };

  const handleOpenEdit = (g: GameItem) => {
    setEditId(g.id);
    setFormName(g.name);
    setFormGenre(g.genre);
    setFormStatus(g.status);
    setFormReleaseDate(g.releaseDate);
    setFormPlatforms(g.platforms);
    setFormDescription(g.description);
    setModalOpen(true);
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Delete this game title from the studio portfolio?")) return;
    try {
      await fetch(`/api/games?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      fetchGames();
    } catch (e) {
      console.error("Delete game error", e);
    }
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name: formName.trim(),
          genre: formGenre.trim(),
          status: formStatus,
          releaseDate: formReleaseDate.trim(),
          platforms: formPlatforms.trim(),
          description: formDescription.trim(),
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchGames();
      }
    } catch (err) {
      console.error("Save game error", err);
    } finally {
      setSaving(false);
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
                <Gamepad2 className="size-3.5 text-slate-700" />
                <span>Enterprise Game Operations & Releases</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Game Portfolio Directory</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchGames} variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs">
                <RefreshCw className={`size-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Titles</span>
              </Button>
              <Button onClick={handleOpenCreate} variant="outline" size="sm" className="rounded-xl text-xs gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs">
                <Plus className="size-4" />
                <span>Add Game Title</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 uppercase text-[11px] font-bold block">Total Titles</span>
              <span className="text-3xl font-extrabold text-slate-900 block">{telemetry.totalGames}</span>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 uppercase text-[11px] font-bold block">Published Games</span>
              <span className="text-3xl font-extrabold text-emerald-700 block">{telemetry.publishedGames}</span>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 uppercase text-[11px] font-bold block">In Development</span>
              <span className="text-3xl font-extrabold text-slate-800 block">{telemetry.inDevelopment}</span>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-xs">
              <span className="text-slate-500 uppercase text-[11px] font-bold block">Upcoming Releases</span>
              <span className="text-3xl font-extrabold text-amber-700 block">{telemetry.upcoming}</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 font-mono">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "Released", "In Development", "Testing", "Pre Production"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border shrink-0",
                    statusFilter === st ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, genre, platforms..."
                className="w-full rounded-xl bg-white px-3 py-2 pl-9 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Registration / Edit Drawer Modal */}
          {modalOpen && (
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono">
                  <Gamepad2 className="size-4 text-slate-700" />
                  <span>{editId ? "Edit Game Specification" : "Provision New Game Title"}</span>
                </span>
                <button onClick={() => setModalOpen(false)} className="text-xs text-slate-400 hover:text-slate-700 font-mono font-bold">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveGame} className="grid gap-4 sm:grid-cols-12 font-mono">
                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">GAME TITLE</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Embers of Valyria"
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">GENRE</label>
                  <input
                    type="text"
                    required
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="Open-World Dark Fantasy RPG"
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">STATUS</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Pre Production">Pre Production</option>
                    <option value="Testing">Testing</option>
                    <option value="Released">Released</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">RELEASE DATE</label>
                  <input
                    type="text"
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    placeholder="Q3 2027"
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">TARGET PLATFORMS</label>
                  <input
                    type="text"
                    value={formPlatforms}
                    onChange={(e) => setFormPlatforms(e.target.value)}
                    placeholder="PC, PS5, Xbox Series X"
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 p-3.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-12 flex justify-end">
                  <Button type="submit" disabled={saving} variant="outline" size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs rounded-xl">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>Save Title Record</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Games Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-mono">
              <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-slate-500" />
              Loading PostgreSQL game titles...
            </div>
          ) : games.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-mono">
              No games registered matching selected filter.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {games.map((game) => (
                <div key={game.id} className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 font-bold text-[10px]">
                        {game.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{game.genre}</span>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{game.name}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{game.description}</p>

                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-slate-500">PLATFORMS:</span> <span className="text-slate-900 font-bold">{game.platforms}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">RELEASE:</span> <span className="text-slate-900 font-bold">{game.releaseDate}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 font-mono">
                    <Button onClick={() => handleOpenEdit(game)} variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl border-slate-200 font-bold">
                      <Edit3 className="size-3.5 text-slate-600" /> Edit
                    </Button>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
