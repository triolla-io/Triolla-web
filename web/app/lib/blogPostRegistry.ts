import fs from "fs";
import path from "path";
import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

export const BLOG_SLUG_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

let _blogSlugsCache: string[] | null = null;

/** Slugs under `app/blog-*` that have `blog-*-deps.json` (build-time scan). */
export function getBlogSlugs(): string[] {
  if (_blogSlugsCache) return _blogSlugsCache;
  const appDir = path.join(process.cwd(), "app");
  let names: string[] = [];
  try {
    names = fs
      .readdirSync(appDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("blog-"))
      .map((d) => d.name.slice("blog-".length))
      .filter((slug) => BLOG_SLUG_SEGMENT.test(slug));
  } catch {
    _blogSlugsCache = [];
    return _blogSlugsCache;
  }
  const withDeps = names.filter((slug) =>
    fs.existsSync(
      path.join(appDir, `blog-${slug}`, `blog-${slug}-deps.json`),
    ),
  );
  withDeps.sort();
  _blogSlugsCache = withDeps;
  return _blogSlugsCache;
}

/** Title lookup from sitemap. Used for <title> metadata. */
export const BLOG_TITLES: Partial<Record<string, string>> = {
  "six-things-you-need-to-check-before-hiring-a-ux-ui-agency":
    "Six Things You Need to Check Before Hiring a UX/UI Agency",
  "triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation":
    "Triolla's Mobile App UX Mastery Will Make Your App a Sensation",
  "the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux":
    "The Essential Guide to Designing a Top-Performing Cyber App",
  "why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla":
    "Why Every Modern Company Needs a Stellar Dashboard UI",
  "iso-27001-2025-2026": "ISO 27001 UX Design Guide 2025–2026",
  "the-fintech-ux-playbook": "The Fintech UX Playbook",
  "cybersecurity-design-ux-a-founder-playbook":
    "Cybersecurity Design UX: A Founder Playbook",
  "revolutionizing-healthcare-with-ux-design":
    "Revolutionizing Healthcare with UX Design",
  "ux-in-medtech-when-trust-is-a-matter-of-life-and-death":
    "UX in MedTech: When Trust Is a Matter of Life and Death",
};

export function loadBlogDeps(slug: string): TriollaPortfolioSnapshotDeps | null {
  try {
    const depsPath = path.join(
      process.cwd(),
      "app",
      `blog-${slug}`,
      `blog-${slug}-deps.json`,
    );
    const raw = fs.readFileSync(depsPath, "utf-8");
    return JSON.parse(raw) as TriollaPortfolioSnapshotDeps;
  } catch {
    return null;
  }
}

export function slugToTitle(slug: string): string {
  const t = BLOG_TITLES[slug];
  if (t) return t;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function loadHeBlogDeps(slug: string): TriollaPortfolioSnapshotDeps | null {
  try {
    const depsPath = path.join(
      process.cwd(),
      "app",
      "he",
      `he-blog-${slug}`,
      `he-blog-${slug}-deps.json`,
    );
    return JSON.parse(fs.readFileSync(depsPath, "utf-8")) as TriollaPortfolioSnapshotDeps;
  } catch {
    return null;
  }
}

export function hebrewBlogFragmentExists(slug: string): boolean {
  return fs.existsSync(
    path.join(process.cwd(), "public", "fragments", `he-blog-${slug}-he-body.html`),
  );
}
