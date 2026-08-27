import { describe, it } from "node:test";
import assert from "node:assert";

interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

const PUBLIC_PRIMARY_NAVIGATION: NavItem[] = [
  { id: "nav_home", label: "HOME", href: "/" },
  { id: "nav_games", label: "GAMES", href: "/games" },
  { id: "nav_downloads", label: "DOWNLOADS", href: "/downloads" },
  { id: "nav_careers", label: "CAREERS", href: "/careers" },
  { id: "nav_community", label: "COMMUNITY", href: "/community" },
  { id: "nav_contact", label: "CONTACT", href: "/contact" },
  { id: "nav_signin", label: "SIGN IN", href: "/login" },
  { id: "nav_join", label: "JOIN NOW", href: "/register" },
];

const OFFICIAL_EXTERNAL_CHANNELS: NavItem[] = [
  { id: "soc_discord", label: "DISCORD", href: "https://discord.gg/23nyUsPG5", isExternal: true },
  { id: "soc_whatsapp", label: "WHATSAPP", href: "https://whatsapp.com/channel/0029Vb7BqH0I7BeLwTzZ5i0S", isExternal: true },
  { id: "soc_youtube", label: "YOUTUBE", href: "https://youtube.com/@dragongamingstudios", isExternal: true },
  { id: "soc_instagram", label: "INSTAGRAM", href: "https://instagram.com/dragongamingstudios", isExternal: true },
  { id: "soc_threads", label: "THREADS", href: "https://threads.net/@dragongamingstudios", isExternal: true },
  { id: "soc_twitter", label: "X", href: "https://x.com/dragongamingstd", isExternal: true },
];

describe("Dragon Studios Public Navigation & Routing Collision Regression Suite", () => {
  describe("1. Primary Navigation Routes & Collision Detection", () => {
    it("should guarantee GAMES points exclusively to /games and NOT /downloads", () => {
      const gamesItem = PUBLIC_PRIMARY_NAVIGATION.find((n) => n.label === "GAMES");
      assert.ok(gamesItem, "GAMES navigation item must exist");
      assert.strictEqual(gamesItem.href, "/games");
      assert.notStrictEqual(gamesItem.href, "/downloads");
    });

    it("should guarantee DOWNLOADS points exclusively to /downloads and NOT /games", () => {
      const downloadsItem = PUBLIC_PRIMARY_NAVIGATION.find((n) => n.label === "DOWNLOADS");
      assert.ok(downloadsItem, "DOWNLOADS navigation item must exist");
      assert.strictEqual(downloadsItem.href, "/downloads");
      assert.notStrictEqual(downloadsItem.href, "/games");
    });

    it("should ensure every primary navigation item has a distinct destination", () => {
      const hrefs = PUBLIC_PRIMARY_NAVIGATION.map((n) => n.href);
      const uniqueHrefs = new Set(hrefs);
      assert.strictEqual(hrefs.length, uniqueHrefs.size, "All primary nav hrefs must be unique");
    });

    it("should verify standard route destinations", () => {
      const routeMap = Object.fromEntries(PUBLIC_PRIMARY_NAVIGATION.map((n) => [n.label, n.href]));
      assert.strictEqual(routeMap["HOME"], "/");
      assert.strictEqual(routeMap["GAMES"], "/games");
      assert.strictEqual(routeMap["DOWNLOADS"], "/downloads");
      assert.strictEqual(routeMap["CAREERS"], "/careers");
      assert.strictEqual(routeMap["COMMUNITY"], "/community");
      assert.strictEqual(routeMap["CONTACT"], "/contact");
      assert.strictEqual(routeMap["SIGN IN"], "/login");
      assert.strictEqual(routeMap["JOIN NOW"], "/register");
    });
  });

  describe("2. Official External Social Channels", () => {
    it("should use secure HTTPS protocol for all social channel links", () => {
      for (const channel of OFFICIAL_EXTERNAL_CHANNELS) {
        assert.ok(
          channel.href.startsWith("https://"),
          `Channel ${channel.label} must use https:// protocol`
        );
      }
    });

    it("should maintain all 6 verified studio community handles", () => {
      const labels = OFFICIAL_EXTERNAL_CHANNELS.map((c) => c.label);
      assert.ok(labels.includes("DISCORD"));
      assert.ok(labels.includes("WHATSAPP"));
      assert.ok(labels.includes("YOUTUBE"));
      assert.ok(labels.includes("INSTAGRAM"));
      assert.ok(labels.includes("THREADS"));
      assert.ok(labels.includes("X"));
    });
  });
});
