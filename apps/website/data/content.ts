export type Game = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  genre: string;
  status: string;
  year: string;
  description: string;
  fullDescription?: string;
  palette: string;
  accentColor: string;
  glowColor: string;
  platforms: string[];
  tags: string[];
  featured?: boolean;
  heroImage?: string;
};

export const games: Game[] = [
  {
    id: "uncharted-drive-beyond",
    slug: "uncharted-drive-beyond",
    title: "Uncharted Drive: Beyond",
    subtitle: "Next-Gen Open Road Driving Simulation",
    genre: "Open Road Simulation • High-Speed Driving",
    status: "Official Release",
    year: "2026",
    description: "Experience high-speed highway journeys across majestic mountain horizons, golden sunsets, and uncharted asphalt curves.",
    fullDescription: "Uncharted Drive: Beyond brings next-generation vehicle physics and dynamic weather cycles to scenic coastal and mountain highway networks.",
    palette: "from-[#ea580c] via-[#431407] to-[#070709]",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.5)",
    platforms: ["PC (.exe)", "Android (.apk)"],
    tags: ["Driving Simulation", "Open Highway", "Sunset Horizons", "Physics Core"],
    featured: true,
    heroImage: "/images/uncharted-drive-banner.png",
  },
];

export interface StudioPhilosophy {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export const studioStory = {
  eyebrow: "OUR PHILOSOPHY & VISION",
  headline: "Not content. A collision of feelings.",
  lead: "Dragon Studios was founded with a singular directive: to reject generic industrial game loops and forge immersive worlds that stay with players forever.",
  mission: "We combine cutting-edge proprietary technology with uncompromised artistic direction. Every shadow, every soundscape, and every AI behavior is engineered to deliver unforgettable emotional resonance.",
  philosophy: [
    {
      number: "01",
      title: "Technology Serves Emotion",
      subtitle: "Proprietary Game Engine",
      description: "We don't build tech for benchmarks. We build Dragon Engine to unlock cinematic fidelity and game feel impossible on off-the-shelf engines."
    },
    {
      number: "02",
      title: "Player Agency First",
      subtitle: "Dynamic World Systems",
      description: "Linear scripts are past. Our systemic AI and dynamic environments ensure no two players experience the same story twice."
    },
    {
      number: "03",
      title: "Zero Compromise Polish",
      subtitle: "Craftsmanship & Precision",
      description: "From 120 FPS performance targets to spatial audio feedback, perfection is in the finest details."
    }
  ] as StudioPhilosophy[],
  timeline: [
    { year: "2023", title: "The Genesis", description: "Founded by passionate game developers creating original 3D and 2D games." },
    { year: "2024", title: "Dragon Engine Pipeline", description: "Completed proprietary ray tracing shaders and rollback netcode architecture." },
    { year: "2025", title: "Game Suite Revealed", description: "Unveiled first flagship titles Dragon Slayer 3D and Neon Drift to global acclaim." },
    { year: "2026", title: "Cross-Platform Expansion", description: "Scaled production on 3D & 2D titles with dedicated PC .exe & Mobile .apk builds." }
  ]
};

export interface EngineFeature {
  id: string;
  title: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  iconName: string;
  gradient: string;
  glowColor: string;
}

export const engineFeatures: EngineFeature[] = [
  {
    id: "ray-tracing",
    title: "Real-Time Ray Tracing",
    tagline: "Path Tracing & Volumetric Lighting",
    description: "Custom GPU pipeline leveraging temporal upscaling and dynamic global illumination to render cinematic lighting at native 4K 120 FPS.",
    metric: "4K @ 120FPS",
    metricLabel: "Render Target",
    iconName: "Sparkles",
    gradient: "from-dragon-400 via-neon-purple to-dragon-700",
    glowColor: "rgba(168, 85, 247, 0.35)",
  },
  {
    id: "ecs-architecture",
    title: "High-Performance ECS",
    tagline: "Ultra Low Latency Game Core",
    description: "Data-oriented entity component system processing 500,000+ active interactive entities simultaneously with minimal overhead.",
    metric: "500k+",
    metricLabel: "Active Entities",
    iconName: "Cpu",
    gradient: "from-neon-cyan via-dragon-500 to-neon-blue",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  {
    id: "rollback-netcode",
    title: "Low-Latency Netcode",
    tagline: "Instant Global Synchronization",
    description: "Deterministic state synchronization with predictive rollback buffers ensuring tournament-grade hit registration across global servers.",
    metric: "< 1ms",
    metricLabel: "Rollback Window",
    iconName: "Zap",
    gradient: "from-neon-pink via-dragon-600 to-neon-purple",
    glowColor: "rgba(236, 72, 153, 0.35)",
  },
  {
    id: "adaptive-ai",
    title: "Dynamic AI Systems",
    tagline: "Emergent World Ecosystems",
    description: "NPC agents equipped with behavior trees and reinforcement learning that adapt, form squad tactics, and learn from individual player combat patterns.",
    metric: "100%",
    metricLabel: "Unscripted Behavior",
    iconName: "BrainCircuit",
    gradient: "from-amber-400 via-orange-600 to-dragon-800",
    glowColor: "rgba(245, 158, 11, 0.35)",
  },
  {
    id: "destructible-physics",
    title: "Destructible Environments",
    tagline: "Real-Time Structural Physics",
    description: "Stress-strain physical simulation allowing structural deformation, fluid dynamics, and realistic debris calculations in real time.",
    metric: "60Hz",
    metricLabel: "Physics Tick Rate",
    iconName: "Layers",
    gradient: "from-emerald-400 via-teal-600 to-dragon-900",
    glowColor: "rgba(16, 185, 129, 0.35)",
  },
];

export interface StatisticItem {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  accent: string;
}

export const statistics: StatisticItem[] = [
  {
    id: "titles",
    value: 1,
    suffix: " Flagship",
    label: "Flagship Title",
    sublabel: "Uncharted Drive: Beyond (PC & Android)",
    accent: "from-dragon-400 to-neon-cyan",
  },
  {
    id: "fps",
    value: 120,
    suffix: " FPS",
    label: "Performance Standard",
    sublabel: "Native high-refresh rate target",
    accent: "from-neon-purple to-neon-pink",
  },
  {
    id: "engine",
    value: 100,
    suffix: "%",
    label: "Proprietary Tech",
    sublabel: "Custom Dragon 3D & 2D Core Engine",
    accent: "from-neon-blue to-dragon-400",
  },
  {
    id: "latency",
    value: 15,
    prefix: "< ",
    suffix: " ms",
    label: "Target Netcode",
    sublabel: "Real-time low latency networking",
    accent: "from-cyan-400 to-blue-500",
  },
];

export interface NewsItem {
  id: string;
  slug: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  featured?: boolean;
  author: string;
  imageUrl?: string;
}

export const news: NewsItem[] = [
  {
    id: "uncharted-drive-vulkan-release",
    slug: "uncharted-drive-vulkan-release",
    date: "2026",
    tag: "Studio Dispatch",
    title: "Uncharted Drive: Beyond Deployed on Vulkan 3D Core",
    excerpt: "Direct PC (.exe) and Android (.apk) releases featuring deterministic vehicle dynamics, volumetric lighting, and high-performance physics.",
    readTime: "3 min read",
    featured: true,
    author: "Dragon Technical Direction",
  },
  {
    id: "insider-program",
    slug: "insider-program-launch",
    date: "2026",
    tag: "Community",
    title: "The Dragon Studios Global Operative Program is officially open",
    excerpt: "A dedicated hub for playtesters, creators, and driving simulation enthusiasts to access builds and participate in time trials.",
    readTime: "3 min read",
    featured: false,
    author: "Dragon Community Team",
  },
];

export { socialLinks, site, nav, company } from "@/lib/site";
