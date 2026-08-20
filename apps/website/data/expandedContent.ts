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
  "embers-of-valyria": {
    ...games[0],
    tagline: "Reclaim the Living Flame in an Unforgiving Sovereign Realm",
    posterArt: "from-[#df5033] via-[#4a1c14] to-[#070709]",
    storyOverview: "Set 300 years after the cataclysmic fracture of Valyria, the land is governed by volatile elemental storms and ancient neural AI guardians known as the Ascendants. Players embody a Flame-Bearer who possesses the rare ability to manipulate kinetic fire and reshape terrain in real time.",
    gameplayFeatures: [
      {
        title: "Dynamic Kinetic Fire Magic",
        description: "Combine fire manipulation with dynamic environment physics to melt structures, vaporize water, and create tactical thermal updrafts.",
        iconName: "Flame",
      },
      {
        title: "Ecosystem Neural AI",
        description: "Enemy factions build dynamic outposts, organize coordinated counter-offensives, and remember previous player combat tactics.",
        iconName: "BrainCircuit",
      },
      {
        title: "Seamless Open World",
        description: "Zero loading screens across 120 square kilometers of hand-crafted wilderness, subterranean vaults, and sky fortresses.",
        iconName: "Globe",
      },
      {
        title: "Tactical Stance Combat",
        description: "Switch between 4 distinct weapon stances on the fly, cancelling animations with precise parries and counter-bursts.",
        iconName: "Shield",
      },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 11 64-bit (Version 22H2+)",
        cpu: "Intel Core i7-12700K or AMD Ryzen 7 5800X",
        ram: "16 GB DDR5 RAM",
        gpu: "NVIDIA GeForce RTX 3070 (8GB) or AMD Radeon RX 6800 XT",
        directx: "DirectX 12 Ultimate (Feature Level 12_2)",
        storage: "110 GB NVMe SSD space required",
      },
      recommended: {
        os: "Windows 11 64-bit (Latest Build)",
        cpu: "Intel Core i9-14900K or AMD Ryzen 9 7950X3D",
        ram: "32 GB DDR5 High-Speed RAM",
        gpu: "NVIDIA GeForce RTX 4080 (16GB) or AMD Radeon RX 7900 XTX",
        directx: "DirectX 12 Ultimate with Path Tracing Acceleration",
        storage: "110 GB High-Speed NVMe Gen4 SSD",
      },
    },
    characters: [
      {
        name: "Kaelen Ember-Marked",
        role: "Protagonist / Flame-Bearer",
        description: "The last surviving warden of the Solstice Vault, capable of channeling primordial thermals.",
        faction: "The Ash Alliance",
      },
      {
        name: "Vespera The Unseen",
        role: "Shadow Vanguard",
        description: "A master of temporal concealment who operates within high-velocity storm zones.",
        faction: "Night-Watch Syndicate",
      },
      {
        name: "Archon Malakor",
        role: "Primary Antagonist",
        description: "Leader of the Iron Order who seeks to absorb the dragon fire to fuel neural automatons.",
        faction: "The Iron Sovereign Order",
      },
    ],
    gallery: [
      { id: "img-1", title: "Solstice Citadel", caption: "Volumetric raytraced sunlight piercing subterranean ruins", aspectRatio: "wide" },
      { id: "img-2", title: "Kinetic Burst Combat", caption: "High-octane sword stance parry during storm events", aspectRatio: "wide" },
      { id: "img-3", title: "Dragon Sentry AI", caption: "Neural AI automated guardian patrolling sky fortresses", aspectRatio: "wide" },
      { id: "img-4", title: "The Ash Wastes", caption: "Dynamic terrain deformation following thermal eruptions", aspectRatio: "wide" },
    ],
  },
  "neon-drift": {
    ...games[1],
    tagline: "Zero-Latency Anti-Gravity Racing at 120 FPS",
    posterArt: "from-[#a8ff35] via-[#154f40] to-[#070709]",
    storyOverview: "Set in the megacity of Neon Bay in 2099. Illegal underground anti-gravity racing leagues have replaced corporate bloodsports. Players customize hyper-threaded hover rigs and compete in high-stakes elimination tournaments where tracks morph dynamically.",
    gameplayFeatures: [
      {
        title: "120 FPS Anti-Grav Physics",
        description: "Ultra-responsive vehicle controls targeting native 120Hz display refresh rates with zero input lag.",
        iconName: "Zap",
      },
      {
        title: "Morphing Cyber Tracks",
        description: "Track segments rotate, invert gravity, and collapse dynamically based on race leader momentum.",
        iconName: "Activity",
      },
      {
        title: "Low-Latency Netcode Multiplayer",
        description: "Experience 16-player simultaneous competitive races with zero position desynchronization.",
        iconName: "Cpu",
      },
      {
        title: "Modular Vehicle Tuning",
        description: "Over 500 individual performance parts: ion thrusters, pulse batteries, kinetic brakes, and neon skins.",
        iconName: "Sparkles",
      },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i5-12400F or AMD Ryzen 5 5600X",
        ram: "16 GB DDR4 RAM",
        gpu: "NVIDIA GeForce RTX 3060 (12GB) or AMD Radeon RX 6700 XT",
        directx: "DirectX 12",
        storage: "65 GB NVMe SSD space",
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i7-13700K or AMD Ryzen 7 7800X3D",
        ram: "32 GB DDR5 RAM",
        gpu: "NVIDIA GeForce RTX 4070 Ti (12GB) or AMD Radeon RX 7900 XT",
        directx: "DirectX 12 Ultimate",
        storage: "65 GB NVMe Gen4 SSD",
      },
    },
    characters: [
      {
        name: "Cipher 'Zero' Kai",
        role: "Lead Drift Specialist",
        description: "Former corporate test pilot turned rogue underground racing champion.",
        faction: "Overdrive Syndicate",
      },
      {
        name: "Nyx Vandal",
        role: "Systems Specialist",
        description: "Specializes in modifying pulse batteries and bypassing orbital speed limiters.",
        faction: "Neon Outlaws",
      },
    ],
    gallery: [
      { id: "nd-1", title: "Cyber-Track Overdrive", caption: "High-speed drift under synthetic aurora borealis", aspectRatio: "wide" },
      { id: "nd-2", title: "Neon Bay Metropolis", caption: "Multi-level vertical highway track loop", aspectRatio: "wide" },
      { id: "nd-3", title: "Vehicle Customization", caption: "Deep vehicle tuning and pulse engine customizer", aspectRatio: "wide" },
    ],
  },
  "blacksite-zero": {
    ...games[2],
    tagline: "Volumetric Extraction Shooter Built for Hardcore Co-op Squads",
    posterArt: "from-[#708090] via-[#1f2937] to-[#070709]",
    storyOverview: "An abandoned sub-oceanic research station has gone dark after an anomalous breach. Squads of specialized contractors are deployed into contaminated zones to retrieve classified neural data drives before automated sterilization bombs detonate.",
    gameplayFeatures: [
      {
        title: "Structural Volumetric Breach",
        description: "Destroy walls, blow out pressurized airlocks, and create dynamic sightlines in real time.",
        iconName: "Layers",
      },
      {
        title: "Acoustic & Thermal Stealth",
        description: "Sound propagates realistically through metal corridors. Enemies react to footsteps, breathing, and weapon heat.",
        iconName: "Shield",
      },
      {
        title: "Dynamic High-Risk Extraction",
        description: "Randomized extraction points that require tactical defense while bio-hazards flood the map.",
        iconName: "Flame",
      },
      {
        title: "Hardcore Ballistics",
        description: "Realistic bullet ricochet, body armor penetration physics, and manual magazine repacking.",
        iconName: "Activity",
      },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i7-11700K or AMD Ryzen 7 3800X",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce RTX 3060 Ti or AMD Radeon RX 6700",
        directx: "DirectX 12",
        storage: "85 GB NVMe SSD",
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i7-14700K or AMD Ryzen 7 7800X3D",
        ram: "32 GB DDR5 RAM",
        gpu: "NVIDIA GeForce RTX 4080 or AMD Radeon RX 7900 XTX",
        directx: "DirectX 12 Ultimate",
        storage: "85 GB High-Speed NVMe SSD",
      },
    },
    characters: [
      {
        name: "Commander Vance",
        role: "Squad Leader / Breach Specialist",
        description: "Veteran operative specializing in heavy ordinance and pressurized breach defense.",
        faction: "Apex Vanguard",
      },
      {
        name: "Doc 'Solder' Reyes",
        role: "Combat Medic / Signal Jammer",
        description: "Controls automated medical drones and thermal suppression fields.",
        faction: "Apex Vanguard",
      },
    ],
    gallery: [
      { id: "bz-1", title: "Airlock Breach Sequence", caption: "Volumetric explosion creating emergency depressurization", aspectRatio: "wide" },
      { id: "bz-2", title: "Contamination Zone", caption: "Thermal imaging tactics inside sub-oceanic laboratories", aspectRatio: "wide" },
      { id: "bz-3", title: "Extraction Helicopter", caption: "High-stakes squad extraction under heavy enemy mortar fire", aspectRatio: "wide" },
    ],
  },
  "chronos-protocol": {
    ...games[3],
    tagline: "Dual-Timeline Temporal Combat Puzzle Action",
    posterArt: "from-[#8b5cf6] via-[#2e1065] to-[#070709]",
    storyOverview: "A temporal accident has fractured an orbital research station into two co-existing time periods (2045 and 2145). Players seamlessly jump between past and future states to overcome security locks, bypass traps, and outmaneuver future combat drones.",
    gameplayFeatures: [
      {
        title: "Simultaneous Timeline Shift",
        description: "Instantly toggle between past and future versions of the environment with zero latency.",
        iconName: "Sparkles",
      },
      {
        title: "Causal Paradox Puzzles",
        description: "Plant explosives or modify structures in the past to immediately destroy future obstacles.",
        iconName: "BrainCircuit",
      },
      {
        title: "Temporal Echo Combat",
        description: "Record a sequence of actions in timeline A, then fight alongside your past ghost in timeline B.",
        iconName: "Cpu",
      },
      {
        title: "Zero-G Temporal Physics",
        description: "Debris and projectiles freeze in localized stasis fields that can be redirected toward targets.",
        iconName: "Globe",
      },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i7-12700K or AMD Ryzen 7 5800X",
        ram: "16 GB DDR5",
        gpu: "NVIDIA GeForce RTX 3070 or AMD Radeon RX 6800",
        directx: "DirectX 12 Ultimate",
        storage: "75 GB NVMe SSD",
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i9-13900K or AMD Ryzen 9 7900X",
        ram: "32 GB DDR5",
        gpu: "NVIDIA GeForce RTX 4080 or AMD Radeon RX 7900 XT",
        directx: "DirectX 12 Ultimate",
        storage: "75 GB NVMe SSD",
      },
    },
    characters: [
      {
        name: "Dr. Maya Lin",
        role: "Temporal Physicist",
        description: "Inventor of the Chronos Core who must prevent the collapse of the temporal continuum.",
        faction: "Chronos Initiative",
      },
    ],
    gallery: [
      { id: "cp-1", title: "Timeline Shift Visualizer", caption: "Instantaneous shift between pristine 2045 vault and ruined 2145 deck", aspectRatio: "wide" },
      { id: "cp-2", title: "Temporal Stasis Combat", caption: "Freezing laser fire in mid-air to use as dynamic cover", aspectRatio: "wide" },
    ],
  },
};

