export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  joinedDate: string;
  location: string;
  socials: {
    discord?: string;
    steam?: string;
    twitter?: string;
    twitch?: string;
  };
  stats: {
    gamesOwned: number;
    hoursPlayed: number;
    achievementsUnlocked: number;
    totalAchievements: number;
    globalRank: string;
  };
}

export const currentUser: UserProfile = {
  id: "usr-4092",
  name: "Kaelen Voss",
  username: "kaelen_voss",
  email: "kaelen.voss@dragonstudios.gg",
  avatar: "KV",
  bio: "Hardcore ARPG combat specialist & Dragon Engine Insider. Competing in Neon Drift leagues and exploring Valyria.",
  level: 42,
  xp: 14850,
  nextLevelXp: 18000,
  rank: "Founder",
  joinedDate: "October 2024",
  location: "Bengaluru, India",
  socials: {
    discord: "KaelenVoss#4092",
    steam: "kaelen_voss_official",
    twitter: "@kaelen_voss",
    twitch: "kaelen_voss_live",
  },
  stats: {
    gamesOwned: 4,
    hoursPlayed: 348,
    achievementsUnlocked: 84,
    totalAchievements: 120,
    globalRank: "#1,420 Global",
  },
};

export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  genre: string;
  palette: string;
  hoursPlayed: number;
  lastPlayed: string;
  installed: boolean;
  installSize: string;
  downloadProgress?: number;
  downloadSpeed?: string;
  status: "Playable" | "Downloading" | "Pre-Loaded" | "Update Required";
  achievementsUnlocked: number;
  totalAchievements: number;
}

export const userLibrary: LibraryItem[] = [
  {
    id: "embers-of-valyria",
    slug: "embers-of-valyria",
    title: "Embers of Valyria",
    genre: "Open-World Action RPG",
    palette: "from-[#df5033] via-[#361914] to-[#070709]",
    hoursPlayed: 184,
    lastPlayed: "2 hours ago",
    installed: true,
    installSize: "110 GB",
    status: "Playable",
    achievementsUnlocked: 38,
    totalAchievements: 50,
  },
  {
    id: "neon-drift",
    slug: "neon-drift",
    title: "Neon Drift: Overdrive",
    genre: "Arcade Cyberpunk Racer",
    palette: "from-[#a8ff35] via-[#154f40] to-[#070709]",
    hoursPlayed: 92,
    lastPlayed: "Yesterday",
    installed: true,
    installSize: "65 GB",
    status: "Playable",
    achievementsUnlocked: 28,
    totalAchievements: 35,
  },
  {
    id: "blacksite-zero",
    slug: "blacksite-zero",
    title: "Blacksite Zero",
    genre: "Tactical Extraction Shooter",
    palette: "from-[#708090] via-[#1f2937] to-[#070709]",
    hoursPlayed: 72,
    lastPlayed: "3 days ago",
    installed: false,
    installSize: "85 GB",
    downloadProgress: 68,
    downloadSpeed: "84.5 MB/s",
    status: "Downloading",
    achievementsUnlocked: 18,
    totalAchievements: 35,
  },
  {
    id: "chronos-protocol",
    slug: "chronos-protocol",
    title: "Chronos Protocol",
    genre: "Sci-Fi Time Action",
    palette: "from-[#8b5cf6] via-[#2e1065] to-[#070709]",
    hoursPlayed: 0,
    lastPlayed: "Pre-Ordered",
    installed: false,
    installSize: "75 GB",
    status: "Pre-Loaded",
    achievementsUnlocked: 0,
    totalAchievements: 30,
  },
];

export interface AchievementItem {
  id: string;
  gameTitle: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: string;
  icon: string;
}

export const userAchievements: AchievementItem[] = [
  {
    id: "ach-1",
    gameTitle: "Embers of Valyria",
    title: "Primordial Ignition",
    description: "Defeat the Solstice Archon without taking elemental fire damage.",
    unlocked: true,
    unlockedAt: "Jul 28, 2026",
    rarity: "4.2% (Ultra Rare)",
    icon: "Flame",
  },
  {
    id: "ach-2",
    gameTitle: "Neon Drift",
    title: "Overdrive Velocity",
    description: "Sustain max boost speed above 450 km/h for 30 consecutive seconds.",
    unlocked: true,
    unlockedAt: "Jul 24, 2026",
    rarity: "8.5% (Rare)",
    icon: "Zap",
  },
  {
    id: "ach-3",
    gameTitle: "Blacksite Zero",
    title: "Sub-Zero Extraction",
    description: "Extract classified neural drive with 0 squad casualties.",
    unlocked: true,
    unlockedAt: "Jul 15, 2026",
    rarity: "12.1% (Uncommon)",
    icon: "ShieldCheck",
  },
  {
    id: "ach-4",
    gameTitle: "Embers of Valyria",
    title: "Master of Stances",
    description: "Execute 100 frame-perfect stance parries.",
    unlocked: false,
    rarity: "2.1% (Legendary)",
    icon: "Sparkles",
  },
];

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "system" | "game" | "reward" | "social";
}

export const userNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Alpha Build Update Available",
    message: "Neon Drift v1.4 Patch notes: 120 FPS high-refresh rate physics optimizations applied.",
    time: "10 mins ago",
    read: false,
    type: "game",
  },
  {
    id: "notif-2",
    title: "Dragon Studios Badge Earned!",
    message: "You unlocked the 'Alpha Playtester' badge for reporting 5 verified engine metrics logs.",
    time: "2 hours ago",
    read: false,
    type: "reward",
  },
  {
    id: "notif-3",
    title: "Security Alert: New Sign-In",
    message: "New sign-in detected from Windows 11 Chrome in Bengaluru, India.",
    time: "Yesterday",
    read: true,
    type: "system",
  },
];
