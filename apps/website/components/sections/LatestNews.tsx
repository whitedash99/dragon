"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, ChevronRight, Radio } from "lucide-react";
import { news } from "@/data/content";
import { soundFx } from "@/lib/sound-effects";

import { getClientCmsBlocks } from "@/lib/client-cms-cache";

export default function LatestNews() {
  const [cmsText, setCmsText] = React.useState({
    eyebrow: "FROM THE FORGE",
    title: "LATEST DISPATCHES & TRANSMISSIONS",
    description: "Official studio updates, patch releases, and community dispatches direct from the engineering core.",
  });

  React.useEffect(() => {
    getClientCmsBlocks().then((map) => {
      if (Object.keys(map).length > 0) {
        setCmsText((prev) => ({
          eyebrow: map["news.eyebrow"] || prev.eyebrow,
          title: map["news.title"] || prev.title,
          description: map["news.description"] || prev.description,
        }));
      }
    });

    const handleSync = (event: MessageEvent) => {
      const { type, key, content } = event.data || {};
      if (
        (type === "DRAGON_CMS_TEXT_UPDATE" ||
         type === "DRAGON_CMS_REALTIME_SYNC" ||
         type === "DRAGON_CMS_TEXT_TYPING") &&
        key && content !== undefined
      ) {
        setCmsText((prev) => {
          if (key === "news.eyebrow") return { ...prev, eyebrow: content };
          if (key === "news.title") return { ...prev, title: content };
          if (key === "news.description") return { ...prev, description: content };
          return prev;
        });
      }
    };

    window.addEventListener("message", handleSync);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("dragon_cms_live_sync");
      bc.addEventListener("message", handleSync);
    } catch {}

    return () => {
      window.removeEventListener("message", handleSync);
      if (bc) {
        bc.removeEventListener("message", handleSync);
        bc.close();
      }
    };
  }, []);

  const featuredArticle = news.find((item) => item.featured) || news[0];
  const regularArticles = news.filter((item) => item.id !== featuredArticle.id);

  return (
    <section
      id="news"
      aria-labelledby="latest-news-heading"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-transparent"
    >
      {/* Ambient Violet + Magenta Section Atmosphere */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-10 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-700/10 blur-[200px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-10 bottom-1/4 h-[500px] w-[500px] rounded-full bg-pink-600/10 blur-[200px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-14">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070B14] border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest">
              <Radio className="size-3 text-purple-400 animate-pulse" />
              <span data-cms-key="news.eyebrow">{cmsText.eyebrow}</span>
            </div>
            <h2
              id="latest-news-heading"
              data-cms-key="news.title"
              className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading leading-[0.95]"
            >
              {cmsText.title.includes("DISPATCHES") ? (
                <>LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-rose-300">DISPATCHES & TRANSMISSIONS</span></>
              ) : (
                cmsText.title
              )}
            </h2>
            <p data-cms-key="news.description" className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-sans">
              {cmsText.description}
            </p>
          </div>

          <Link
            href="/news"
            onClick={() => soundFx.playClick()}
            className="px-5 py-3 rounded-2xl bg-[#070B14] border border-purple-500/30 hover:border-pink-400 text-slate-200 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>ALL DISPATCHES</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Asymmetric News Grid */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Featured Article Card */}
          <div className="lg:col-span-7">
            <div className="group relative h-full flex flex-col justify-between rounded-3xl border border-purple-500/30 p-6 sm:p-10 hover:border-pink-500/60 transition-all duration-500 overflow-hidden bg-[#070B14]/90 shadow-xl space-y-6">
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-900/10 opacity-40 group-hover:opacity-70 transition-opacity duration-500" 
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-purple-300 border border-purple-400/40">
                    FEATURED
                  </span>
                  <span className="rounded-full bg-pink-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-pink-300 border border-pink-400/30">
                    {featuredArticle.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black uppercase text-white group-hover:text-purple-200 transition-colors leading-snug font-heading">
                  <Link href={`/news/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-sans">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-purple-400" />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-pink-400" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>

                <Link
                  href={`/news/${featuredArticle.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-pink-300 transition-colors uppercase tracking-wider"
                >
                  <span>READ ARTICLE</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Articles */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {regularArticles.map((article) => (
              <div 
                key={article.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-purple-500/20 p-5 sm:p-6 hover:border-pink-400/50 transition-all duration-300 bg-[#070B14]/85 space-y-3 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-300">
                      {article.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {article.date}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono text-slate-400">
                  <span className="text-[10px]">{article.readTime}</span>
                  <Link
                    href={`/news/${article.slug}`}
                    onClick={() => soundFx.playClick()}
                    className="text-purple-300 hover:text-pink-300 font-bold flex items-center gap-1 transition-colors uppercase text-[10px]"
                  >
                    <span>Read</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
