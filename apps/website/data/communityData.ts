export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  excerpt: string;
  repliesCount: number;
  likesCount: number;
  viewsCount: number;
  timestamp: string;
  pinned?: boolean;
}

export const forumThreads: ForumThread[] = [];

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
  rating: number;
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

export const verifiedReviews: VerifiedReview[] = [];

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  platform: "Twitch" | "YouTube" | "Kick";
  followers: string;
  specialty: string;
  avatar: string;
  banner: string;
  verified: boolean;
  featuredClipUrl?: string;
}

export const creatorsList: CreatorProfile[] = [];
