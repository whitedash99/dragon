export type GamePaletteName = 
  | "electric-blue" 
  | "cyan" 
  | "violet" 
  | "purple" 
  | "magenta" 
  | "pink" 
  | "crimson" 
  | "red" 
  | "orange" 
  | "amber" 
  | "gold" 
  | "yellow" 
  | "emerald" 
  | "lime" 
  | "turquoise";

export interface GameVisualTheme {
  name: GamePaletteName;
  primary: string;
  secondary: string;
  highlight: string;
  gradient: string;
  glow: string;
  surface: string;
  textContrast: string;
  mood: string;
  motionIntensity: "low" | "medium" | "high";
  gradientText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorderHover: string;
  cardGlowHover: string;
  heroBackdropGradient: string;
  buttonGradient: string;
}

export const GAME_PALETTES: Record<GamePaletteName, GameVisualTheme> = {
  "electric-blue": {
    name: "electric-blue",
    primary: "#3B82F6",
    secondary: "#1D4ED8",
    highlight: "#60A5FA",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    glow: "rgba(59, 130, 246, 0.4)",
    surface: "rgba(10, 20, 45, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Cybernetic High-Tech",
    motionIntensity: "medium",
    gradientText: "from-blue-400 via-blue-200 to-white",
    badgeBg: "bg-blue-950/70",
    badgeBorder: "border-blue-500/40",
    badgeText: "text-blue-300",
    cardBorderHover: "hover:border-blue-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]",
    heroBackdropGradient: "from-blue-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
  },
  "cyan": {
    name: "cyan",
    primary: "#00F0FF",
    secondary: "#0284C7",
    highlight: "#67E8F9",
    gradient: "linear-gradient(135deg, #00F0FF 0%, #0284C7 100%)",
    glow: "rgba(0, 240, 255, 0.45)",
    surface: "rgba(6, 24, 38, 0.85)",
    textContrast: "#FFFFFF",
    mood: "High-Speed Precision",
    motionIntensity: "high",
    gradientText: "from-cyan-400 via-teal-200 to-white",
    badgeBg: "bg-cyan-950/70",
    badgeBorder: "border-cyan-500/40",
    badgeText: "text-cyan-300",
    cardBorderHover: "hover:border-cyan-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]",
    heroBackdropGradient: "from-cyan-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
  },
  "violet": {
    name: "violet",
    primary: "#8B5CF6",
    secondary: "#6D28D9",
    highlight: "#C4B5FD",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    glow: "rgba(139, 92, 246, 0.4)",
    surface: "rgba(22, 14, 45, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Astral Fantasy",
    motionIntensity: "medium",
    gradientText: "from-violet-400 via-purple-200 to-white",
    badgeBg: "bg-violet-950/70",
    badgeBorder: "border-violet-500/40",
    badgeText: "text-violet-300",
    cardBorderHover: "hover:border-violet-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]",
    heroBackdropGradient: "from-violet-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
  },
  "purple": {
    name: "purple",
    primary: "#A855F7",
    secondary: "#7E22CE",
    highlight: "#D8B4FE",
    gradient: "linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)",
    glow: "rgba(168, 85, 247, 0.4)",
    surface: "rgba(25, 12, 45, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Dark Magic & Mystery",
    motionIntensity: "medium",
    gradientText: "from-purple-400 via-violet-200 to-white",
    badgeBg: "bg-purple-950/70",
    badgeBorder: "border-purple-500/40",
    badgeText: "text-purple-300",
    cardBorderHover: "hover:border-purple-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]",
    heroBackdropGradient: "from-purple-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500",
  },
  "magenta": {
    name: "magenta",
    primary: "#EC4899",
    secondary: "#BE185D",
    highlight: "#F472B6",
    gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
    glow: "rgba(236, 72, 153, 0.4)",
    surface: "rgba(40, 10, 28, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Futuristic Adrenaline",
    motionIntensity: "high",
    gradientText: "from-pink-400 via-rose-200 to-white",
    badgeBg: "bg-pink-950/70",
    badgeBorder: "border-pink-500/40",
    badgeText: "text-pink-300",
    cardBorderHover: "hover:border-pink-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]",
    heroBackdropGradient: "from-pink-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500",
  },
  "pink": {
    name: "pink",
    primary: "#F43F5E",
    secondary: "#BE123C",
    highlight: "#FDA4AF",
    gradient: "linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)",
    glow: "rgba(244, 63, 94, 0.4)",
    surface: "rgba(38, 8, 20, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Vibrant Energy",
    motionIntensity: "high",
    gradientText: "from-rose-400 via-pink-200 to-white",
    badgeBg: "bg-rose-950/70",
    badgeBorder: "border-rose-500/40",
    badgeText: "text-rose-300",
    cardBorderHover: "hover:border-rose-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]",
    heroBackdropGradient: "from-rose-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500",
  },
  "crimson": {
    name: "crimson",
    primary: "#EF4444",
    secondary: "#B91C1C",
    highlight: "#FCA5A5",
    gradient: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
    glow: "rgba(239, 68, 68, 0.45)",
    surface: "rgba(42, 10, 10, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Mythical Inferno",
    motionIntensity: "medium",
    gradientText: "from-red-400 via-rose-200 to-white",
    badgeBg: "bg-red-950/70",
    badgeBorder: "border-red-500/40",
    badgeText: "text-red-300",
    cardBorderHover: "hover:border-red-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]",
    heroBackdropGradient: "from-red-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500",
  },
  "red": {
    name: "red",
    primary: "#DC2626",
    secondary: "#991B1B",
    highlight: "#F87171",
    gradient: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
    glow: "rgba(220, 38, 38, 0.45)",
    surface: "rgba(35, 8, 8, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Combat & Boss Battles",
    motionIntensity: "high",
    gradientText: "from-red-500 via-orange-300 to-white",
    badgeBg: "bg-red-950/80",
    badgeBorder: "border-red-600/50",
    badgeText: "text-red-300",
    cardBorderHover: "hover:border-red-600/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]",
    heroBackdropGradient: "from-red-950/80 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500",
  },
  "orange": {
    name: "orange",
    primary: "#F97316",
    secondary: "#C2410C",
    highlight: "#FDBA74",
    gradient: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
    glow: "rgba(249, 115, 22, 0.45)",
    surface: "rgba(38, 16, 6, 0.85)",
    textContrast: "#FFFFFF",
    mood: "High-Octane Driving",
    motionIntensity: "medium",
    gradientText: "from-orange-400 via-amber-200 to-white",
    badgeBg: "bg-orange-950/70",
    badgeBorder: "border-orange-500/40",
    badgeText: "text-orange-300",
    cardBorderHover: "hover:border-orange-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]",
    heroBackdropGradient: "from-orange-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500",
  },
  "amber": {
    name: "amber",
    primary: "#F59E0B",
    secondary: "#D97706",
    highlight: "#FCD34D",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    glow: "rgba(245, 158, 11, 0.45)",
    surface: "rgba(36, 22, 6, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Adventure & Desert Suns",
    motionIntensity: "medium",
    gradientText: "from-amber-400 via-yellow-200 to-white",
    badgeBg: "bg-amber-950/70",
    badgeBorder: "border-amber-500/40",
    badgeText: "text-amber-300",
    cardBorderHover: "hover:border-amber-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    heroBackdropGradient: "from-amber-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500",
  },
  "gold": {
    name: "gold",
    primary: "#EAB308",
    secondary: "#CA8A04",
    highlight: "#FEF08A",
    gradient: "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
    glow: "rgba(234, 179, 8, 0.45)",
    surface: "rgba(35, 26, 6, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Studio Flagship Masterwork",
    motionIntensity: "medium",
    gradientText: "from-yellow-400 via-amber-200 to-white",
    badgeBg: "bg-yellow-950/70",
    badgeBorder: "border-yellow-500/40",
    badgeText: "text-yellow-300",
    cardBorderHover: "hover:border-yellow-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(234,179,8,0.35)]",
    heroBackdropGradient: "from-yellow-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500",
  },
  "yellow": {
    name: "yellow",
    primary: "#FACC15",
    secondary: "#EAB308",
    highlight: "#FEF9C3",
    gradient: "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)",
    glow: "rgba(250, 204, 21, 0.45)",
    surface: "rgba(38, 30, 8, 0.85)",
    textContrast: "#000000",
    mood: "Electrifying Neon",
    motionIntensity: "high",
    gradientText: "from-yellow-300 via-amber-100 to-white",
    badgeBg: "bg-yellow-950/70",
    badgeBorder: "border-yellow-400/40",
    badgeText: "text-yellow-300",
    cardBorderHover: "hover:border-yellow-400/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(250,204,21,0.35)]",
    heroBackdropGradient: "from-yellow-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400",
  },
  "emerald": {
    name: "emerald",
    primary: "#10B981",
    secondary: "#047857",
    highlight: "#6EE7B7",
    gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    glow: "rgba(16, 185, 129, 0.4)",
    surface: "rgba(8, 32, 22, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Survival & Ancient Nature",
    motionIntensity: "low",
    gradientText: "from-emerald-400 via-teal-200 to-white",
    badgeBg: "bg-emerald-950/70",
    badgeBorder: "border-emerald-500/40",
    badgeText: "text-emerald-300",
    cardBorderHover: "hover:border-emerald-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    heroBackdropGradient: "from-emerald-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
  },
  "lime": {
    name: "lime",
    primary: "#84CC16",
    secondary: "#4D7C0F",
    highlight: "#BEF264",
    gradient: "linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)",
    glow: "rgba(132, 204, 22, 0.4)",
    surface: "rgba(20, 32, 8, 0.85)",
    textContrast: "#000000",
    mood: "High-Energy Arcade",
    motionIntensity: "high",
    gradientText: "from-lime-400 via-emerald-200 to-white",
    badgeBg: "bg-lime-950/70",
    badgeBorder: "border-lime-500/40",
    badgeText: "text-lime-300",
    cardBorderHover: "hover:border-lime-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(132,204,22,0.35)]",
    heroBackdropGradient: "from-lime-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-lime-500 to-emerald-600 text-black hover:from-lime-400 hover:to-emerald-500",
  },
  "turquoise": {
    name: "turquoise",
    primary: "#14B8A6",
    secondary: "#0F766E",
    highlight: "#5EEAD4",
    gradient: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)",
    glow: "rgba(20, 184, 166, 0.4)",
    surface: "rgba(8, 28, 28, 0.85)",
    textContrast: "#FFFFFF",
    mood: "Deep Oceanic Exploration",
    motionIntensity: "medium",
    gradientText: "from-teal-400 via-cyan-200 to-white",
    badgeBg: "bg-teal-950/70",
    badgeBorder: "border-teal-500/40",
    badgeText: "text-teal-300",
    cardBorderHover: "hover:border-teal-500/60",
    cardGlowHover: "hover:shadow-[0_0_30px_rgba(20,184,166,0.35)]",
    heroBackdropGradient: "from-teal-950/70 via-slate-950/90 to-[#01040D]",
    buttonGradient: "from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500",
  },
};

