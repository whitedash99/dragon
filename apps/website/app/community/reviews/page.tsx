"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Plus, 
  ThumbsUp, 
  CheckCircle2, 
  X, 
  Save, 
  Gamepad2, 
  MessageSquare 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { verifiedReviews, VerifiedReview } from "@/data/communityData";
import { games } from "@/data/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function CommunityReviewsPage() {
  const [reviews, setReviews] = useState<VerifiedReview[]>(verifiedReviews);
  const [selectedGame, setSelectedGame] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [gameSlug, setGameSlug] = useState("embers-of-valyria");
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const filteredReviews = reviews.filter(
    (r) => selectedGame === "All" || r.gameSlug === selectedGame
  );

  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.slug === gameSlug);
    const newRev: VerifiedReview = {
      id: `rev-${Date.now()}`,
      gameSlug,
      gameTitle: game?.title || "Embers of Valyria",
      author: {
        name: "Kaelen Voss",
        avatar: "KV",
        verified: true,
        playtimeHours: 184,
      },
      rating,
      headline,
      content,
      pros: ["High Performance", "Cinematic Graphics"],
      cons: ["Challenging Boss Mechanics"],
      helpfulCount: 1,
      timestamp: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setHeadline("");
    setContent("");
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        <section className="container-site relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Verified Player Insights
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl mt-0.5">
                Player Game Reviews
              </h1>
            </div>

            <Button onClick={() => setIsModalOpen(true)} variant="glow" size="sm" className="rounded-full gap-2 text-xs">
              <Plus className="size-4" />
              <span>Write Verified Review</span>
            </Button>
          </div>

          {/* Game Selector */}
          <div className="rounded-2xl glass-heavy p-4 border border-white/15 flex items-center gap-2 overflow-x-auto mb-8">
            <button
              onClick={() => setSelectedGame("All")}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                selectedGame === "All" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              All Titles
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGame(g.slug)}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                  selectedGame === g.slug ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"
                )}
              >
                {g.title}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="rounded-3xl glass-heavy p-8 border border-white/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-dragon-400 block mb-1">
                        {rev.gameTitle}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="size-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      Verified ({rev.author.playtimeHours}h played)
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{rev.headline}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{rev.content}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-white/10">
                    <div>
                      <span className="block font-bold text-emerald-400 text-[10px] uppercase">PROS</span>
                      <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                        {rev.pros.map((p, i) => <li key={i}>✓ {p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="block font-bold text-amber-400 text-[10px] uppercase">CONS</span>
                      <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                        {rev.cons.map((c, i) => <li key={i}>• {c}</li>)}
                      </ul>
                    </div>
                  </div>

                  {rev.developerReply && (
                    <div className="mt-6 rounded-2xl bg-dragon-500/10 p-4 border border-dragon-500/20 text-xs">
                      <span className="font-bold text-dragon-300 block">{rev.developerReply.author}</span>
                      <p className="text-[11px] text-muted-foreground mt-1">{rev.developerReply.message}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold text-white">{rev.author.name}</span>
                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                  >
                    <ThumbsUp className="size-3.5 text-dragon-400" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl glass-heavy p-8 border border-white/20"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>

              <h2 className="text-2xl font-black uppercase text-white">Write Verified Game Review</h2>

              <form onSubmit={handleCreateReview} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Select Title</label>
                  <select
                    value={gameSlug}
                    onChange={(e) => setGameSlug(e.target.value)}
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.slug}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Review headline..."
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">Detailed Review</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your detailed gameplay review..."
                    className="w-full rounded-xl bg-black/40 px-4 py-3 text-sm text-white border border-white/10 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button type="button" onClick={() => setIsModalOpen(false)} variant="ghost" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" variant="glow" size="sm" className="rounded-full gap-2">
                    <Save className="size-3.5" />
                    <span>Submit Review</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </SceneBackground>
  );
}
