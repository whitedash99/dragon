"use client";

import React, { useState } from "react";
import { 
  Star, 
  Plus, 
  ThumbsUp, 
  CheckCircle2, 
  X, 
  Gamepad2, 
  MessageSquare 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CommunityNav } from "@/components/community/CommunityNav";
import { verifiedReviews, VerifiedReview } from "@/data/communityData";
import { games } from "@/data/content";
import { cn } from "@/lib/cn";
import { DragonAtmosphere } from "@/components/cinematic/DragonAtmosphere";
import { useSession } from "next-auth/react";

export default function CommunityReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<VerifiedReview[]>(verifiedReviews);
  const [selectedGame, setSelectedGame] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [gameSlug, setGameSlug] = useState("uncharted-drive-beyond");
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
    const authorName = session?.user?.name || session?.user?.email?.split("@")[0] || "Dragon Operative";

    const newRev: VerifiedReview = {
      id: `rev-${Date.now()}`,
      gameSlug,
      gameTitle: game?.title || "UNCHARTED DRIVE: BEYOND",
      author: {
        name: authorName,
        avatar: "DO",
        verified: true,
        playtimeHours: 1,
      },
      rating,
      headline,
      content,
      pros: ["Realistic Vehicle Dynamics", "Atmospheric Sunset Lighting"],
      cons: ["High Precision Steering Required"],
      helpfulCount: 0,
      timestamp: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setHeadline("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-[#020512] text-slate-100 font-sans antialiased overflow-x-hidden select-none relative font-mono">
      <Navbar />
      <DragonAtmosphere world="core" />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-20 lg:pt-24 z-10">
        <CommunityNav />

        <section className="container-site relative z-10 my-8 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                VERIFIED PLAYER INSIGHTS
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight font-heading mt-0.5">
                Player Game Reviews
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <Plus className="size-4" />
              <span>Write Verified Review</span>
            </button>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#03091D]/90 border border-cyan-500/20 p-8 space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <MessageSquare className="size-8 text-cyan-400/40 mx-auto" />
              <div className="text-sm font-bold text-white uppercase">No Reviews Yet</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Be the first verified operative to test UNCHARTED DRIVE: BEYOND and publish your telemetry review!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="rounded-3xl bg-[#03091D]/90 p-8 border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                          {rev.gameTitle}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="size-4 fill-current" />
                          ))}
                        </div>
                      </div>

                      <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 font-mono">
                        Verified Operative
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-heading">{rev.headline}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">{rev.content}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20 text-xs">
                    <span className="text-slate-400">@{rev.author.name}</span>
                    <button
                      onClick={() => handleHelpful(rev.id)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-white"
                    >
                      <ThumbsUp className="size-3.5" />
                      <span>{rev.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-bold text-white text-sm uppercase">
                Write Verified Review
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3 text-xs">
              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Incredible highway driving physics"
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star className={cn("size-5", star <= rating ? "text-amber-400 fill-current" : "text-slate-600")} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-cyan-400 block mb-1 font-bold">Feedback Details *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your driving experience, frame pacing, and controls feel..."
                  rows={4}
                  className="w-full rounded-xl bg-[#02050E] p-2.5 text-white border border-cyan-500/30 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#02050E] border border-cyan-500/20 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.35)] cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
