import { Game, games } from "./content";

export interface GameDetailExtra extends Game {
  tagline: string;
  trailerUrl?: string;
  posterArt: string;
  storyOverview: string;
  gameplayFeatures: {
    title: string;
    description: string;
    iconName: string;
  }[];
  systemRequirements: {
    minimum: {
      os: string;
      cpu: string;
      ram: string;
      gpu: string;
      directx: string;
      storage: string;
    };
    recommended: {
      os: string;
      cpu: string;
      ram: string;
      gpu: string;
      directx: string;
      storage: string;
    };
  };
  characters: {
    name: string;
    role: string;
    description: string;
    faction: string;
  }[];
  gallery: {
    id: string;
    title: string;
    caption: string;
    aspectRatio: "wide" | "square" | "portrait";
  }[];
}

export const gameDetailsMap: Record<string, GameDetailExtra> = {
  "uncharted-drive-beyond": {
    ...games[0],
    tagline: "High-Speed Highway Journeys Across Majestic Mountain Horizons",
    posterArt: "from-[#ea580c] via-[#431407] to-[#070709]",
    storyOverview: "Uncharted Drive: Beyond puts you behind the wheel on endless scenic highways spanning mountainous terrains, coastal ribbons, and golden sunset horizons. Master realistic handling physics, drift across perilous mountain passes, and customize your vehicle fleet.",
    gameplayFeatures: [
      {
        title: "Next-Gen Driving Physics",
        description: "Experience ultra-responsive tire friction, suspension geometry, and real-time aerodynamics across asphalt and mountain passes.",
        iconName: "Zap",
      },
      {
        title: "Dynamic Sunset & Weather Cycles",
        description: "Volumetric atmospheric lighting brings golden sunsets, sudden rain showers, and twilight fog to every highway journey.",
        iconName: "Globe",
      },
      {
        title: "Highway Traffic Simulation",
        description: "Navigate intelligent AI traffic patterns and test your high-speed overtaking precision.",
        iconName: "Activity",
      },
      {
        title: "Cross-Platform Saves",
        description: "Seamlessly progress your car collection across Windows PC and Android devices.",
        iconName: "Cpu",
      },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit / Android 10+",
        cpu: "Intel Core i5-8400 / Snapdragon 720G",
        ram: "8 GB RAM",
        gpu: "NVIDIA GTX 1060 (6GB) / Adreno 618",
        directx: "Version 12 / Vulkan 1.2",
        storage: "2.5 GB available space",
      },
      recommended: {
        os: "Windows 11 64-bit / Android 13+",
        cpu: "Intel Core i7-12700K / Snapdragon 8 Gen 2",
        ram: "16 GB RAM",
        gpu: "NVIDIA RTX 3070 (8GB) / Adreno 740",
        directx: "Version 12 Ultimate / Vulkan 1.3",
        storage: "2.5 GB NVMe SSD space",
      },
    },
    characters: [
      {
        name: "Apex Drift GT",
        role: "Flagship Supercar",
        description: "Twin-turbocharged V8 engineered for sustained high-speed mountain drifting.",
        faction: "Dragon Precision Motors",
      },
      {
        name: "Horizon Cruiser",
        role: "Endurance Grand Tourer",
        description: "Balanced grand tourer built for cross-country sunset highway cruising.",
        faction: "Sunset Dynamics",
      },
    ],
    gallery: [
      {
        id: "udb-1",
        title: "Mountain Highway Sunset",
        caption: "Golden hour driving across coastal ridge passes.",
        aspectRatio: "wide",
      },
      {
        id: "udb-2",
        title: "Cockpit View",
        caption: "High-fidelity digital instrument cluster with active telemetry.",
        aspectRatio: "wide",
      },
    ],
  },
};

export interface CareerPosition {
  id: string;
  title: string;
  department: "Engineering" | "Art & Animation" | "Design" | "Production" | "Audio";
  location: string;
  type: "Full-Time" | "Contract";
  experience: "Senior" | "Lead" | "Mid-Level";
  summary: string;
  responsibilities: string[];
  qualifications: string[];
}

