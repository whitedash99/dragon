import { MetadataRoute } from "next";
import { games } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dragonstudios.com";

  const staticRoutes = [
    "",
    "/games",
    "/studio",
    "/careers",
    "/contact",
    "/community",
    "/community/forums",
    "/community/reviews",
    "/community/events",
    "/community/creators",
    "/community/knowledge",
    "/downloads",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...gameRoutes];
}
