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
    id: "embers-of-valyria",
    slug: "embers-of-valyria",
    title: "Embers of Valyria",
    subtitle: "A living flame in a shattered realm",
    genre: "Open-World Action RPG",
    status: "Coming 2027",
    year: "2027",
    description: "A fallen kingdom. A living flame. Write the legend nobody else can in an unyielding open world driven by dynamic AI systems.",
    fullDescription: "Embers of Valyria combines high-octane fluid combat with dynamic world simulation powered by Dragon Engine. Every in-game event reshapes the political landscape and environment in real time.",
    palette: "from-[#df5033] via-[#361914] to-[#070709]",
    accentColor: "#df5033",
    glowColor: "rgba(223, 80, 51, 0.4)",
    platforms: ["PC", "PS5", "Xbox Series X"],
    tags: ["Open World", "Dynamic AI", "Ray Tracing"],
    featured: true,
  },
  {
    id: "neon-drift",
    slug: "neon-drift",
    title: "Neon Drift: Overdrive",
    subtitle: "Outrun the sunrise",
    genre: "Arcade Cyberpunk Racer",
    status: "In Development",
    year: "2026",
    description: "Outrun the sunrise in a hyper-stylized metropolis that never stops moving. High-velocity drift physics meet synthwave aesthetics.",
    fullDescription: "Built for low-latency multiplayer and 120 FPS high-refresh rate displays, Neon Drift features customizable anti-gravity vehicles and dynamic track mutation.",
    palette: "from-[#a8ff35] via-[#154f40] to-[#070709]",
    accentColor: "#a8ff35",
    glowColor: "rgba(168, 255, 53, 0.4)",
    platforms: ["PC", "PS5", "Xbox Series X", "Steam Deck"],
    tags: ["Competitive", "120 FPS", "Customization"],
    featured: true,
  },
  {
    id: "blacksite-zero",
    slug: "blacksite-zero",
    title: "Blacksite Zero",
    subtitle: "No signal. No backup.",
    genre: "Tactical Co-op Extraction Shooter",
    status: "In Development",
    year: "2026",
    description: "No signal. No backup. Tactical squad combat where every acoustic echo and environmental breach alters survival probability.",
    fullDescription: "Featuring low-latency rollback netcode and dynamic environment destruction. Coordinate breaches, manage thermal signatures, and extract before orbital fallout.",
    palette: "from-[#708090] via-[#1f2937] to-[#070709]",
    accentColor: "#abb4ca",
    glowColor: "rgba(171, 180, 202, 0.4)",
    platforms: ["PC", "PS5", "Xbox Series X"],
    tags: ["Squad Co-op", "Destructible Environments", "Hardcore"],
    featured: true,
  },
  {
    id: "chronos-protocol",
    slug: "chronos-protocol",
    title: "Chronos Protocol",
    subtitle: "Master temporal mechanics",
    genre: "Sci-Fi Time-Manipulation Action",
    status: "Pre-Production",
    year: "2028",
    description: "Manipulate past and future timelines simultaneously to solve impossible tactical combat puzzles in zero-gravity orbital stations.",
    fullDescription: "Experience dual-timeline rendering where actions performed in alternate temporal streams immediately ripple across the main battleground.",
    palette: "from-[#8b5cf6] via-[#2e1065] to-[#070709]",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    platforms: ["PC", "Next-Gen Console"],
    tags: ["Time Travel", "Physics Engine", "Single Player"],
    featured: false,
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
    { year: "2023", title: "The Genesis", description: "Founded by industry veterans from top AAA studios in Bengaluru & worldwide." },
    { year: "2024", title: "Dragon Engine", description: "Completed proprietary ray tracing pipeline and rollback netcode architecture." },
    { year: "2025", title: "Embers Revealed", description: "Unveiled first flagship title Embers of Valyria to global acclaim." },
    { year: "2026", title: "Multi-Studio Expansion", description: "Scaled engine capabilities and initiated production on 3 simultaneous AAA titles." }
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
    id: "players",
    value: 15,
    suffix: "M+",
    label: "Global Players",
    sublabel: "Across pre-registrations & early access",
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
    id: "countries",
    value: 180,
    suffix: "+",
    label: "Countries Reached",
    sublabel: "Global gaming community footprint",
    accent: "from-neon-blue to-dragon-400",
  },
  {
    id: "awards",
    value: 28,
    suffix: "",
    label: "Industry Awards",
    sublabel: "For technical & artistic excellence",
    accent: "from-amber-400 to-orange-500",
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
    id: "bengaluru-chapter",
    slug: "bengaluru-new-chapter",
    date: "Jun 18, 2026",
    tag: "Studio News",
    title: "Dragon Studios opens state-of-the-art campus in Bengaluru",
    excerpt: "Expanding our motion capture facilities and high-performance compute clusters to accelerate production on Embers of Valyria and Neon Drift.",
    readTime: "4 min read",
    featured: true,
    author: "Dragon Studios Editorial",
  },
  {
    id: "valyria-dev-deep-dive",
    slug: "valyria-ai-deep-dive",
    date: "May 02, 2026",
    tag: "Embers of Valyria",
    title: "Deep Dive: How Dynamic AI shapes the world of Valyria",
    excerpt: "Inside our world design where dynamic weather, faction territories, and enemy tactics adapt continuously without pre-baked scripts.",
    readTime: "6 min read",
    featured: false,
    author: "Tech Director Team",
  },
  {
    id: "insider-program",
    slug: "insider-program-launch",
    date: "Apr 14, 2026",
    tag: "Community",
    title: "The Dragon Studios Insider Program is officially open",
    excerpt: "A dedicated hub for playtesters, creators, and hardcore gamers to get exclusive early builds, developer Q&A, and shape upcoming features.",
    readTime: "3 min read",
    featured: false,
    author: "Community Team",
  },
];

export { socialLinks, site, nav, company } from "@/lib/site";
