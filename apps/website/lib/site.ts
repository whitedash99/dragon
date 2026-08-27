export const OFFICIAL_SOCIALS = {
  whatsapp: {
    label: "WhatsApp Channel",
    name: "Dragon Studios Official",
    href: "https://www.whatsapp.com/channel/0029Vb8zJ8w96H4YmYUqh201",
    handle: "Dragon Studios Official Channel",
    status: "OFFICIAL BROADCAST",
  },
  threads: {
    label: "Threads",
    name: "Threads Official",
    href: "https://www.threads.com/@_dragongamingstudio.official_",
    handle: "@_dragongamingstudio.official_",
    status: "OFFICIAL FEED",
  },
  instagram: {
    label: "Instagram",
    name: "Instagram Official",
    href: "https://www.instagram.com/_dragongamingstudio.official_?igsh=ZDJsM3E1aWsxMWNs",
    handle: "@_dragongamingstudio.official_",
    status: "VERIFIED",
  },
  youtube: {
    label: "YouTube",
    name: "Dragon Gaming Studio",
    href: "https://www.youtube.com/@DRAGONGAMINGSTUDIO12",
    handle: "@DRAGONGAMINGSTUDIO12",
    status: "OFFICIAL CHANNEL",
  },
  x: {
    label: "X (Twitter)",
    name: "DGStudio",
    href: "https://x.com/DGStudio1212",
    handle: "@DGStudio1212",
    status: "OFFICIAL DISPATCHES",
  },
  discord: {
    label: "Discord",
    name: "Dragon Discord Community",
    href: "https://discord.gg/23nyUsPG5",
    handle: "discord.gg/23nyUsPG5",
    status: "OFFICIAL DISCORD",
  },
  reflexRush: {
    label: "Reflex Rush",
    name: "Reflex Rush Live Game",
    href: "https://reflexrush-dragongamingstudio.netlify.app/",
    handle: "Play Reflex Rush Live",
    status: "OFFICIAL GAME",
  },
  reddit: {
    label: "Reddit",
    name: "Dragon Gaming Studio",
    href: "https://www.reddit.com/user/DragonGamingStudio/",
    handle: "u/DragonGamingStudio",
    status: "OFFICIAL COMMUNITY",
  },
} as const;

export const siteConfig = {
  name: "Dragon Studios",
  shortName: "Dragon",
  description:
    "Independent Game Development Studio creating immersive 3D & 2D worlds powered by Dragon Engine.",
  url: "https://dragongamingstudios.vercel.app",
  ogImage: "/images/og.jpg",
  creator: "Dragon Studios",
  keywords: [
    "Dragon Studios",
    "Game Studio",
    "3D Games",
    "2D Games",
    "Dragon Slayer 3D",
    "Cyber Drift 3D",
    "Shadow Ninja 2D",
    "Dragon Engine",
    "Game Development",
  ],
  email: "hello@dragonstudios.com",
  supportEmail: "support@dragonstudios.com",
  founded: 2023,
  location: "Global Remote",
  mission:
    "To create breathtaking interactive experiences that transport players to worlds beyond imagination.",
  sameAs: [
    OFFICIAL_SOCIALS.whatsapp.href,
    OFFICIAL_SOCIALS.threads.href,
    OFFICIAL_SOCIALS.instagram.href,
    OFFICIAL_SOCIALS.youtube.href,
    OFFICIAL_SOCIALS.x.href,
    OFFICIAL_SOCIALS.reddit.href,
  ],
  nav: [
    { label: "Games", href: "/games" },
    { label: "Studio", href: "/studio" },
    { label: "News", href: "/news" },
    { label: "Careers", href: "/careers" },
    { label: "Community", href: "/community" },
  ],
  socialLinks: [
    OFFICIAL_SOCIALS.whatsapp,
    OFFICIAL_SOCIALS.threads,
    OFFICIAL_SOCIALS.instagram,
    OFFICIAL_SOCIALS.youtube,
    OFFICIAL_SOCIALS.x,
    OFFICIAL_SOCIALS.reddit,
  ],
} as const;

export const { nav, socialLinks } = siteConfig;
export const site = siteConfig;
export const company = {
  name: siteConfig.name,
  founded: siteConfig.founded,
  location: siteConfig.location,
  mission: siteConfig.mission,
  email: siteConfig.email,
  supportEmail: siteConfig.supportEmail,
} as const;