export const careerPositions: CareerPosition[] = [
  {
    id: "senior-vehicle-physics-engineer",
    title: "Senior Vehicle Physics Engineer (C++ / Vulkan)",
    department: "Engineering",
    location: "100% Global Remote",
    type: "Full-Time",
    experience: "Senior",
    summary: "Architect next-generation vehicle dynamics, tire friction simulation, and responsive suspension physics for UNCHARTED DRIVE: BEYOND.",
    responsibilities: [
      "Develop deterministic, high-performance vehicle simulation systems targeting 120+ FPS across PC and mobile.",
      "Fine-tune tire contact patches, aerodynamic drag forces, and high-speed drift stabilization algorithms.",
      "Profile and optimize memory layouts and CPU frame times for cross-platform distribution.",
    ],
    qualifications: [
      "5+ years of professional C++ experience on commercial driving or physics-heavy titles.",
      "Strong foundation in rigid-body physics, linear algebra, 3D vector mathematics, and numerical integration.",
      "Passion for hyper-responsive vehicle controls and realistic handling physics.",
    ],
  },
  {
    id: "lead-technical-artist-shaders",
    title: "Lead Technical Artist (HLSL / Volumetric Shaders)",
    department: "Art & Animation",
    location: "100% Global Remote",
    type: "Full-Time",
    experience: "Lead",
    summary: "Lead the visual fidelity of volumetric highway lighting, golden sunset atmospheres, and asphalt material shaders.",
    responsibilities: [
      "Author custom HLSL shaders for volumetric fog, dynamic sunset reflections, and weather transitions.",
      "Establish GPU performance budgets for textures, LODs, and real-time lighting passes.",
      "Collaborate directly with core rendering engineers on asset pipeline optimization.",
    ],
    qualifications: [
      "6+ years in technical art roles with at least 1 shipped commercial title.",
      "Mastery of HLSL, PBR material workflows, and real-time GPU particle systems.",
      "Experience profiling GPU frame times with RenderDoc, Nsight, or PIX.",
    ],
  },
  {
    id: "senior-network-systems-engineer",
    title: "Senior Network Systems Engineer (Cloud & Telemetry)",
    department: "Engineering",
    location: "100% Global Remote",
    type: "Full-Time",
    experience: "Senior",
    summary: "Build ultra-low latency global leaderboard telemetry, high-throughput cloud save replication, and speedrun verification systems.",
    responsibilities: [
      "Architect resilient edge infrastructure for global time-trial verification and player telemetry.",
      "Optimize packet serialization and secure cloud sync protocols for PC and Android builds.",
      "Implement real-time operative messaging and distributed cluster monitoring.",
    ],
    qualifications: [
      "5+ years engineering high-scale backend or multiplayer infrastructure in TypeScript/C++/Rust.",
      "Deep understanding of distributed consensus, low-latency protocols, and security primitives.",
      "Hands-on experience with PostgreSQL, edge computing, and real-time streaming sockets.",
    ],
  },
  {
    id: "lead-audio-architect",
    title: "Lead Audio Designer & Acoustic Architect",
    department: "Audio",
    location: "100% Global Remote",
    type: "Full-Time",
    experience: "Lead",
    summary: "Design hyper-immersive engine acoustic soundscapes, exhaust resonance, turbo blow-off valves, and dynamic highway haptics.",
    responsibilities: [
      "Record, synthesize, and implement dynamic vehicle engine audio profiles with procedural RPM modulation.",
      "Implement volumetric acoustic propagation, spatial 3D audio, and high-velocity wind resistance audio.",
      "Master dynamic synthwave and cinematic soundtrack transitions based on speed and cornering intensity.",
    ],
    qualifications: [
      "5+ years as a sound designer on shipped commercial titles.",
      "Mastery of Wwise, Reaper, field acoustic recording, and spatial 3D audio technologies.",
      "Strong aesthetic sense for high-octane engine notes, tire screech transients, and atmospheric audio.",
    ],
  },
];

export interface LeadershipMember {
  name: string;
  role: string;
  location: string;
  bio: string;
  avatarColor: string;
  previousStudio: string;
}

export const leadershipTeam: LeadershipMember[] = [
  {
    name: "Studio Founder & Principal Architect",
    role: "Chief Executive Officer & Founder",
    location: "Dragon Global Command",
    bio: "Visionary game technology director pioneering high-performance gaming experiences and realistic vehicle physics.",
    avatarColor: "from-cyan-400 to-blue-600",
    previousStudio: "Dragon Studios Founding Command",
  },
  {
    name: "Dragon Driving Simulation Lead",
    role: "Lead Physics & Vehicle Architect",
    location: "Studio Engine Labs",
    bio: "Architect of volumetric lighting, tire friction dynamics, and realistic highway vehicular simulation.",
    avatarColor: "from-cyan-400 to-purple-600",
    previousStudio: "Dragon Engine Core Labs",
  },
];