/**
 * Dynamically resolves the visual theme for any game based on genre, title, or explicit tag.
 */
export function getGameVisualTheme(genre?: string, title?: string): GameVisualTheme {
  const g = (genre || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (g.includes("racing") || g.includes("driving") || t.includes("drive") || t.includes("uncharted")) {
    return GAME_PALETTES["orange"];
  }
  if (g.includes("arcade") || g.includes("runner") || t.includes("reflex") || g.includes("speed")) {
    return GAME_PALETTES["cyan"];
  }
  if (g.includes("action") || g.includes("rpg") || t.includes("slayer") || t.includes("dragon")) {
    return GAME_PALETTES["crimson"];
  }
  if (g.includes("sci-fi") || g.includes("cyber") || g.includes("drift") || t.includes("neon")) {
    return GAME_PALETTES["electric-blue"];
  }
  if (g.includes("fantasy") || g.includes("magic") || g.includes("shadow")) {
    return GAME_PALETTES["violet"];
  }
  if (g.includes("survival") || g.includes("tactical") || g.includes("stealth")) {
    return GAME_PALETTES["emerald"];
  }
  if (g.includes("ocean") || g.includes("water") || g.includes("deep")) {
    return GAME_PALETTES["turquoise"];
  }
  if (g.includes("flagship") || g.includes("premium") || g.includes("valyria")) {
    return GAME_PALETTES["gold"];
  }

  return GAME_PALETTES["cyan"];
}
