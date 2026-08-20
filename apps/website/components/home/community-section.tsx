import { ArrowUpRight, Instagram, Youtube, MessageSquare } from "lucide-react";
import { socialLinks } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon, XIcon } from "@/components/ui/social-icons";

export function CommunitySection() {
  return (
    <section className="bg-[var(--ink)] py-20 text-white sm:py-28">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-cyan-400">The Dragon Community</p>
            <h2 className="display mt-3 text-5xl sm:text-7xl font-black uppercase">
              Join the Realm.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/65">
            Behind-the-scenes engineering, game reveals, developer logs, and official player transmissions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((social) => {
            const getIcon = (label: string) => {
              if (label.includes("WhatsApp")) return <WhatsAppIcon className="size-8 text-emerald-400" />;
              if (label.includes("Threads")) return <ThreadsIcon className="size-8 text-cyan-400" />;
              if (label.includes("Instagram")) return <Instagram className="size-8 text-pink-400" />;
              if (label.includes("YouTube")) return <Youtube className="size-8 text-red-400" />;
              if (label.includes("X")) return <XIcon className="size-8 text-white" />;
              return <MessageSquare className="size-8 text-orange-400" />;
            };

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-3xl border border-white/20 p-6 transition-all hover:-translate-y-1 hover:border-cyan-400 hover:bg-white hover:text-[var(--ink)] shadow-xl"
              >
                <div className="flex items-start justify-between">
                  {getIcon(social.label)}
                  <ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <h3 className="display mt-10 text-3xl font-black uppercase">{social.label}</h3>
                <p className="mt-2 text-xs opacity-65 font-mono">{social.handle}</p>
                <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 group-hover:text-black">
                  Follow Dragon →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
