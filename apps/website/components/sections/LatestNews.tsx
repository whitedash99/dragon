"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { news } from "@/data/content";
import { Button } from "@/components/ui/button";

export default function LatestNews() {
  const featuredArticle = news.find((item) => item.featured) || news[0];
  const regularArticles = news.filter((item) => item.id !== featuredArticle.id);

  return (
    <section
      id="news"
      aria-labelledby="latest-news-heading"
      className="relative py-24 lg:py-36 overflow-hidden bg-[#030304]"
    >
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-10 top-1/4 h-[500px] w-[500px] rounded-full bg-[#ff1e4b]/8 blur-[200px]" 
      />

      <div className="container-site relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end border-b border-white/10 pb-10">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b]">
              FROM THE FORGE
            </span>
            <h2
              id="latest-news-heading"
              className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white leading-[0.95]"
            >
              LATEST <span className="text-[#ff1e4b]">DISPATCHES</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-sans">
              Developer logs, architecture breakdowns, and official announcements from our engineering teams.
            </p>
          </div>

          <Button variant="glowOutline" size="lg" className="rounded-lg gap-2 px-8 text-xs tracking-[0.16em]" asChild>
            <Link href="/news">
              <span>ALL DISPATCHES</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Asymmetric News Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/15 p-8 sm:p-12 hover:border-[#ff1e4b]/50 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white/[0.04] to-transparent shadow-2xl space-y-8"
          >
            <div 
              aria-hidden="true" 
              className="absolute inset-0 bg-gradient-to-br from-[#ff1e4b]/15 via-transparent to-purple-900/10 opacity-25 group-hover:opacity-40 transition-opacity duration-500" 
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#ff1e4b]/20 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff1e4b] border border-[#ff1e4b]/30">
                  FEATURED
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground border border-white/10">
                  {featuredArticle.tag}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white group-hover:text-[#ff1e4b] transition-colors leading-tight">
                <Link href={`/news/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 font-sans">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#ff1e4b]" />
                  <span>{featuredArticle.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-white/40" />
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>

              <Link
                href={`/news/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#ff1e4b] transition-colors"
              >
                <span>READ ARTICLE</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Secondary Articles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {regularArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-all duration-300 bg-white/[0.02] space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-400">
                      {article.tag}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {article.date}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff1e4b] transition-colors line-clamp-2">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{article.readTime}</span>
                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center gap-1.5 font-bold text-white group-hover:text-[#ff1e4b] transition-colors"
                  >
                    <span>READ</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
