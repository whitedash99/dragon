import Link from "next/link";
import { Instagram, Youtube, MessageSquare, ArrowUpRight } from "lucide-react";
import { nav, site, socialLinks } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";

export function SiteFooter() {
  const getIcon = (label: string) => {
    if (label.includes("WhatsApp")) return <WhatsAppIcon className="size-4" />;
    if (label.includes("Threads")) return <ThreadsIcon className="size-4" />;
    if (label.includes("Instagram")) return <Instagram className="size-4" />;
    if (label.includes("YouTube")) return <Youtube className="size-4" />;
    if (label.includes("X")) return <XIcon className="size-4" />;
    return <MessageSquare className="size-4" />;
  };

  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="container py-14">
        <div className="flex flex-col justify-between gap-10 border-b border-white/20 pb-12 md:flex-row">
          <div>
            <p className="eyebrow text-[var(--lime)]">Ready when you are</p>
            <h2 className="display mt-3 max-w-xl text-6xl sm:text-8xl">
              Make your<br />mark.
            </h2>
          </div>
          <Link
            href="/contact"
            className="group flex h-fit items-center gap-3 rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--ink)]"
          >
            Start a conversation{" "}
            <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
        <div className="grid gap-10 py-10 sm:grid-cols-3">
          <div>
            <p className="text-xl font-black tracking-[-.06em]">DRAGON/STUDIOS</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
              Independent games with impossible ambition.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {nav.map((x) => (
              <Link
                className="text-sm text-white/70 hover:text-[var(--lime)]"
                href={x.href}
                key={x.href}
              >
                {x.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="eyebrow text-white/50">Follow the signal</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  aria-label={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--lime)] hover:text-[var(--lime)] transition-all"
                  key={social.label}
                >
                  {getIcon(social.label)}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 block text-sm text-[var(--lime)]"
            >
              {site.email}
            </a>
          </div>
        </div>
        <p className="border-t border-white/20 pt-6 text-xs text-white/50">
          © 2026 Dragon Gaming Studio™. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
