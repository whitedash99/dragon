import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";

const people = [
  { name: "Aarya Shah", role: "Creative Director", initials: "AS", tint: "from-[#a32931] via-[#311016] to-[#0b0b0d]" },
  { name: "Nikhil Rao", role: "Studio Lead", initials: "NR", tint: "from-[#b76a20] via-[#2e1b14] to-[#0b0b0d]" },
  { name: "Maya Fernandes", role: "Art Director", initials: "MF", tint: "from-[#6a347b] via-[#1e142b] to-[#0b0b0d]" },
  { name: "Dev Patel", role: "Technical Director", initials: "DP", tint: "from-[#1c5b7b] via-[#101d31] to-[#0b0b0d]" },
  { name: "Rhea Singh", role: "Community Lead", initials: "RS", tint: "from-[#276853] via-[#11231e] to-[#0b0b0d]" },
];

export const metadata = { title: "The Dragon Crew" };

export default function Team() {
  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />
      <main id="main-content" className="cinematic-page min-h-screen overflow-x-hidden pb-32 pt-28">
        <section className="container-site relative pb-16 pt-12 lg:pb-24 lg:pt-16">
          <p className="cinematic-eyebrow">The people behind the worlds</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.66fr] lg:items-end"><div><h1 className="font-heading text-5xl font-black uppercase leading-[0.82] tracking-[-0.055em] text-white sm:text-7xl lg:text-[7rem]">Meet the <span className="text-gradient">dragon</span> crew.</h1></div><p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:pb-2 sm:text-lg">A multidisciplinary collective of storytellers, technologists, artists, and game makers with one shared standard: worlds worth remembering.</p></div>
        </section>

        <section className="container-site"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((person, index) => <article key={person.name} className="group content-panel min-h-[25rem] p-6 sm:p-7"><div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${person.tint}`} /><div aria-hidden="true" className="absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/75">0{index + 1} / Leadership</span><Sparkles className="size-4 text-gold-400" /></div><div><div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/25 font-heading text-2xl font-black tracking-tight text-white shadow-2xl">{person.initials}</div><h2 className="mt-8 font-heading text-4xl font-black uppercase leading-none tracking-[-0.04em] text-white">{person.name}</h2><p className="mt-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.15em] text-gold-400">{person.role}</p></div></div></article>)}
          <article className="group relative flex min-h-[25rem] flex-col justify-between overflow-hidden rounded-2xl border border-dragon-400/25 bg-dragon-500/10 p-6 sm:p-7"><div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,182,73,0.24),transparent_28%),linear-gradient(145deg,rgba(215,51,49,0.3),rgba(13,12,15,0.8))]" /><div className="relative flex items-center justify-between"><span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-400">Your chapter</span><ArrowUpRight className="size-5 text-gold-400" /></div><div className="relative"><h2 className="font-heading text-5xl font-black uppercase leading-[0.84] tracking-[-0.05em] text-white">Build worlds<br />with us.</h2><p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">The next name on this wall could be yours. Explore the positions shaping what comes next.</p><Button variant="glow" size="sm" className="mt-7" asChild><Link href="/careers"><BriefcaseBusiness className="size-3.5" /> Open roles</Link></Button></div></article>
        </div></section>
      </main>
      <Footer />
    </SceneBackground>
  );
}
