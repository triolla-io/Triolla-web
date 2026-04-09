import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const formFactor = args.includes("--mobile") ? "mobile" : "desktop";
const LATEST_JSON = path.join(process.cwd(), "public", "lighthouse", `latest-${formFactor}.report.json`);

// ─── Types ────────────────────────────────────────────────────────────────────

interface LighthouseAudit {
  id: string;
  title: string;
  score: number | null;
  scoreDisplayMode: string;
  numericValue?: number;
  displayValue?: string;
  details?: {
    type: string;
    items?: Array<Record<string, unknown>>;
  };
}

interface LighthouseReport {
  finalUrl: string;
  fetchTime: string;
  categories: Record<string, { score: number | null }>;
  audits: Record<string, LighthouseAudit>;
}

interface Suggestion {
  priority: "high" | "medium" | "low";
  audit: string;
  problem: string;
  fix: string;
  nextjsTip?: string;
  savings?: string;
}

// ─── Rules ────────────────────────────────────────────────────────────────────
// Each rule maps a Lighthouse audit ID to a Next.js-specific suggestion.
// Only fires when audit score < threshold.

const RULES: Array<{
  auditId: string;
  priority: "high" | "medium" | "low";
  problem: string;
  fix: string;
  nextjsTip?: string;
}> = [
  {
    auditId: "largest-contentful-paint",
    priority: "high",
    problem: "LCP is slow — the largest visible element takes too long to render.",
    fix: "Identify the LCP element (usually a hero image or heading) and make sure it loads immediately.",
    nextjsTip: "Add the `priority` prop to the hero <Image> component. This injects a <link rel='preload'> automatically.",
  },
  {
    auditId: "total-blocking-time",
    priority: "high",
    problem: "High Total Blocking Time — the main thread is busy during load, delaying interactivity.",
    fix: "Break up long JavaScript tasks. Defer non-critical code.",
    nextjsTip: "Use `next/dynamic` with `{ ssr: false }` for heavy components (carousels, maps, animations) that are not needed on first render.",
  },
  {
    auditId: "cumulative-layout-shift",
    priority: "high",
    problem: "Layout shifts detected — elements are moving after the page loads.",
    fix: "Reserve space for images and dynamic content before they load.",
    nextjsTip: "Always set `width` and `height` on <Image> components. For dynamic content, use min-height on containers.",
  },
  {
    auditId: "render-blocking-resources",
    priority: "high",
    problem: "Render-blocking resources are delaying the first paint.",
    fix: "Defer or async-load scripts that are not needed for initial render.",
    nextjsTip: "Next.js handles most of this automatically in production builds. Check for third-party scripts added via <Script> — use `strategy='lazyOnload'` or `strategy='afterInteractive'` instead of the default.",
  },
  {
    auditId: "unused-javascript",
    priority: "high",
    problem: "Unused JavaScript is being downloaded but never executed.",
    fix: "Remove or lazy-load code that isn't needed on this page.",
    nextjsTip: "Run `npm run analyze` to see your bundle. Look for large chunks loaded on every page. Move them to dynamic imports: `const Foo = dynamic(() => import('./Foo'))`.",
  },
  {
    auditId: "uses-optimized-images",
    priority: "high",
    problem: "Images are not optimized — oversized files are being served.",
    fix: "Compress and resize images before serving them.",
    nextjsTip: "Replace any <img> tags with Next.js <Image> from 'next/image'. It auto-optimizes, resizes, and serves WebP/AVIF.",
  },
  {
    auditId: "uses-responsive-images",
    priority: "medium",
    problem: "Images are served at a larger size than the display size requires.",
    fix: "Serve different image sizes for different screen widths.",
    nextjsTip: "Add a `sizes` prop to your <Image> components, e.g. `sizes='(max-width: 768px) 100vw, 50vw'`. This tells Next.js which size to generate.",
  },
  {
    auditId: "efficient-animated-content",
    priority: "medium",
    problem: "Animated GIFs are being used — they are large and inefficient.",
    fix: "Replace GIFs with video elements (mp4/webm).",
    nextjsTip: "Use <video autoPlay loop muted playsInline> with an mp4/webm source. File size is typically 5-10x smaller than GIF.",
  },
  {
    auditId: "offscreen-images",
    priority: "medium",
    problem: "Images below the fold are being loaded eagerly.",
    fix: "Lazy-load images that are not visible on initial load.",
    nextjsTip: "Next.js <Image> lazy-loads by default. If you're using <img> tags for below-fold images, add `loading='lazy'`.",
  },
  {
    auditId: "uses-rel-preconnect",
    priority: "medium",
    problem: "Missing preconnect hints for third-party origins.",
    fix: "Add <link rel='preconnect'> for domains you connect to early (fonts, CDNs, APIs).",
    nextjsTip: "Add preconnect links in your root layout.tsx inside the <head>:\n    <link rel='preconnect' href='https://fonts.googleapis.com' />",
  },
  {
    auditId: "font-display",
    priority: "medium",
    problem: "Custom fonts block rendering — text is invisible until fonts load.",
    fix: "Add font-display: swap to your @font-face declarations.",
    nextjsTip: "If using next/font, pass `display: 'swap'` in the font config. If using Google Fonts via CSS, add `&display=swap` to the URL.",
  },
  {
    auditId: "uses-long-cache-ttl",
    priority: "medium",
    problem: "Static assets are not being cached by the browser.",
    fix: "Set long cache headers (1 year) for static assets.",
    nextjsTip: "In next.config.ts, add cache headers for /_next/static/* paths:\n    { source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }",
  },
  {
    auditId: "server-response-time",
    priority: "medium",
    problem: "Server response time (TTFB) is too slow.",
    fix: "Reduce server-side processing time or add caching.",
    nextjsTip: "Check your API routes and getServerSideProps for slow queries. Consider switching pages to static generation (getStaticProps) or ISR where possible.",
  },
  {
    auditId: "unminified-javascript",
    priority: "low",
    problem: "JavaScript is not minified.",
    fix: "Enable minification in your build config.",
    nextjsTip: "This should not happen in a production Next.js build. Make sure you're testing against `next build && next start`, not `next dev`.",
  },
  {
    auditId: "unminified-css",
    priority: "low",
    problem: "CSS is not minified.",
    fix: "Enable CSS minification.",
    nextjsTip: "Same as above — run a production build before testing with Lighthouse.",
  },
  {
    auditId: "dom-size",
    priority: "low",
    problem: "DOM is very large — too many elements on the page.",
    fix: "Reduce the number of DOM nodes, especially deeply nested structures.",
    nextjsTip: "Check components that render long lists without virtualization. Consider windowing libraries for large lists.",
  },
  {
    auditId: "no-document-write",
    priority: "low",
    problem: "document.write() is being used, which blocks the parser.",
    fix: "Replace document.write() with DOM manipulation APIs.",
    nextjsTip: "This usually comes from a third-party script. Audit your <Script> tags and remove or replace the offending one.",
  },
  {
    auditId: "uses-text-compression",
    priority: "low",
    problem: "Text assets (JS, CSS, HTML) are not being compressed.",
    fix: "Enable gzip or brotli compression on your server.",
    nextjsTip: "Next.js standalone mode compresses responses. If behind a reverse proxy (nginx, Caddy), enable gzip there.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD  = "\x1b[1m";
const RED   = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN  = "\x1b[36m";
const DIM   = "\x1b[2m";

function priorityColor(p: "high" | "medium" | "low"): string {
  return p === "high" ? RED : p === "medium" ? YELLOW : DIM;
}

function priorityLabel(p: "high" | "medium" | "low"): string {
  const color = priorityColor(p);
  const label = p.toUpperCase().padEnd(6);
  return `${color}${BOLD}[${label}]${RESET}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(LATEST_JSON)) {
    console.error(`✗ No ${formFactor} Lighthouse report found.`);
    console.error(`  Run: npm run lighthouse${formFactor === "mobile" ? " -- --mobile" : ""}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(LATEST_JSON, "utf-8");
  const report: LighthouseReport = JSON.parse(raw);

  const perfScore = Math.round((report.categories["performance"]?.score ?? 0) * 100);
  const line = "─".repeat(60);

  console.log(`\n${BOLD}${line}${RESET}`);
  console.log(`${BOLD}Lighthouse Suggestions — ${report.finalUrl}${RESET}`);
  console.log(`${BOLD}Performance score: ${perfScore}${RESET}`);
  console.log(`${BOLD}${line}${RESET}\n`);

  const suggestions: Suggestion[] = [];

  for (const rule of RULES) {
    const audit = report.audits[rule.auditId];
    if (!audit) continue;

    // Skip audits that passed
    if (audit.score !== null && audit.score >= 0.9) continue;
    // Skip informational audits with no score
    if (audit.score === null && audit.scoreDisplayMode === "informative") continue;

    suggestions.push({
      ...rule,
      audit: audit.title,
      savings: audit.displayValue,
    });
  }

  if (suggestions.length === 0) {
    console.log(`  ${BOLD}No issues found — all audits passed!${RESET}\n`);
    return;
  }

  // Group by priority
  const byPriority = { high: suggestions.filter(s => s.priority === "high"), medium: suggestions.filter(s => s.priority === "medium"), low: suggestions.filter(s => s.priority === "low") };

  let index = 1;
  for (const priority of ["high", "medium", "low"] as const) {
    const group = byPriority[priority];
    if (group.length === 0) continue;

    for (const s of group) {
      console.log(`${priorityLabel(s.priority)} ${BOLD}${s.audit}${RESET}${s.savings ? `  ${CYAN}${s.savings}${RESET}` : ""}`);
      console.log(`  ${DIM}Problem:${RESET}  ${s.problem}`);
      console.log(`  ${DIM}Fix:${RESET}      ${s.fix}`);
      if (s.nextjsTip) {
        console.log(`  ${DIM}Next.js:${RESET}  ${s.nextjsTip}`);
      }
      console.log();
      index++;
    }
  }

  const highCount = byPriority.high.length;
  const medCount  = byPriority.medium.length;
  const lowCount  = byPriority.low.length;

  console.log(`${BOLD}${line}${RESET}`);
  console.log(`${RED}${BOLD}High priority:${RESET}   ${highCount} issue${highCount !== 1 ? "s" : ""}`);
  console.log(`${YELLOW}${BOLD}Medium priority:${RESET} ${medCount} issue${medCount !== 1 ? "s" : ""}`);
  console.log(`${DIM}${BOLD}Low priority:${RESET}    ${lowCount} issue${lowCount !== 1 ? "s" : ""}`);
  console.log(`${BOLD}${line}${RESET}\n`);
  console.log(`Run ${CYAN}npm run lighthouse${RESET} after making changes to track improvement.\n`);
}

main();
