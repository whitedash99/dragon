export interface AdminGameItem {
  id: string;
  slug: string;
  title: string;
  genre: string;
  status: "Published" | "In Development" | "Pre-Production" | "Archived";
  releaseYear: string;
  platforms: string[];
  totalPlayers: string;
  revenue: string;
  updatedAt: string;
}

export const adminGamesList: AdminGameItem[] = [
  {
    id: "g-1",
    slug: "embers-of-valyria",
    title: "Embers of Valyria",
    genre: "Open-World Action RPG",
    status: "In Development",
    releaseYear: "2027",
    platforms: ["PC", "PS5", "Xbox Series X"],
    totalPlayers: "8.4M Pre-Reg",
    revenue: "$12.4M Pre-Order",
    updatedAt: "2 hours ago",
  },
  {
    id: "g-2",
    slug: "neon-drift",
    title: "Neon Drift: Overdrive",
    genre: "Arcade Cyberpunk Racer",
    status: "In Development",
    releaseYear: "2026",
    platforms: ["PC", "PS5", "Xbox Series X", "SteamDeck"],
    totalPlayers: "4.2M Pre-Reg",
    revenue: "$5.8M Pre-Order",
    updatedAt: "1 day ago",
  },
  {
    id: "g-3",
    slug: "blacksite-zero",
    title: "Blacksite Zero",
    genre: "Tactical Extraction Shooter",
    status: "In Development",
    releaseYear: "2026",
    platforms: ["PC", "PS5", "Xbox Series X"],
    totalPlayers: "2.8M Alpha Access",
    revenue: "$4.1M Founders",
    updatedAt: "3 days ago",
  },
  {
    id: "g-4",
    slug: "chronos-protocol",
    title: "Chronos Protocol",
    genre: "Sci-Fi Time Action",
    status: "Pre-Production",
    releaseYear: "2028",
    platforms: ["PC", "Next-Gen"],
    totalPlayers: "850k Wishlisted",
    revenue: "$1.2M Reserved",
    updatedAt: "1 week ago",
  },
];

export interface AdminNewsItem {
  id: string;
  slug: string;
  title: string;
  category: "Studio News" | "Deep Dive" | "Community" | "Release Note";
  status: "Published" | "Draft" | "Scheduled";
  author: string;
  views: number;
  date: string;
}

export const adminNewsList: AdminNewsItem[] = [
  {
    id: "news-1",
    slug: "bengaluru-new-chapter",
    title: "Dragon Studios opens state-of-the-art tech campus in Bengaluru",
    category: "Studio News",
    status: "Published",
    author: "Vikram R. Sharma",
    views: 48250,
    date: "Jun 18, 2026",
  },
  {
    id: "news-2",
    slug: "valyria-ai-deep-dive",
    title: "Deep Dive: How Neural AI shapes the ecosystem of Valyria",
    category: "Deep Dive",
    status: "Published",
    author: "Elena Rostova",
    views: 89400,
    date: "May 02, 2026",
  },
  {
    id: "news-3",
    slug: "dragon-studios-community-launch",
    title: "The Dragon Studios Insider Program is officially open",
    category: "Community",
    status: "Published",
    author: "Community Ops",
    views: 62100,
    date: "Apr 14, 2026",
  },
  {
    id: "news-4",
    slug: "dragon-engine-patch",
    title: "Dragon Engine Architecture Release Notes",
    category: "Release Note",
    status: "Draft",
    author: "Dr. Marcus Vance",
    views: 0,
    date: "Draft",
  },
];

export interface MediaAsset {
  id: string;
  name: string;
  type: "Image" | "Video" | "Document";
  folder: "Banners" | "Screenshots" | "Logos" | "Trailers";
  size: string;
  resolution?: string;
  uploadedAt: string;
  url: string;
}

