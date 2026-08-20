"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, ChevronRight, Zap, Radio } from "lucide-react";
import { news } from "@/data/content";
import { soundFx } from "@/lib/sound-effects";

export default function LatestNews() {
  const [cmsText, setCmsText] = React.useState({
    eyebrow: "FROM THE FORGE",
    title: "LATEST DISPATCHES & TRANSMISSIONS",
    description: "Official studio updates, patch releases, and community dispatches direct from the engineering core.",
  });

  React.useEffect(() => {
    fetch("/api/cms/blocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blocks)) {
          const map: Record<string, string> = {};
          data.blocks.forEach((b: any) => { map[b.key] = b.content; });
          setCmsText((prev) => ({
            eyebrow: map["news.eyebrow"] || prev.eyebrow,
            title: map["news.title"] || prev.title,
            description: map["news.description"] || prev.description,
          }));
        }
      })
      .catch(() => {});

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
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-[#01040D]"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-10 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[200px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-10 bottom-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[200px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-cyan-500/20 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Radio className="size-3.5 text-cyan-400 animate-pulse" />
              <span data-cms-key="news.eyebrow">{cmsText.eyebrow}</span>
            </div>
            <h2
              id="latest-news-heading"
              data-cms-key="news.title"
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading leading-[0.95]"
            >
              {cmsText.title.includes("DISPATCHES") ? (
                <>LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300">DISPATCHES & TRANSMISSIONS</span></>
              ) : (
                cmsText.title
              )}
            </h2>
            <p data-cms-key="news.description" className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans">
              {cmsText.description}
            </p>
          </div>

          <Link
            href="/news"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-2xl bg-[#040D24] border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/20 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/40"
          >
            <span>ALL DISPATCHES</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Asymmetric News Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative lg:col-span-7 flex flex-col justify-between rounded-3xl border-2 border-cyan-500/30 p-8 sm:p-12 hover:border-cyan-400 transition-all duration-500 overflow-hidden bg-gradient-to-br from-[#040D24] via-[#020718] to-[#01040D] shadow-2xl space-y-8"
          >
            <div 
              aria-hidden="true" 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-900/10 opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-cyan-500/20 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/40">
                  FEATURED
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 border border-white/10">
                  {featuredArticle.tag}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white group-hover:text-cyan-300 transition-colors leading-tight font-heading">
                <Link href={`/news/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-sans">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-cyan-400" />
                  <span>{featuredArticle.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-slate-500" />
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>

              <Link
                href={`/news/${featuredArticle.slug}`}
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 group-hover:text-white transition-colors"
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
                className="group relative flex flex-col justify-between rounded-3xl border border-cyan-500/20 p-6 sm:p-8 hover:border-cyan-400/60 transition-all duration-300 bg-[#03091D]/90 space-y-4 shadow-xl shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                      {article.tag}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {article.date}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{article.readTime}</span>
                  <Link
                    href={`/news/${article.slug}`}
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-1.5 font-bold text-cyan-300 group-hover:text-white transition-colors"
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
