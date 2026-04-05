/**
 * WordPress Hebrew blog URLs sometimes use a Hebrew slug path segment.
 * Canonical in-app URLs use the same English slug as /blog/<slug>/ (and triolla.io/blog/...).
 * Keys: decoded pathname segment (e.g. איך-ux-ui-...).
 */
export const HEBREW_BLOG_SLUG_TO_ENGLISH_SLUG: Record<string, string> = {
  "איך-ux-ui-ישפיע-על-העתיד-הטכנולוגי-שלנו":
    "how-will-ux-ui-shape-our-technological-future",
  "מה-זה-ooux-היכרות-עם-עקרונות-object-oriented-ux-בעיצוב-מוצ":
    "what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design",
};
