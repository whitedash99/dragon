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
  id: "usr-player",
  name: "Dragon Operative",
  username: "operative",
  email: "player@dragonstudios.com",
  avatar: "DO",
  bio: "Official Dragon Operative exploring UNCHARTED DRIVE: BEYOND.",
  level: 1,
  xp: 100,
  nextLevelXp: 1000,
  rank: "Operative",
  joinedDate: "2026",
  location: "Global",
  socials: {},
  stats: {
    gamesOwned: 1,
    hoursPlayed: 0,
    achievementsUnlocked: 0,
    totalAchievements: 10,
    globalRank: "Unranked",
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
    id: "uncharted-drive-beyond",
    slug: "uncharted-drive-beyond",
    title: "UNCHARTED DRIVE: BEYOND",
    genre: "Open Road Driving Simulation",
    palette: "from-amber-500 via-rose-900 to-black",
    hoursPlayed: 0,
    lastPlayed: "Never",
    installed: false,
    installSize: "500 MB",
    status: "Playable",
    achievementsUnlocked: 0,
    totalAchievements: 10,
  },
];

export interface NotificationItem {
  id: string;
  type: "system" | "friend" | "achievement" | "tournament" | "update";
  title: string;
  message: string;
  time?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const userNotifications: NotificationItem[] = [];
