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
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-mono text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff1e4b]">
                ENTERPRISE GAME MANAGEMENT PLATFORM
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5 font-heading">
                GAME PORTFOLIO DIRECTORY
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchGames} variant="outline" size="sm" className="rounded-xl text-xs gap-2">
                <RefreshCw className="size-3.5 text-[#ff1e4b]" />
                <span>REFRESH GAME NODES</span>
              </Button>
              <Button onClick={handleOpenCreate} variant="solidRed" size="sm" className="rounded-xl text-xs gap-2">
                <Plus className="size-4" />
                <span>ADD NEW GAME TITLE</span>
              </Button>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">TOTAL TITLES</span>
              <span className="text-2xl font-black text-white block">{telemetry.totalGames}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">PUBLISHED GAMES</span>
              <span className="text-2xl font-black text-emerald-400 block">{telemetry.publishedGames}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">IN DEVELOPMENT</span>
              <span className="text-2xl font-black text-[#ff1e4b] block">{telemetry.inDevelopment}</span>
            </div>
            <div className="rounded-2xl glass-card p-4 border border-white/10 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">UPCOMING RELEASES</span>
              <span className="text-2xl font-black text-amber-400 block">{telemetry.upcoming}</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "Released", "In Development", "Testing", "Pre Production"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border shrink-0",
                    statusFilter === st ? "bg-[#ff1e4b] text-white border-[#ff1e4b]" : "bg-white/5 text-muted-foreground border-white/5 hover:text-white"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, genre, platforms..."
                className="w-full rounded-xl bg-black/60 px-3 py-1.5 pl-9 text-xs text-white placeholder:text-muted-foreground border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
              />
            </div>
          </div>

          {/* Registration / Edit Drawer Modal */}
          {modalOpen && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-[#ff1e4b]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-[#ff1e4b] flex items-center gap-2">
                  <Gamepad2 className="size-4" />
                  <span>{editId ? "EDIT GAME SPECIFICATION" : "PROVISION NEW GAME TITLE"}</span>
                </span>
                <button onClick={() => setModalOpen(false)} className="text-xs text-muted-foreground hover:text-white">
                  CANCEL
                </button>
              </div>

              <form onSubmit={handleSaveGame} className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">GAME TITLE</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Embers of Valyria"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">GENRE</label>
                  <input
                    type="text"
                    required
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="Open-World Dark Fantasy RPG"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">STATUS</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Pre Production">Pre Production</option>
                    <option value="Testing">Testing</option>
                    <option value="Released">Released</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">RELEASE DATE</label>
                  <input
                    type="text"
                    value={formReleaseDate}
                    onChange={(e) => setFormReleaseDate(e.target.value)}
                    placeholder="Q3 2027"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">TARGET PLATFORMS</label>
                  <input
                    type="text"
                    value={formPlatforms}
                    onChange={(e) => setFormPlatforms(e.target.value)}
                    placeholder="PC, PS5, Xbox Series X"
                    className="w-full rounded-xl bg-black/60 px-3 py-2 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-xl bg-black/60 p-3 text-xs text-white border border-white/10 focus:outline-none focus:border-[#ff1e4b]"
                  />
                </div>

                <div className="sm:col-span-12 flex justify-end">
                  <Button type="submit" disabled={saving} variant="solidRed" size="md" className="gap-2">
                    {saving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
                    <span>COMMIT GAME TO POSTGRESQL</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Games Grid */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#ff1e4b]" />
              Loading PostgreSQL game titles...
            </div>
          ) : games.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              No games registered matching selected filter.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {games.map((game) => (
                <div key={game.id} className="rounded-3xl glass-panel p-6 border border-white/15 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-bold text-[10px]">
                        {game.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{game.genre}</span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase font-heading tracking-tight">{game.name}</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">{game.description}</p>

                    <div className="rounded-2xl bg-black/40 p-3 border border-white/10 space-y-1 text-[10px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">PLATFORMS:</span> <span className="text-white font-bold">{game.platforms}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">RELEASE:</span> <span className="text-[#ff1e4b] font-bold">{game.releaseDate}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <Button onClick={() => handleOpenEdit(game)} variant="outline" size="sm" className="text-xs gap-1.5">
                      <Edit3 className="size-3.5 text-[#ff1e4b]" /> EDIT
                    </Button>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
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
