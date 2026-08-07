export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  category: "General" | "Embers of Valyria" | "Neon Drift" | "Blacksite Zero" | "Chronos Protocol" | "Engine Dev";
  author: {
    name: string;
    avatar: string;
    role: "Developer" | "Creator" | "Moderator" | "Insiders Elite";
  };
  excerpt: string;
  repliesCount: number;
  likesCount: number;
  viewsCount: number;
  timestamp: string;
  pinned?: boolean;
}

export const forumThreads: ForumThread[] = [
  {
    id: "th-1",
    slug: "dragon-engine-rollback-netcode-deep-dive",
    title: "Dragon Engine Netcode: How Rollback Netcode Works Under the Hood",
    category: "Engine Dev",
    author: {
      name: "Dr. Marcus Vance",
      avatar: "MV",
      role: "Developer",
    },
    excerpt: "A detailed breakdown of deterministic state serialization and packet compression techniques we built for Blacksite Zero and Neon Drift.",
    repliesCount: 142,
    likesCount: 580,
    viewsCount: 18400,
    timestamp: "2 hours ago",
    pinned: true,
  },
  {
    id: "th-2",
    slug: "embers-of-valyria-stance-parry-frame-data",
    title: "Embers of Valyria: Stance Parry Frame Data & Thermal Cancellation Guide",
    category: "Embers of Valyria",
    author: {
      name: "Kaelen Voss",
      avatar: "KV",
      role: "Insiders Elite",
    },
    excerpt: "Analyzing the 4-frame parry window for Solstice Archon encounters. Frame-by-frame breakdown of kinetic fire animation cancels.",
    repliesCount: 89,
    likesCount: 310,
    viewsCount: 9200,
    timestamp: "5 hours ago",
    pinned: true,
  },
  {
    id: "th-3",
    slug: "neon-drift-cybertrack-meta-builds",
    title: "Neon Drift: Overdrive — Meta Pulse Battery & Ion Thruster Builds v1.4",
    category: "Neon Drift",
    author: {
      name: "ValkyrieStream",
      avatar: "VS",
      role: "Creator",
    },
    excerpt: "Top 3 vehicle loadouts for exceeding 450 km/h on morphing tracks without overheating ion batteries.",
    repliesCount: 64,
    likesCount: 245,
    viewsCount: 7100,
    timestamp: "Yesterday",
  },
];

export interface VerifiedReview {
  id: string;
  gameSlug: string;
  gameTitle: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    playtimeHours: number;
  };
  rating: number; // out of 5
  headline: string;
  content: string;
  pros: string[];
  cons: string[];
  helpfulCount: number;
  timestamp: string;
  developerReply?: {
    author: string;
    message: string;
    date: string;
  };
}

export const verifiedReviews: VerifiedReview[] = [
  {
    id: "rev-1",
    gameSlug: "embers-of-valyria",
    gameTitle: "Embers of Valyria",
    author: {
      name: "Aarav 'Sentinel' Mehta",
      avatar: "AM",
      verified: true,
      playtimeHours: 184,
    },
    rating: 5,
    headline: "The most fluid ARPG combat engine I've played in a decade.",
    content: "The real-time neural AI ecosystem is unscripted magic. Enemy squads actually flanked my stance parries and adapted to my thermal fire attacks. Absolutely breathtaking photorealism on RTX 4080.",
    pros: ["Unscripted Neural AI", "Sub-ms Frame Pacing", "Gorgeous Raytraced Lighting"],
    cons: ["High System Requirements"],
    helpfulCount: 428,
    timestamp: "Jul 26, 2026",
    developerReply: {
      author: "Elena Rostova (Creative Director)",
      message: "Thank you Aarav! We engineered the Solstice Archon AI specifically to reward stance parry mastery.",
      date: "Jul 27, 2026",
    },
  },
  {
    id: "rev-2",
    gameSlug: "neon-drift",
    gameTitle: "Neon Drift: Overdrive",
    author: {
      name: "CyberRacer_99",
      avatar: "CR",
      verified: true,
      playtimeHours: 92,
    },
    rating: 5,
    headline: "Pure arcade adrenaline at native 120 FPS.",
    content: "Morphing tracks and zero input latency make this a masterpiece for competitive racers. The track inversion gravity shifts feel surreal.",
    pros: ["120 FPS Locked", "Zero Input Latency", "Synthwave Soundtrack"],
    cons: ["Steep Learning Curve"],
    helpfulCount: 215,
    timestamp: "Jul 20, 2026",
  },
];

export interface CommunityEvent {
  id: string;
  title: string;
  type: "Tournament" | "Dev Livestream" | "Alpha Playtest";
  date: string;
  countdownText: string;
  registeredPlayers: string;
  prizePool?: string;
  streamUrl?: string;
  description: string;
}

export const communityEvents: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "Neon Drift World Championship 2026",
    type: "Tournament",
    date: "Aug 15, 2026",
    countdownText: "15 Days Left",
    registeredPlayers: "2,048 Racers",
    prizePool: "$50,000 GTD",
    description: "16-player bracket anti-gravity elimination tournament live from our Bengaluru Tech Campus studio stage.",
  },
  {
    id: "evt-2",
    title: "Dragon Engine Architecture Deep Dive",
    type: "Dev Livestream",
    date: "Aug 05, 2026",
    countdownText: "5 Days Left",
    registeredPlayers: "12,400 RSVP",
    streamUrl: "https://twitch.tv/dragonstudios",
    description: "Join CTO Dr. Marcus Vance as he unveils next-gen temporal upscaling & dynamic water physics.",
  },
];

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  platform: "Twitch" | "YouTube";
  followers: string;
  verified: boolean;
  topGame: string;
  bio: string;
}

export const creatorsList: CreatorProfile[] = [
  {
    id: "cr-1",
    name: "Valkyrie Stream",
    handle: "@valkyrie_live",
    platform: "Twitch",
    followers: "420K",
    verified: true,
    topGame: "Neon Drift: Overdrive",
    bio: "Hardcore ARPG speedrunner & competitive anti-gravity racer. Streaming Dragon Studios alpha builds daily.",
  },
  {
    id: "cr-2",
    name: "Tactical Zenith",
    handle: "@tactical_zenith",
    platform: "YouTube",
    followers: "650K",
    verified: true,
    topGame: "Blacksite Zero",
    bio: "Extraction shooter strategist breaking down weapon ballistics, acoustic echo tactics, and breach mechanics.",
  },
];
