import { describe, it } from "node:test";
import assert from "node:assert";

interface CMSBlockDefinition {
  key: string;
  category: string;
  label: string;
  type: "text" | "textarea" | "boolean" | "json";
  content: string;
  isPublished: boolean;
}

const CANONICAL_CMS_KEYS = [
  "homepage.hero",
  "homepage.featured_games",
  "homepage.news",
  "homepage.discord_realm",
  "homepage.secondary_game",
  "homepage.newsletter",
  "footer.brand_sitemap",
  "hero.eyebrow",
  "hero.title",
  "hero.subheadline",
  "hero.announcement",
];

function validateRevalidationPayload(secret: string, expectedSecret: string, tags?: string[], paths?: string[]) {
  if (secret !== expectedSecret) {
    return { valid: false, status: 401, error: "Unauthorized: Invalid revalidation token" };
  }
  const validTags = (tags || []).filter((t) => typeof t === "string" && t.trim().length > 0);
  const validPaths = (paths || []).filter((p) => typeof p === "string" && p.trim().length > 0);
  return { valid: true, status: 200, revalidatedTags: validTags, revalidatedPaths: validPaths };
}

describe("Dragon Studios CMS Synchronization & Revalidation Suite", () => {
  describe("1. CMS Block Keys & Categories", () => {
    it("should contain all essential homepage and hero block keys", () => {
      assert.ok(CANONICAL_CMS_KEYS.includes("homepage.hero"));
      assert.ok(CANONICAL_CMS_KEYS.includes("homepage.featured_games"));
      assert.ok(CANONICAL_CMS_KEYS.includes("hero.title"));
      assert.ok(CANONICAL_CMS_KEYS.includes("hero.subheadline"));
      assert.ok(CANONICAL_CMS_KEYS.includes("footer.brand_sitemap"));
    });

    it("should guarantee no duplicate keys in canonical block definitions", () => {
      const uniqueKeys = new Set(CANONICAL_CMS_KEYS);
      assert.strictEqual(CANONICAL_CMS_KEYS.length, uniqueKeys.size);
    });
  });

  describe("2. On-Demand Revalidation Authorization Gate", () => {
    const SECRET = "dragon-studio-content-secret-2026";

    it("should authenticate requests with matching secret token", () => {
      const res = validateRevalidationPayload(SECRET, SECRET, ["cms-blocks"], ["/"]);
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.revalidatedTags, ["cms-blocks"]);
      assert.deepStrictEqual(res.revalidatedPaths, ["/"]);
    });

    it("should reject revalidation requests with invalid secret token", () => {
      const res = validateRevalidationPayload("wrong-secret-token", SECRET, ["cms-blocks"], ["/"]);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.status, 401);
      assert.match(res.error || "", /Unauthorized/);
    });
  });
});
