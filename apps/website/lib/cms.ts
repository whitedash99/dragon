import { prisma } from "@/lib/prisma";

export type CMSCategory =
  | "Homepage"
  | "Hero"
  | "Navigation"
  | "Footer"
  | "Games"
  | "Studio"
  | "Community"
  | "News"
  | "Careers"
  | "Contact"
  | "FAQ"
  | "Privacy Policy"
  | "Terms of Service"
  | "Cookie Policy"
  | "Announcement Bar"
  | "Buttons"
  | "Labels"
  | "Empty States"
  | "Success Messages"
  | "Error Messages font-mono"
  | "Error Messages"
  | "SEO Metadata"
  | "Social Links"
  | "Company Information";

export interface DefaultBlock {
  key: string;
  category: CMSCategory;
  label: string;
  type: "text" | "textarea" | "richtext";
  content: string;
}

export const DEFAULT_CONTENT_BLOCKS: DefaultBlock[] = [
  // ═══ ANNOUNCEMENT BAR ═══
  { key: "announcement.text", category: "Announcement Bar", label: "Announcement Bar Text", type: "text", content: "⚡ EMPERS OF VALYRIA: Pre-Alpha Playtest Registration Now Live" },
  { key: "announcement.link", category: "Announcement Bar", label: "Announcement Link URL", type: "text", content: "/games/embers-of-valyria" },

  // ═══ HOMEPAGE & HERO ═══
  { key: "hero.eyebrow", category: "Hero", label: "Hero Eyebrow Badge", type: "text", content: "Dragon Studios — Est. 2023" },
  { key: "hero.announcement", category: "Hero", label: "Hero Announcement Banner", type: "text", content: "Embers of Valyria — Coming 2027" },
  { key: "hero.title", category: "Hero", label: "Hero Main Title", type: "text", content: "FORGING WORLDS BEYOND IMAGINATION" },
  { key: "hero.subheadline", category: "Hero", label: "Hero Subheadline", type: "textarea", content: "We craft immersive gaming experiences that push the boundaries of interactive entertainment." },
  { key: "hero.cta_primary", category: "Hero", label: "Hero Primary Button Text", type: "text", content: "Explore Our Games" },
  { key: "hero.cta_secondary", category: "Hero", label: "Hero Secondary Button Text", type: "text", content: "Meet the Studio" },

  // ═══ NAVIGATION ═══
  { key: "nav.brand", category: "Navigation", label: "Brand Name", type: "text", content: "DRAGON GAMING" },
  { key: "nav.games", category: "Navigation", label: "Menu Item: Games", type: "text", content: "GAMES" },
  { key: "nav.studio", category: "Navigation", label: "Menu Item: Studio", type: "text", content: "STUDIO" },
  { key: "nav.news", category: "Navigation", label: "Menu Item: News", type: "text", content: "NEWS" },
  { key: "nav.careers", category: "Navigation", label: "Menu Item: Careers", type: "text", content: "CAREERS" },
  { key: "nav.community", category: "Navigation", label: "Menu Item: Community", type: "text", content: "COMMUNITY" },
  { key: "nav.contact", category: "Navigation", label: "Menu Item: Contact", type: "text", content: "CONTACT" },
  { key: "nav.signin", category: "Navigation", label: "Button: Sign In", type: "text", content: "SIGN IN" },
  { key: "nav.join", category: "Navigation", label: "Button: Join Now", type: "text", content: "JOIN NOW" },

  // ═══ GAMES ═══
  { key: "games.eyebrow", category: "Games", label: "Games Section Eyebrow", type: "text", content: "Our Portfolio" },
  { key: "games.title", category: "Games", label: "Games Section Title", type: "text", content: "Immersive Worlds" },
  { key: "games.description", category: "Games", label: "Games Section Description", type: "textarea", content: "Next-generation gaming experiences powered by Dragon Engine. Engineered for emotional depth, physical reactivity, and unscripted replayability." },
  { key: "games.cta", category: "Games", label: "View All Games Button Text", type: "text", content: "View All Games" },

  // ═══ STUDIO ═══
  { key: "studio.eyebrow", category: "Studio", label: "Studio Section Eyebrow", type: "text", content: "The Studio" },
  { key: "studio.title", category: "Studio", label: "Studio Section Title", type: "text", content: "Not Content. A Collision Of Feelings." },
  { key: "studio.lead", category: "Studio", label: "Studio Lead Paragraph", type: "textarea", content: "Dragon Studios was founded with a singular directive: to reject generic industrial game loops and forge immersive worlds that stay with players forever." },
  { key: "studio.mission", category: "Studio", label: "Studio Mission Quote", type: "textarea", content: "We combine cutting-edge proprietary technology with uncompromised artistic direction. Every shadow, every soundscape, and every AI behavior is engineered to deliver unforgettable emotional resonance." },

  // ═══ COMMUNITY ═══
  { key: "community.eyebrow", category: "Community", label: "Community Eyebrow", type: "text", content: "Join The Community" },
  { key: "community.title", category: "Community", label: "Community Title", type: "text", content: "Shape The Future Of Gaming Worlds" },
  { key: "community.subheadline", category: "Community", label: "Community Subheadline", type: "textarea", content: "Connect with our engineering leads, participate in closed pre-alpha playtests, and help influence design decisions inside official Dragon Studios channels." },

  // ═══ NEWS ═══
  { key: "news.eyebrow", category: "News", label: "Newsroom Eyebrow", type: "text", content: "Studio Dispatches" },
  { key: "news.title", category: "News", label: "Newsroom Main Title", type: "text", content: "LATEST NEWS & TECH DISPATCHES" },

  // ═══ CAREERS ═══
  { key: "careers.eyebrow", category: "Careers", label: "Careers Page Eyebrow", type: "text", content: "Join The Dragon Collective" },
  { key: "careers.title", category: "Careers", label: "Careers Page Title", type: "text", content: "Build The Unbuilt" },
  { key: "careers.lead", category: "Careers", label: "Careers Lead Text", type: "textarea", content: "We're looking for curious, autonomous engineers, artists, and designers who want to craft world-class AAA games without industrial crunch." },

  // ═══ CONTACT ═══
  { key: "contact.eyebrow", category: "Contact", label: "Contact Page Eyebrow", type: "text", content: "Direct Dispatch Line" },
  { key: "contact.title", category: "Contact", label: "Contact Page Title", type: "text", content: "Connect With Dragon Studios" },
  { key: "contact.lead", category: "Contact", label: "Contact Page Description", type: "textarea", content: "For business inquiries, publishing, press credentials, or player support, reach out directly to our team." },

  // ═══ FAQ ═══
  { key: "faq.title", category: "FAQ", label: "FAQ Section Title", type: "text", content: "FREQUENTLY ASKED QUESTIONS" },
  { key: "faq.subtitle", category: "FAQ", label: "FAQ Subtitle", type: "textarea", content: "Everything you need to know about Dragon Studios games, technology, and career opportunities." },

  // ═══ PRIVACY POLICY ═══
  { key: "privacy.title", category: "Privacy Policy", label: "Privacy Policy Title", type: "text", content: "DRAGON STUDIOS PRIVACY POLICY" },
  { key: "privacy.content", category: "Privacy Policy", label: "Privacy Policy Body", type: "richtext", content: "Dragon Studios respects your privacy. We collect data necessary for support, gameplay telemetry, and account security. We never sell your personal data to third parties." },

  // ═══ TERMS OF SERVICE ═══
  { key: "terms.title", category: "Terms of Service", label: "Terms of Service Title", type: "text", content: "DRAGON STUDIOS TERMS OF SERVICE" },
  { key: "terms.content", category: "Terms of Service", label: "Terms of Service Body", type: "richtext", content: "By accessing Dragon Studios games, websites, and services, you agree to comply with our code of conduct, license terms, and community guidelines." },

  // ═══ COOKIE POLICY ═══
  { key: "cookies.title", category: "Cookie Policy", label: "Cookie Policy Title", type: "text", content: "DRAGON STUDIOS COOKIE POLICY" },
  { key: "cookies.content", category: "Cookie Policy", label: "Cookie Policy Body", type: "richtext", content: "We use essential cookies to maintain your login session, security tokens, and user preferences." },

  // ═══ FOOTER ═══
  { key: "footer.tagline", category: "Footer", label: "Footer Studio Tagline", type: "textarea", content: "Premier game development studio creating high-fidelity interactive worlds powered by Dragon Engine." },
  { key: "footer.copyright", category: "Footer", label: "Footer Copyright Text", type: "text", content: "Dragon Studios Inc. All rights reserved." },

  // ═══ SEO ═══
  { key: "seo.default_title", category: "SEO Metadata", label: "Default Page Title", type: "text", content: "Dragon Studios | AAA Game Development Studio" },
  { key: "seo.description", category: "SEO Metadata", label: "Meta Description", type: "textarea", content: "Dragon Studios - Premier AAA Game Development Studio creating immersive worlds powered by Dragon Engine." },
  { key: "seo.keywords", category: "SEO Metadata", label: "Meta Keywords", type: "text", content: "Dragon Studios, Game Studio, AAA Games, Dragon Engine, Embers of Valyria" },

  // ═══ COMPANY INFORMATION ═══
  { key: "company.name", category: "Company Information", label: "Company Legal Name", type: "text", content: "Dragon Studios Inc." },
  { key: "company.email", category: "Company Information", label: "Contact Email", type: "text", content: "hello@dragonstudios.com" },
  { key: "company.support_email", category: "Company Information", label: "Support Email", type: "text", content: "support@dragonstudios.com" },
  { key: "company.location", category: "Company Information", label: "Global Headquarters Location", type: "text", content: "Digital Frontier" },
];

