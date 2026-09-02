"use client";

import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import Link from "next/link";

interface GameItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  genre: string;
  status: "PUBLISHED" | "BETA" | "ALPHA" | "DRAFT";
  platforms: string;
  year: string;
  description: string;
}

const INITIAL_GAMES: GameItem[] = [
  {
    id: "1",
    slug: "uncharted-drive-beyond",
    title: "Uncharted Drive: Beyond",
    subtitle: "AAA Cyber Racing Experience",
    genre: "Racing / Open World",
    status: "PUBLISHED",
    platforms: "PC, Android, Web",
    year: "2026",
    description: "Next-generation AAA cyber racing franchise. Experience ultra-realistic physics, nitro speed, and ray-traced neon environments.",
  },
];

export default function GamesCatalogPage() {
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [search, setSearch] = useState("");

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) || g.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WEB GAMES
            </span>
            <span className="text-xs text-slate-400 font-mono">• Game Catalog & Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Game Catalog & Title Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage all game franchises, engine build parameters, genres, supported platforms, and release metadata.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/20 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>New Game Draft</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search games or genres..."
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Game Cards Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="p-6 rounded-xl bg-[#0F172A] border border-white/[0.08] hover:border-indigo-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{game.title}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {game.status}
                  </span>
                </div>
                <div className="text-xs text-indigo-400 font-mono mt-0.5">{game.subtitle}</div>
              </div>

              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{game.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5 font-mono">
              <div>
                <span className="text-slate-500">Genre:</span>{" "}
                <span className="text-slate-200">{game.genre}</span>
              </div>
              <div>
                <span className="text-slate-500">Year:</span>{" "}
                <span className="text-slate-200">{game.year}</span>
              </div>
              <div>
                <span className="text-slate-500">Platforms:</span>{" "}
                <span className="text-slate-200">{game.platforms}</span>
              </div>
              <div>
                <span className="text-slate-500">Slug:</span>{" "}
                <span className="text-slate-200">{game.slug}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <Link
                href={`https://dragongamingstudios.vercel.app/games/${game.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <span>Preview Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Metadata</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
