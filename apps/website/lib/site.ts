export const OFFICIAL_SOCIALS = {
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/_dragongamingstudio.official_?igsh=ZDJsM3E1aWsxMWNs",
    handle: "@_dragongamingstudio.official_",
    followers: "450K+",
  },
  youtube: {
    label: "YouTube",
    href: "https://www.youtube.com/@DRAGONGAMINGSTUDIO12",
    handle: "@DRAGONGAMINGSTUDIO12",
    subscribers: "1.2M",
  },
  x: {
    label: "X (Twitter)",
    href: "https://x.com/DGStudio1212",
    handle: "@DGStudio1212",
    followers: "890K+",
  },
  reddit: {
    label: "Reddit",
    href: "https://www.reddit.com/user/DragonGamingStudio/?share_id=HI1UG4-JJAj7wvkIIiFHt&utm_content=1&utm_medium=android_app&utm_name=androidcss&utm_source=share&utm_term=1/",
    handle: "u/DragonGamingStudio",
    members: "250K+",
  },
} as const;

export const siteConfig = {
  name: "Dragon Studios",
  shortName: "Dragon",
  description:
    "Premier AAA Game Development Studio creating immersive worlds powered by Dragon Engine.",
  url: "https://dragonstudios.com",
  ogImage: "/images/og.jpg",
  creator: "Dragon Studios",
  keywords: [
    "Dragon Studios",
    "Game Studio",
    "AAA Games",
    "Dragon Engine",
    "Embers of Valyria",
    "Neon Drift",
    "Blacksite Zero",
    "Game Development",
  ],
  email: "hello@dragonstudios.com",
  supportEmail: "support@dragonstudios.com",
  founded: 2023,
  location: "Bengaluru, India",
  mission:
    "To create breathtaking interactive experiences that transport players to worlds beyond imagination.",
  sameAs: [
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
