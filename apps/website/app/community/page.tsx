"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Star, 
  Trophy, 
  Plus, 
  ChevronRight,
  Instagram,
  Youtube,
  Twitter,
  ArrowUpRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { CommunityNav } from "@/components/community/CommunityNav";
import { forumThreads, verifiedReviews } from "@/data/communityData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";

export default function CommunityHubPage() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <CommunityNav />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-32 pt-12">
        {/* Welcome Hero Banner */}
        <section className="container-site relative z-10 mb-12">
          <div className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 overflow-hidden relative">
            <div 
              aria-hidden="true" 
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-purple via-dragon-400 to-neon-cyan" 
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-dragon-500/20 bg-dragon-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-dragon-400 mb-4">
                  <Users className="size-3.5" />
                  <span>15M+ Global Insiders</span>
                </div>

                <h1 className="text-4xl font-black uppercase text-white tracking-tight sm:text-5xl lg:text-6xl leading-[0.9]">
                  Where Gamers & <br />
                  <span className="text-gradient">Engine Creators Meet.</span>
                </h1>

                <p className="mt-4 text-base text-muted-foreground leading-relaxed sm:text-lg max-w-xl">
                  Engage in technical dev dispatches, submit verified reviews, compete in global esports tournaments, and apply for the Dragon Creator Program.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="glow" size="lg" className="rounded-full gap-2 px-6" asChild>
                  <Link href="/community/forums">
                    <Plus className="size-4" />
                    <span>Join Forum Discussions</span>
                  </Link>
                </Button>

                <Button variant="glass" size="lg" className="rounded-full gap-2 px-6 border-white/20" asChild>
                  <Link href="/community/events">
                    <Trophy className="size-4 text-amber-400" />
                    <span>View Tournaments</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* OFFICIAL SOCIAL CHANNELS SECTION */}
        <section className="container-site relative z-10 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
              Official Studio Channels
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase text-white tracking-tight sm:text-4xl">
              Follow Dragon Studios
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Connect directly with our development teams, watch exclusive game teasers, and join official player discussions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Instagram Card */}
            <div className="rounded-3xl glass-heavy p-6 border border-white/15 hover:border-pink-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-110 transition-transform">
                    <Instagram className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-pink-400 font-bold">{OFFICIAL_SOCIALS.instagram.followers} Insiders</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
                <p className="text-xs font-mono text-muted-foreground mb-4">{OFFICIAL_SOCIALS.instagram.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500/20 px-4 py-2.5 text-xs font-bold text-pink-300 border border-pink-500/30 hover:bg-pink-500 hover:text-white transition-colors"
              >
                <span>Follow on Instagram</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* YouTube Card */}
            <div className="rounded-3xl glass-heavy p-6 border border-white/15 hover:border-red-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <Youtube className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-red-400 font-bold">{OFFICIAL_SOCIALS.youtube.subscribers} Subs</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">YouTube</h3>
                <p className="text-xs font-mono text-muted-foreground mb-4">{OFFICIAL_SOCIALS.youtube.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-2.5 text-xs font-bold text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
              >
                <span>Subscribe on YouTube</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* X (Twitter) Card */}
            <div className="rounded-3xl glass-heavy p-6 border border-white/15 hover:border-sky-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                    <Twitter className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-sky-400 font-bold">{OFFICIAL_SOCIALS.x.followers} Followers</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">X (Twitter)</h3>
                <p className="text-xs font-mono text-muted-foreground mb-4">{OFFICIAL_SOCIALS.x.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500/20 px-4 py-2.5 text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <span>Follow on X</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* Reddit Card */}
            <div className="rounded-3xl glass-heavy p-6 border border-white/15 hover:border-orange-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
                    <MessageSquare className="size-6" />
                  </div>
                  <span className="font-mono text-xs text-orange-400 font-bold">{OFFICIAL_SOCIALS.reddit.members} Members</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Reddit</h3>
                <p className="text-xs font-mono text-muted-foreground mb-4">{OFFICIAL_SOCIALS.reddit.handle}</p>
              </div>
              <a
                href={OFFICIAL_SOCIALS.reddit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500/20 px-4 py-2.5 text-xs font-bold text-orange-300 border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-colors"
              >
                <span>Join Reddit Community</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Studio Metrics */}
        <section className="container-site relative z-10 mb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Insiders", val: "15,240,000+", sub: "Registered players", icon: Users, color: "text-dragon-400" },
              { label: "Forum Discussions", val: "42,800+", sub: "Threads & dev answers", icon: MessageSquare, color: "text-neon-purple" },
              { label: "Verified Reviews", val: "1,250,000+", sub: "95% positive rating", icon: Star, color: "text-amber-400" },
              { label: "Esports Prize Pools", val: "$250,000 GTD", sub: "Annual tournament series", icon: Trophy, color: "text-neon-cyan" },
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl glass-md p-6 border border-white/10 flex items-center gap-4">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10 shrink-0">
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  <p className="text-xl font-black text-white mt-0.5">{stat.val}</p>
                  <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Forum Discussions */}
        <section className="container-site relative z-10 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Community Discussions
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase text-white">
                Trending Forum Threads
              </h2>
            </div>

            <Link href="/community/forums" className="text-xs font-bold text-dragon-400 hover:underline flex items-center gap-1">
              <span>View All Forums</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {forumThreads.map((thread) => (
              <Link
                key={thread.id}
                href="/community/forums"
                className="group block rounded-2xl glass-heavy p-6 border border-white/10 hover:border-white/25 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {thread.pinned && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                          PINNED
                        </span>
                      )}
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
                        {thread.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-dragon-300 transition-colors">
                      {thread.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-1">{thread.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-muted-foreground shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-dragon-400 to-neon-purple text-xs font-bold text-white">
                        {thread.author.avatar}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{thread.author.name}</span>
                        <span className="text-[10px] text-dragon-400">{thread.author.role}</span>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] text-right">
                      <span className="block text-white font-bold">{thread.repliesCount} replies</span>
                      <span>{thread.likesCount} upvotes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Verified Reviews */}
        <section className="container-site relative z-10 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-dragon-400">
                Player Voice
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase text-white">
                Verified Player Reviews
              </h2>
            </div>
            <Link href="/community/reviews" className="text-xs font-bold text-dragon-400 hover:underline flex items-center gap-1">
              <span>Read All Reviews</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {verifiedReviews.map((rev) => (
              <div key={rev.id} className="rounded-3xl glass-heavy p-8 border border-white/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>

                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      Verified Buyer ({rev.author.playtimeHours}h played)
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
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold text-white">{rev.author.name}</span>
                  <span>{rev.helpfulCount} players found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
