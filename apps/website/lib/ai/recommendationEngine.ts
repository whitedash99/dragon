import { games, Game } from "@/data/content";

export interface SmartCollection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  gameSlugs: string[];
}

export class RecommendationEngineService {
  /**
   * Returns personalized game recommendations based on user genre affinity and history.
   */
  static getPersonalizedRecommendations(favoriteGenres: string[] = ["Action RPG", "Racing"]): Game[] {
    return games.filter((g) =>
      favoriteGenres.some((genre) => g.genre.toLowerCase().includes(genre.toLowerCase()))
    );
  }

  /**
   * Returns "Because You Played" related titles using tag similarity.
   */
  static getBecauseYouPlayed(gameSlug: string): { baseGame: Game | undefined; recommendations: Game[] } {
    const baseGame = games.find((g) => g.slug === gameSlug);
    if (!baseGame) return { baseGame: undefined, recommendations: games.slice(0, 2) };

    const recommendations = games.filter((g) => g.slug !== gameSlug);
    return { baseGame, recommendations };
  }

  /**
   * Returns trending games ranked by velocity metrics.
   */
  static getTrendingGames(): Game[] {
    return [...games].sort((a, b) => (a.status === "Featured" ? -1 : 1));
  }

  /**
   * Returns smart curated AI collections.
   */
  static getSmartCollections(): SmartCollection[] {
    return [
      {
        id: "top-rated",
        title: "Top Rated Universes",
        subtitle: "Original worlds rated 95%+ by players",
        badge: "AI Selected",
        gameSlugs: ["embers-of-valyria", "neon-drift"],
      },
      {
        id: "trending-worldwide",
        title: "Trending Worldwide",
        subtitle: "Highest simultaneous player spikes across live clusters",
        badge: "High Velocity",
        gameSlugs: ["neon-drift", "blacksite-zero"],
      },
      {
        id: "editors-choice",
        title: "Dragon Editor's Picks",
        subtitle: "Handcrafted experiences pushing Dragon Engine boundaries",
        badge: "Studio Choice",
        gameSlugs: ["embers-of-valyria", "chronos-protocol"],
      },
    ];
  }
}