export interface CareerPosition {
  id: string;
  title: string;
  department: "Engineering" | "Art & Animation" | "Design" | "Production" | "Audio";
  location: "Bengaluru (Hybrid)" | "Montreal (Remote)" | "London (Hybrid)";
  type: "Full-Time" | "Contract";
  experience: "Senior" | "Lead" | "Mid-Level";
  summary: string;
  responsibilities: string[];
  qualifications: string[];
}

export const careerPositions: CareerPosition[] = [
  {
    id: "senior-gameplay-engineer",
    title: "Senior Gameplay Engineer (C++ / ECS)",
    department: "Engineering",
    location: "Bengaluru (Hybrid)",
    type: "Full-Time",
    experience: "Senior",
    summary: "Architect core player combat mechanics, camera systems, and responsive movement physics for Embers of Valyria using Dragon Engine.",
    responsibilities: [
      "Develop high-performance C++20 gameplay systems targeting zero garbage collection allocations.",
      "Work closely with game designers to iterate on fluid animation blending, parry mechanics, and AI interactions.",
      "Profile and optimize memory usage and CPU frame times to maintain 120 FPS targets.",
    ],
    qualifications: [
      "5+ years of professional C++ or C# experience on shipped PC or mobile titles.",
      "Strong foundation in linear algebra, 3D math, physics, and data-oriented design (ECS).",
      "Demonstrated passion for action combat responsiveness and tight game feel.",
    ],
  },
  {
    id: "lead-technical-artist-shaders",
    title: "Lead Technical Artist (HLSL / Shaders / VFX)",
    department: "Art & Animation",
    location: "Montreal (Remote)",
    type: "Full-Time",
    experience: "Lead",
    summary: "Lead the visual fidelity of volumetric weather, kinetic fire magic, and real-time path tracing shaders in Dragon Engine.",
    responsibilities: [
      "Author custom HLSL shaders for volumetric fog, dynamic fire propagation, and terrain deformation.",
      "Establish art performance budgets for textures, polycounts, and dynamic lighting passes.",
      "Mentor technical artists and bridge communication between core rendering engineers and environment artists.",
    ],
    qualifications: [
      "7+ years in technical art roles with at least 1 shipped game title in a Senior/Lead capacity.",
      "Mastery of HLSL, PBR material workflows, and real-time GPU particle systems.",
      "Experience profiling GPU frames using RenderDoc, Nsight, or PIX.",
    ],
  },
  {
    id: "senior-network-engineer-rollback",
    title: "Senior Network Engineer (Rollback Netcode)",
    department: "Engineering",
    location: "Bengaluru (Hybrid)",
    type: "Full-Time",
    experience: "Senior",
    summary: "Develop rollback netcode architecture for high-velocity multiplayer games Cyber Drift 3D and Dragon Slayer.",
    responsibilities: [
      "Architect deterministic state serialization and fast snapshot rollback buffers in C++.",
      "Optimize UDP packet compression, client prediction, and lag compensation systems.",
      "Implement server mesh scaling infrastructure supporting multi-region low latency match servers.",
    ],
    qualifications: [
      "5+ years engineering network architecture for competitive multiplayer or fighting games.",
      "Deep understanding of sockets, serialization, bandwidth optimization, and anti-cheat primitives.",
      "Hands-on experience with GGPO, custom rollback netcode, or lockstep lock-free queues.",
    ],
  },
  {
    id: "principal-level-designer",
    title: "Principal Open-World Level Designer",
    department: "Design",
    location: "London (Hybrid)",
    type: "Full-Time",
    experience: "Lead",
    summary: "Craft memorable open-world regions, dungeons, and systemic combat arenas for our flagship action RPG titles.",
    responsibilities: [
      "Design and greybox large-scale open world terrain, vertical fortresses, and tactical encounter zones.",
      "Collaborate with narrative leads to integrate lore, environmental storytelling, and dynamic quests.",
      "Iterate on player sightlines, traversal rhythms, and surprise encounter density.",
    ],
    qualifications: [
      "6+ years designing levels for 3D open-world or action-adventure games.",
      "Expertise in spatial pacing, landmark composition, and systemic combat design.",
      "Strong portfolio demonstrating playable level layouts from initial blockout to final shipping polish.",
    ],
  },
  {
    id: "senior-audio-director-vfx",
    title: "Senior Audio Designer & Sound Architect",
    department: "Audio",
    location: "Montreal (Remote)",
    type: "Full-Time",
    experience: "Senior",
    summary: "Design hyper-immersive acoustic soundscapes, procedural weapon audio, and dynamic haptic feedback for Dragon Engine.",
    responsibilities: [
      "Record, synthesize, and implement dynamic audio assets in Wwise / FMOD integrated with custom C++ engine hooks.",
      "Implement volumetric acoustic propagation, HRTF 3D audio, and dynamic environmental reverb filters.",
      "Mix dynamic interactive soundtracks that adapt to combat intensity and player health states.",
    ],
    qualifications: [
      "5+ years as a sound designer on shipped commercial games.",
      "Mastery of Wwise, Reaper, field recording, and spatial 3D audio technologies (Dolby Atmos, Tempest 3D).",
      "Strong aesthetic sense for heavy punchy impacts, sci-fi synth textures, and natural acoustics.",
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
    name: "Vikram R. Sharma",
    role: "Chief Executive Officer & Founder",
    location: "Bengaluru Campus",
    bio: "Visionary game technology director. Founded Dragon Studios to pioneer uncompromised game development in India.",
    avatarColor: "from-dragon-400 to-neon-purple",
    previousStudio: "Dragon Studios Founding Architect",
  },
  {
    name: "Elena Rostova",
    role: "Studio Creative Director",
    location: "London Hub",
    bio: "Lead World Designer behind iconic open-world RPG franchises. Oversees narrative direction, universe world-building, and character lore.",
    avatarColor: "from-neon-cyan to-dragon-500",
    previousStudio: "Dragon Studios Creative Division",
  },
  {
    name: "Dr. Marcus Vance",
    role: "Chief Technology Officer (Dragon Engine)",
    location: "Montreal Hub",
    bio: "PhD in Parallel GPU Computing. Architect of Dragon Engine's temporal upscaling, high-performance ECS, and low-latency netcode.",
    avatarColor: "from-neon-pink to-dragon-600",
    previousStudio: "Dragon Engine Core Labs",
  },
  {
    name: "Ananya Deshmukh",
    role: "Head of Operations & Culture",
    location: "Bengaluru Campus",
    bio: "Pioneered human-centric studio operations, zero-crunch policies, and global talent acquisition across 3 continents.",
    avatarColor: "from-amber-400 to-orange-600",
    previousStudio: "Dragon Studios Global Operations",
  },
];
