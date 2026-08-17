import Link from "next/link";
import { ArrowUpRight, Clock3, Newspaper, Radio } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { news as fallbackNews } from "@/data/content";

export const metadata = { title: "Newsroom | Dragon Studios" };

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  featured?: boolean;
  slug: string;
}

export default async function News() {
  let articles: NewsArticle[] = [];
  try {
    const dbArticles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbArticles.length > 0) {
      articles = dbArticles.map((a: any) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        tag: a.tag,
        date: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: "4 min read",
        featured: a.featured,
        slug: a.slug,
      }));
    }
  } catch (e: unknown) {
    console.error("Error fetching articles from Prisma", e);
  }

  if (articles.length === 0) {
    articles = fallbackNews;
  }

  const featured = articles.find((item) => item.featured) ?? articles[0];
  const dispatches = articles.filter((item) => item.id !== featured.id);

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <main id="main-content" className="cinematic-page min-h-screen overflow-x-hidden pb-32 pt-28">
        <section className="container-site relative pb-16 pt-12 lg:pb-24 lg:pt-16">
          <div className="max-w-3xl">
            <p className="cinematic-eyebrow">Official newsroom</p>
            <h1 className="mt-6 font-heading text-5xl font-black uppercase leading-[0.82] tracking-[-0.055em] text-white sm:text-7xl lg:text-[7rem]">
              From the <span className="text-gradient">forge.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dispatches from the artists, engineers, and world-builders behind Dragon Studios. New worlds deserve a record of how they came to life.
            </p>
          </div>
        </section>

        <section className="container-site relative">
          <article className="content-panel frame-corners grid overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-72 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(241,93,58,0.72),transparent_16%),radial-gradient(circle_at_78%_62%,rgba(91,50,168,0.52),transparent_38%),linear-gradient(135deg,#250d0f,#09090b_72%)] p-7 sm:p-10 lg:min-h-[30rem]">
              <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.8)_48%,transparent_50%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">Featured dispatch</span>
                  <Radio className="size-5 text-gold-400" />
                </div>
                <p className="font-heading text-7xl font-black uppercase leading-none tracking-[-0.09em] text-white/15 sm:text-9xl">DS</p>
              </div>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-mono font-bold uppercase tracking-[0.15em] text-gold-400">
                  <span>{featured.tag}</span><span className="h-1 w-1 rounded-full bg-gold-400" /><span>{featured.date}</span>
                </div>
                <h2 className="mt-5 font-heading text-4xl font-black uppercase leading-[0.9] tracking-[-0.045em] text-white sm:text-5xl">{featured.title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{featured.excerpt}</p>
              </div>
              <div className="mt-9 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5 text-dragon-300" /> {featured.readTime}</span>
                <Button variant="outline" size="sm" className="gap-2" asChild><Link href="/press">Read dispatch <ArrowUpRight className="size-3.5" /></Link></Button>
              </div>
            </div>
          </article>
        </section>

        <section className="container-site mt-20 lg:mt-28">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="cinematic-eyebrow">Field notes</p><h2 className="mt-4 font-heading text-4xl font-black uppercase tracking-[-0.045em] text-white sm:text-5xl">Latest intelligence</h2></div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{articles.length.toString().padStart(2, "0")} transmissions</span>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {dispatches.map((item, index) => (
              <article key={item.id} className="group grid gap-5 py-8 transition-colors hover:bg-white/[0.025] sm:grid-cols-[5rem_1fr_auto] sm:items-start sm:px-5">
                <span className="font-mono text-sm font-bold text-dragon-300">0{index + 2}</span>
                <div><p className="text-[0.68rem] font-mono font-bold uppercase tracking-[0.16em] text-gold-400">{item.tag} <span className="ml-2 text-muted-foreground">/ {item.date}</span></p><h3 className="mt-3 font-heading text-3xl font-bold uppercase tracking-[-0.035em] text-white transition-colors group-hover:text-dragon-200 sm:text-4xl">{item.title}</h3><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p></div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground sm:flex-col sm:items-end"><span>{item.readTime}</span><ArrowUpRight className="size-5 text-white/40 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-400" /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="container-site mt-20 lg:mt-28"><div className="content-panel flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10"><div><p className="cinematic-eyebrow">Press desk</p><h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-[-0.04em] text-white">Need the official record?</h2></div><Button variant="glow" size="lg" className="gap-2" asChild><Link href="/press"><Newspaper className="size-4" /> Press resources</Link></Button></div></section>
      </main>
      <Footer />
    </SceneBackground>
  );
}