export const adminMediaList: MediaAsset[] = [
  {
    id: "med-1",
    name: "valyria_hero_render_4k.png",
    type: "Image",
    folder: "Banners",
    size: "14.2 MB",
    resolution: "3840 x 2160",
    uploadedAt: "Jul 28, 2026",
    url: "/images/og.jpg",
  },
  {
    id: "med-2",
    name: "neon_drift_cybertrack_trailer.mp4",
    type: "Video",
    folder: "Trailers",
    size: "420.5 MB",
    resolution: "3840 x 2160 @ 60fps",
    uploadedAt: "Jul 24, 2026",
    url: "/videos/neon_drift.mp4",
  },
  {
    id: "med-3",
    name: "dragon_studios_master_logo_vector.svg",
    type: "Image",
    folder: "Logos",
    size: "245 KB",
    uploadedAt: "Jul 10, 2026",
    url: "/logo.svg",
  },
  {
    id: "med-4",
    name: "blacksite_airlock_breach_screen.png",
    type: "Image",
    folder: "Screenshots",
    size: "8.6 MB",
    resolution: "3840 x 2160",
    uploadedAt: "Jul 05, 2026",
    url: "/images/blacksite.jpg",
  },
];

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Developer" | "Designer" | "Content Editor" | "Marketing" | "Moderator";
  status: "Active" | "Suspended" | "Pending";
  joinedDate: string;
  lastActive: string;
  ip: string;
}

export const adminUsersList: AdminUserItem[] = [
  {
    id: "u-1",
    name: "Vikram R. Sharma",
    email: "vikram@dragonstudios.com",
    role: "Administrator",
    status: "Active",
    joinedDate: "Jan 2023",
    lastActive: "Just now",
    ip: "182.73.120.45",
  },
  {
    id: "u-2",
    name: "Elena Rostova",
    email: "elena.r@dragonstudios.com",
    role: "Designer",
    status: "Active",
    joinedDate: "Mar 2023",
    lastActive: "15 mins ago",
    ip: "86.142.90.12",
  },
  {
    id: "u-3",
    name: "Dr. Marcus Vance",
    email: "marcus.v@dragonstudios.com",
    role: "Developer",
    status: "Active",
    joinedDate: "Feb 2023",
    lastActive: "1 hour ago",
    ip: "198.16.42.88",
  },
  {
    id: "u-4",
    name: "Ananya Deshmukh",
    email: "ananya.d@dragonstudios.com",
    role: "Content Editor",
    status: "Active",
    joinedDate: "May 2023",
    lastActive: "3 hours ago",
    ip: "182.73.120.46",
  },
  {
    id: "u-5",
    name: "Marcus Miller",
    email: "marcus.m@dragonstudios.com",
    role: "Moderator",
    status: "Suspended",
    joinedDate: "Nov 2024",
    lastActive: "2 weeks ago",
    ip: "74.125.180.12",
  },
];

export interface AuditLogItem {
  id: string;
  action: string;
  adminUser: string;
  target: string;
  category: "Auth" | "Game CMS" | "News CMS" | "User Security" | "System Config";
  ip: string;
  timestamp: string;
  status: "Success" | "Warning" | "Denied";
}

export const auditLogsList: AuditLogItem[] = [
  {
    id: "log-101",
    action: "Published Game Release Schedule",
    adminUser: "Vikram R. Sharma",
    target: "Embers of Valyria (2027)",
    category: "Game CMS",
    ip: "182.73.120.45",
    timestamp: "Jul 31, 2026 • 18:42 IST",
    status: "Success",
  },
  {
    id: "log-102",
    action: "Updated API Key Configuration",
    adminUser: "Dr. Marcus Vance",
    target: "Steamworks API Key",
    category: "System Config",
    ip: "198.16.42.88",
    timestamp: "Jul 31, 2026 • 17:15 IST",
    status: "Success",
  },
  {
    id: "log-103",
    action: "Suspended Suspicious User Account",
    adminUser: "Ananya Deshmukh",
    target: "Marcus Miller (usr-8921)",
    category: "User Security",
    ip: "182.73.120.46",
    timestamp: "Jul 31, 2026 • 14:05 IST",
    status: "Warning",
  },
  {
    id: "log-104",
    action: "Failed Login Attempt (Invalid Password)",
    adminUser: "Unknown",
    target: "admin@dragonstudios.com",
    category: "Auth",
    ip: "45.142.120.8",
    timestamp: "Jul 31, 2026 • 09:12 IST",
    status: "Denied",
  },
];

export const adminStats = {
  activePlayers: "15,248,900",
  monthlyRevenue: "$42,850,000",
  publishedGames: 4,
  activeServers: 48,
  openTickets: 12,
  systemUptime: "99.998%",
  gcStallTime: "0.00 ms",
};
