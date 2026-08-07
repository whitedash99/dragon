import { ArrowUpRight, Instagram, Youtube, Twitter } from "lucide-react";
import { socialLinks } from "@/lib/site";

const icons = [Instagram, Youtube, Twitter];

export function CommunitySection() {
  return <section className="bg-[var(--ink)] py-20 text-white sm:py-28">
    <div className="container">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="eyebrow text-[var(--lime)]">The Dragon community</p><h2 className="display mt-3 text-6xl sm:text-8xl">Join the<br/>party.</h2></div>
        <p className="max-w-sm text-sm leading-6 text-white/65">Behind-the-scenes work, game reveals, community moments and the occasional bit of chaos.</p>
      </div>
      <div className="mt-10 grid gap-3 lg:grid-cols-3">
        {socialLinks.map((social, index) => { const Icon = icons[index]; return <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="group rounded-3xl border border-white/20 p-6 transition hover:-translate-y-1 hover:border-[var(--lime)] hover:bg-white hover:text-[var(--ink)]"><div className="flex items-start justify-between"><Icon size={30} /><ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="display mt-16 text-5xl">{social.label}</h3><p className="mt-2 text-sm opacity-65">{social.handle}</p><span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest">Follow Dragon</span></a> })}
      </div>
    </div>
  </section>
}
