/**
 * 🐉 DRAGON COLOR ENGINE (PROJECT APEX)
 * Standardized Palette, Hierarchy Tokens & Section Pairings
 *
 * Golden Ratio:
 * - 70% calm dark foundation
 * - 20% atmospheric color
 * - 10% high-energy highlights
 */

export const DRAGON_BASE = {
  midnight: "#02040A",
  graphite: "#050812",
  deepNavy: "#080D18",
  charcoal: "#0C1324",
} as const;

export const DRAGON_ACCENTS = {
  cyan: "#00E5FF",
  electricBlue: "#2979FF",
  violet: "#7C3AED",
  magenta: "#EC4899",
  crimson: "#FF3158",
  amber: "#FFB020",
  emerald: "#10D69A",
} as const;

export interface SectionColorPairing {
  name: string;
  primary: string;
  secondary: string;
  primaryRgba: string;
  secondaryRgba: string;
  glowGradient: string;
  borderAccent: string;
  badgeBg: string;
  badgeText: string;
}

export const SECTION_PAIRINGS: Record<string, SectionColorPairing> = {
  home: {
    name: "home",
    primary: DRAGON_ACCENTS.cyan,
    secondary: DRAGON_ACCENTS.violet,
    primaryRgba: "rgba(0, 229, 255, 0.25)",
    secondaryRgba: "rgba(124, 58, 237, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)",
    borderAccent: "border-cyan-500/30 hover:border-cyan-400",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-300",
  },
  games: {
    name: "games",
    primary: DRAGON_ACCENTS.electricBlue,
    secondary: DRAGON_ACCENTS.cyan,
    primaryRgba: "rgba(41, 121, 255, 0.25)",
    secondaryRgba: "rgba(0, 229, 255, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(41, 121, 255, 0.3) 0%, rgba(0, 229, 255, 0.2) 100%)",
    borderAccent: "border-blue-500/30 hover:border-blue-400",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-300",
  },
  actionRpg: {
    name: "actionRpg",
    primary: DRAGON_ACCENTS.crimson,
    secondary: DRAGON_ACCENTS.amber,
    primaryRgba: "rgba(255, 49, 88, 0.25)",
    secondaryRgba: "rgba(255, 176, 32, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(255, 49, 88, 0.3) 0%, rgba(255, 176, 32, 0.2) 100%)",
    borderAccent: "border-rose-500/30 hover:border-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-300",
  },
  racing: {
    name: "racing",
    primary: DRAGON_ACCENTS.cyan,
    secondary: DRAGON_ACCENTS.electricBlue,
    primaryRgba: "rgba(0, 229, 255, 0.25)",
    secondaryRgba: "rgba(41, 121, 255, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(41, 121, 255, 0.2) 100%)",
    borderAccent: "border-cyan-500/30 hover:border-cyan-400",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-300",
  },
  fantasy: {
    name: "fantasy",
    primary: DRAGON_ACCENTS.violet,
    secondary: DRAGON_ACCENTS.magenta,
    primaryRgba: "rgba(124, 58, 237, 0.25)",
    secondaryRgba: "rgba(236, 72, 153, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)",
    borderAccent: "border-purple-500/30 hover:border-purple-400",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-300",
  },
  download: {
    name: "download",
    primary: DRAGON_ACCENTS.cyan,
    secondary: DRAGON_ACCENTS.emerald,
    primaryRgba: "rgba(0, 229, 255, 0.25)",
    secondaryRgba: "rgba(16, 214, 154, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(16, 214, 154, 0.2) 100%)",
    borderAccent: "border-emerald-500/30 hover:border-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
  },
  success: {
    name: "success",
    primary: DRAGON_ACCENTS.emerald,
    secondary: DRAGON_ACCENTS.cyan,
    primaryRgba: "rgba(16, 214, 154, 0.25)",
    secondaryRgba: "rgba(0, 229, 255, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(16, 214, 154, 0.3) 0%, rgba(0, 229, 255, 0.2) 100%)",
    borderAccent: "border-emerald-500/30 hover:border-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
  },
  warning: {
    name: "warning",
    primary: DRAGON_ACCENTS.amber,
    secondary: DRAGON_ACCENTS.crimson,
    primaryRgba: "rgba(255, 176, 32, 0.25)",
    secondaryRgba: "rgba(255, 49, 88, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(255, 176, 32, 0.3) 0%, rgba(255, 49, 88, 0.2) 100%)",
    borderAccent: "border-amber-500/30 hover:border-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
  },
  error: {
    name: "error",
    primary: DRAGON_ACCENTS.crimson,
    secondary: DRAGON_ACCENTS.magenta,
    primaryRgba: "rgba(255, 49, 88, 0.25)",
    secondaryRgba: "rgba(236, 72, 153, 0.2)",
    glowGradient: "linear-gradient(135deg, rgba(255, 49, 88, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)",
    borderAccent: "border-red-500/30 hover:border-red-400",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-300",
  },
};

export const DragonColorEngine = {
  base: DRAGON_BASE,
  accents: DRAGON_ACCENTS,
  pairings: SECTION_PAIRINGS,
  getSectionTheme(section: keyof typeof SECTION_PAIRINGS): SectionColorPairing {
    return SECTION_PAIRINGS[section] || SECTION_PAIRINGS.home;
  },
};
