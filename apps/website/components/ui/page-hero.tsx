export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="cinematic-page relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      {/* Ambient glow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(ellipse_48%_52%_at_75%_0%,rgba(150,40,25,0.16),transparent_72%)]" 
      />
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(ellipse_30%_40%_at_10%_80%,rgba(80,12,48,0.08),transparent_70%)]" 
      />

      <div className="container-site relative">
        <p className="cinematic-eyebrow">{eyebrow}</p>
        <h1 className="mt-8 max-w-5xl whitespace-pre-line font-heading text-5xl font-black uppercase leading-[0.82] tracking-[-0.055em] text-white sm:text-7xl lg:text-[7rem]">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {copy}
        </p>
      </div>
    </section>
  );
}
