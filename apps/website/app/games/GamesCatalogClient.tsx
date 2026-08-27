"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Gamepad2, Monitor, Smartphone, Globe } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { cn } from "@/lib/cn";

export interface GamesCatalogClientProps {
  initialGames: any[];
}

export function GamesCatalogClient({ initialGames }: GamesCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState("ALL");

  // Derive unique genres dynamically from real database data
  const genres = useMemo(() => {
    const set = new Set<string>();
    initialGames.forEach((g) => {
      if (g.genre) set.add(g.genre);
    });
    return ["ALL", ...Array.from(set)];
  }, [initialGames]);

  // Derive filtered list
  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      const matchesSearch = !searchQuery || (
        game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesGenre = selectedGenre === "ALL" || game.genre === selectedGenre;

      const p = (game.platforms || "").toLowerCase();
      let matchesPlatform = true;
      if (selectedPlatform === "PC") {
        matchesPlatform = p.includes("pc") || p.includes("exe") || p.includes("windows");
      } else if (selectedPlatform === "MOBILE") {
        matchesPlatform = p.includes("android") || p.includes("apk") || p.includes("mobile");
      } else if (selectedPlatform === "WEB") {
        matchesPlatform = p.includes("web") || p.includes("browser");
      }

      return matchesSearch && matchesGenre && matchesPlatform;
    });
  }, [initialGames, searchQuery, selectedGenre, selectedPlatform]);

  const featuredGames = filteredGames.filter((g) => g.isFeatured);
  const catalogGames = filteredGames;

  return (
    <div className="space-y-12">
      
      {/* ═══ FILTER & SEARCH TOOLBAR ═══ */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090D16]/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="size-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search franchises, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all font-sans"
            />
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: "ALL", label: "All Platforms" },
              { id: "PC", label: "PC (.exe)" },
              { id: "MOBILE", label: "Android (.apk)" },
              { id: "WEB", label: "Web Play" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer",
                  selectedPlatform === p.id
                    ? "bg-white/15 text-white shadow-xs border border-white/20"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-white/5">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={cn(
                "px-3.5 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer",
                selectedGenre === genre
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-2xs"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ GAMES CATALOG GRID ═══ */}
      {catalogGames.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
          <Gamepad2 className="size-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Games Found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search criteria or clear your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {catalogGames.map((game, idx) => (
            <GameCard key={game.id} game={game} priority={idx < 3} />
          ))}
        </div>
      )}

    </div>
  );
}