/**
 * Returns all content blocks, merging database overrides with default values.
 */
export async function getAllContentBlocks() {
  try {
    const dbBlocks = await prisma.contentBlock.findMany();
    const map = new Map(dbBlocks.map((b) => [b.key, b]));

    return DEFAULT_CONTENT_BLOCKS.map((def) => {
      const dbItem = map.get(def.key);
      if (dbItem) {
        return {
          id: dbItem.id,
          key: dbItem.key,
          category: dbItem.category,
          label: dbItem.label,
          type: dbItem.type,
          content: dbItem.content,
          draftContent: dbItem.draftContent || dbItem.content,
          isPublished: dbItem.isPublished,
          version: dbItem.version,
          updatedAt: dbItem.updatedAt,
        };
      }
      return {
        id: `def-${def.key}`,
        key: def.key,
        category: def.category,
        label: def.label,
        type: def.type,
        content: def.content,
        draftContent: def.content,
        isPublished: true,
        version: 1,
        updatedAt: new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching content blocks from DB:", error);
    return DEFAULT_CONTENT_BLOCKS.map((def) => ({
      id: `def-${def.key}`,
      key: def.key,
      category: def.category,
      label: def.label,
      type: def.type,
      content: def.content,
      draftContent: def.content,
      isPublished: true,
      version: 1,
      updatedAt: new Date(),
    }));
  }
}

/**
 * Gets a single content string by key, falling back to default value.
 */
export async function getContentText(key: string, fallback?: string): Promise<string> {
  try {
    const block = await prisma.contentBlock.findUnique({
      where: { key },
    });
    if (block && block.content) {
      return block.content;
    }
  } catch (e) {
    // DB fallback
  }

  const def = DEFAULT_CONTENT_BLOCKS.find((d) => d.key === key);
  return def ? def.content : fallback || "";
}

/**
 * Gets a map of all content blocks for fast SSR/SSG resolution.
 */
export async function getContentMap(): Promise<Record<string, string>> {
  const blocks = await getAllContentBlocks();
  const res: Record<string, string> = {};
  for (const b of blocks) {
    res[b.key] = b.content;
  }
  return res;
}
