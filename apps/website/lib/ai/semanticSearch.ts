import { games, news } from "@/data/content";
import { careerPositions } from "@/data/expandedContent";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Games" | "News" | "Careers" | "Studio";
  href: string;
  score: number;
}

export class SemanticSearchService {
  /**
   * Performs fuzzy semantic search over games, news, careers, and studio pages.
   */
  static search(query: string): SearchResultItem[] {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // Search Games
    games.forEach((g) => {
      let score = 0;
      if (g.title.toLowerCase().includes(q)) score += 10;
      if (g.genre.toLowerCase().includes(q)) score += 5;
      if (g.description.toLowerCase().includes(q)) score += 3;

      if (score > 0) {
        results.push({
          id: `g-${g.id}`,
          title: g.title,
          subtitle: `${g.genre} • ${g.status}`,
          category: "Games",
          href: `/games/${g.slug}`,
          score,
        });
      }
    });

    // Search News
    news.forEach((n) => {
      let score = 0;
      if (n.title.toLowerCase().includes(q)) score += 8;
      if (n.tag.toLowerCase().includes(q)) score += 4;
      if (n.excerpt.toLowerCase().includes(q)) score += 2;

      if (score > 0) {
        results.push({
          id: `n-${n.id}`,
          title: n.title,
          subtitle: `${n.tag} • ${n.readTime}`,
          category: "News",
          href: `/news/${n.slug}`,
          score,
        });
      }
    });

    // Search Careers
    careerPositions.forEach((pos) => {
      let score = 0;
      if (pos.title.toLowerCase().includes(q)) score += 8;
      if (pos.department.toLowerCase().includes(q)) score += 5;
      if (pos.location.toLowerCase().includes(q)) score += 3;

      if (score > 0) {
        results.push({
          id: `c-${pos.id}`,
          title: pos.title,
          subtitle: `${pos.department} • ${pos.location}`,
          category: "Careers",
          href: "/careers",
          score,
        });
      }
    });

    // Sort by relevance score descending
    return results.sort((a, b) => b.score - a.score);
  }
}
