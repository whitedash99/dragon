import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: string }) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
      <div>
        <p className="cinematic-eyebrow">{eyebrow}</p>
        <h2 className="mt-6 max-w-3xl whitespace-pre-line font-heading text-4xl font-black uppercase leading-[0.86] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      <div className="flex max-w-sm flex-col gap-4">
        {copy && (
          <p className="text-sm leading-relaxed text-muted-foreground">{copy}</p>
        )}
        {action && (
          <button className="group flex items-center gap-2 self-start font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold-400 transition-colors hover:text-white">
            {action}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
