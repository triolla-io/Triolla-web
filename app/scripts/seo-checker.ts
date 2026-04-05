import * as fs from "fs";
import * as path from "path";
import https from "https";

interface MetadataIssue {
  severity: "high" | "medium" | "low";
  type: string;
  message: string;
  value?: string;
}

interface PageAudit {
  url: string;
  status: number;
  title?: string;
  description?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  hreflangs: Record<string, string>;
  jsonLdSchemas: Array<{ type: string; valid: boolean; fields: string[] }>;
  metadataIssues: MetadataIssue[];
  robotsMeta?: string;
  twitterCard?: string;
  headingHierarchy: { h1: number; h2: number; h3: number };
}

interface AuditReport {
  timestamp: string;
  baseUrl: string;
  scores: {
    metadataCompleteness: number;
    structuredDataValid: number;
    llmAccessibility: number;
    averageLighthouseSEO?: number;
    en_he_parity: number;
  };
  pages: PageAudit[];
  issues: Array<{ severity: string; type: string; count: number; pages: string[] }>;
  recommendations: string[];
  robotsRules: {
    hasPublicNoindex: boolean;
    allowsAICrawlers: boolean;
    aiCrawlers: string[];
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://triolla.io";
const LOCALHOST = "http://localhost:3000";

async function fetchPage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.warn(`Timeout fetching ${url}`);
      resolve(null);
    }, 10000);

    const fetchUrl = new URL(url);
    const isHttps = fetchUrl.protocol === "https:";
    const client = isHttps ? https : require("http");

    client
      .get(url, { timeout: 10000 }, (res: any) => {
        clearTimeout(timeoutId);
        let data = "";
        res.on("data", (chunk: string) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", () => {
        clearTimeout(timeoutId);
        resolve(null);
      });
  });
}

function extractMetaTag(html: string, name: string, property?: string): string | undefined {
  const pattern = property
    ? `<meta\\s+property="${property}"\\s+content="([^"]*)"`
    : `<meta\\s+name="${name}"\\s+content="([^"]*)`;
  const match = html.match(new RegExp(pattern, "i"));
  return match?.[1];
}

function extractJsonLd(html: string): Array<Record<string, any>> {
  const pattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  const schemas: Array<Record<string, any>> = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch {
      // Invalid JSON-LD
    }
  }
  return schemas;
}

function extractHreflangs(html: string): Record<string, string> {
  const pattern = /<link[^>]*rel="alternate"[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/g;
  const hreflangs: Record<string, string> = {};
  let match;
  while ((match = pattern.exec(html)) !== null) {
    hreflangs[match[1]] = match[2];
  }
  return hreflangs;
}

function countHeadings(html: string): { h1: number; h2: number; h3: number } {
  return {
    h1: (html.match(/<h1[^>]*>/gi) || []).length,
    h2: (html.match(/<h2[^>]*>/gi) || []).length,
    h3: (html.match(/<h3[^>]*>/gi) || []).length,
  };
}

function validateJsonLdSchema(schema: Record<string, any>): { valid: boolean; fields: string[] } {
  const type = schema["@type"];
  const fields = Object.keys(schema).filter((k) => !k.startsWith("@"));

  const requiredFields: Record<string, string[]> = {
    Organization: ["name", "url"],
    WebSite: ["name", "url"],
    BreadcrumbList: ["itemListElement"],
    BlogPosting: ["headline", "url"],
    Service: ["name", "description", "url"],
  };

  const required = requiredFields[type] || [];
  const valid = required.every((field) => schema[field]);

  return { valid, fields };
}

async function auditPage(url: string): Promise<PageAudit | null> {
  console.log(`Auditing: ${url}`);
  const html = await fetchPage(url);
  if (!html) {
    return null;
  }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  const description = extractMetaTag(html, "description");
  const ogImage = extractMetaTag(html, "", "og:image");
  const ogTitle = extractMetaTag(html, "", "og:title");
  const ogDescription = extractMetaTag(html, "", "og:description");
  const canonicalUrl = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1];
  const robotsMeta = extractMetaTag(html, "robots");
  const twitterCard = extractMetaTag(html, "twitter:card");
  const hreflangs = extractHreflangs(html);
  const schemas = extractJsonLd(html);
  const headings = countHeadings(html);

  const metadataIssues: MetadataIssue[] = [];

  if (!title) {
    metadataIssues.push({ severity: "high", type: "missing-title", message: "Missing page title" });
  } else if (title.length < 30) {
    metadataIssues.push({
      severity: "medium",
      type: "title-too-short",
      message: `Title too short: ${title.length} chars`,
      value: title,
    });
  } else if (title.length > 60) {
    metadataIssues.push({
      severity: "medium",
      type: "title-too-long",
      message: `Title too long: ${title.length} chars`,
      value: title,
    });
  }

  if (!description) {
    metadataIssues.push({ severity: "high", type: "missing-description", message: "Missing meta description" });
  } else if (description.length < 120) {
    metadataIssues.push({
      severity: "medium",
      type: "description-too-short",
      message: `Description too short: ${description.length} chars`,
      value: description,
    });
  } else if (description.length > 160) {
    metadataIssues.push({
      severity: "medium",
      type: "description-too-long",
      message: `Description too long: ${description.length} chars`,
      value: description,
    });
  }

  if (!ogImage) {
    metadataIssues.push({ severity: "high", type: "missing-og-image", message: "Missing OG image" });
  }

  if (!ogTitle) {
    metadataIssues.push({ severity: "medium", type: "missing-og-title", message: "Missing OG title" });
  }

  if (!ogDescription) {
    metadataIssues.push({ severity: "medium", type: "missing-og-description", message: "Missing OG description" });
  }

  if (!twitterCard) {
    metadataIssues.push({ severity: "medium", type: "missing-twitter-card", message: "Missing Twitter card" });
  }

  if (!canonicalUrl) {
    metadataIssues.push({ severity: "medium", type: "missing-canonical", message: "Missing canonical URL" });
  }

  if (robotsMeta && robotsMeta.includes("noindex")) {
    // Expected for staging
  }

  const jsonLdSchemas = schemas.map((schema) => {
    const validation = validateJsonLdSchema(schema);
    return {
      type: schema["@type"] || "Unknown",
      ...validation,
    };
  });

  if (jsonLdSchemas.length === 0 && url !== LOCALHOST + "/") {
    // Allow home without schema validation
    metadataIssues.push({ severity: "medium", type: "missing-schema", message: "No JSON-LD schema found" });
  }

  // Check for heading hierarchy issues
  if (headings.h1 === 0) {
    metadataIssues.push({ severity: "medium", type: "missing-h1", message: "Missing H1 heading" });
  } else if (headings.h1 > 1) {
    metadataIssues.push({
      severity: "medium",
      type: "multiple-h1",
      message: `Multiple H1 tags: ${headings.h1}`,
    });
  }

  return {
    url,
    status: 200,
    title,
    description,
    ogImage,
    ogTitle,
    ogDescription,
    canonicalUrl,
    hreflangs,
    jsonLdSchemas,
    metadataIssues,
    robotsMeta,
    twitterCard,
    headingHierarchy: headings,
  };
}

function calculateCompleteness(page: PageAudit): number {
  const checks = [
    !!page.title,
    !!page.description,
    !!page.ogImage,
    !!page.ogTitle,
    !!page.ogDescription,
    !!page.canonicalUrl,
    !!page.twitterCard,
    page.jsonLdSchemas.length > 0,
    page.headingHierarchy.h1 > 0,
  ];
  return (checks.filter((c) => c).length / checks.length) * 100;
}

async function checkRobotsTxt(): Promise<{ hasPublicNoindex: boolean; allowsAICrawlers: boolean; aiCrawlers: string[] }> {
  try {
    const robotsTxtPath = path.join(process.cwd(), "public", "robots.txt");
    const content = fs.readFileSync(robotsTxtPath, "utf-8");

    const hasPublicNoindex =
      content.includes("User-agent: *") && content.includes("Disallow: /");
    const aiCrawlers = content.match(/User-agent:\s*(Claude-Web|GPTBot|Googlebot-Extended)/g) || [];
    const allowsAICrawlers = aiCrawlers.length > 0 && !content.includes("Disallow: /");

    return {
      hasPublicNoindex,
      allowsAICrawlers,
      aiCrawlers: aiCrawlers.map((c) => c.split(": ")[1]),
    };
  } catch {
    return { hasPublicNoindex: false, allowsAICrawlers: false, aiCrawlers: [] };
  }
}

async function generateReport(): Promise<AuditReport> {
  console.log("Starting SEO audit...");

  const robotsRules = await checkRobotsTxt();

  const staticPages = [
    "/",
    "/about-us",
    "/services",
    "/contact-us",
    "/blog",
  ];

  const pages: PageAudit[] = [];

  for (const page of staticPages) {
    const url = `${LOCALHOST}${page}`;
    const audit = await auditPage(url);
    if (audit) {
      pages.push(audit);
    }
    await new Promise((r) => setTimeout(r, 500)); // Rate limit
  }

  // Also check Hebrew versions
  for (const page of ["/", "/services", "/about-us"]) {
    const url = `${LOCALHOST}/he${page}`;
    const audit = await auditPage(url);
    if (audit) {
      pages.push(audit);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  // Calculate scores
  const completenessScores = pages.map(calculateCompleteness);
  const metadataCompleteness =
    completenessScores.length > 0 ? Math.round(completenessScores.reduce((a, b) => a + b) / completenessScores.length) : 0;

  const schemaValidPages = pages.filter((p) => p.jsonLdSchemas.every((s) => s.valid));
  const structuredDataValid =
    pages.length > 0 ? Math.round((schemaValidPages.length / pages.length) * 100) : 0;

  // LLM accessibility: check for AI crawlers, structured data, semantic HTML
  const llmAccessiblePages = pages.filter((p) => {
    const hasSchema = p.jsonLdSchemas.length > 0;
    const hasProperHeadings = p.headingHierarchy.h1 > 0;
    return hasSchema && hasProperHeadings;
  });
  const llmAccessibility = pages.length > 0 ? Math.round((llmAccessiblePages.length / pages.length) * 100) : 0;

  // EN/HE parity check
  const enPages = pages.filter((p) => !p.url.includes("/he"));
  const hePages = pages.filter((p) => p.url.includes("/he"));
  let en_he_parity = 100;
  if (enPages.length > 0 && hePages.length > 0) {
    const enCompleteness = enPages.reduce((sum, p) => sum + calculateCompleteness(p), 0) / enPages.length;
    const heCompleteness = hePages.reduce((sum, p) => sum + calculateCompleteness(p), 0) / hePages.length;
    en_he_parity = Math.round(Math.abs(enCompleteness - heCompleteness) <= 5 ? 100 : 50);
  }

  // Aggregate issues
  const issueMap: Record<string, { pages: Set<string>; severity: string }> = {};
  pages.forEach((page) => {
    page.metadataIssues.forEach((issue) => {
      const key = issue.type;
      if (!issueMap[key]) {
        issueMap[key] = { pages: new Set(), severity: issue.severity };
      }
      issueMap[key].pages.add(page.url);
    });
  });

  const issues = Object.entries(issueMap).map(([type, data]) => ({
    severity: data.severity,
    type,
    count: data.pages.size,
    pages: Array.from(data.pages),
  }));

  // Recommendations
  const recommendations: string[] = [];
  if (!robotsRules.allowsAICrawlers) {
    recommendations.push("Update robots.txt to allow AI crawlers (Claude-Web, GPTBot)");
  }
  if (metadataCompleteness < 90) {
    recommendations.push(`Improve metadata completeness (currently ${metadataCompleteness}%)`);
  }
  if (structuredDataValid < 90) {
    recommendations.push(`Enhance structured data validity (currently ${structuredDataValid}%)`);
  }
  if (llmAccessibility < 90) {
    recommendations.push(`Improve LLM accessibility (currently ${llmAccessibility}%)`);
  }
  if (en_he_parity < 95) {
    recommendations.push("Ensure English and Hebrew pages have matching metadata completeness");
  }

  return {
    timestamp: new Date().toISOString(),
    baseUrl: LOCALHOST,
    scores: {
      metadataCompleteness,
      structuredDataValid,
      llmAccessibility,
      en_he_parity,
    },
    pages,
    issues,
    recommendations,
    robotsRules,
  };
}

async function main() {
  try {
    const report = await generateReport();
    const reportPath = path.join(process.cwd(), "seo-audit-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✓ Audit complete. Report saved to ${reportPath}`);
    console.log("\nScores:");
    console.log(`  Metadata Completeness: ${report.scores.metadataCompleteness}%`);
    console.log(`  Structured Data Valid: ${report.scores.structuredDataValid}%`);
    console.log(`  LLM Accessibility: ${report.scores.llmAccessibility}%`);
    console.log(`  EN/HE Parity: ${report.scores.en_he_parity}%`);
    if (report.recommendations.length > 0) {
      console.log("\nRecommendations:");
      report.recommendations.forEach((r) => console.log(`  - ${r}`));
    }
  } catch (error) {
    console.error("Error running audit:", error);
    process.exit(1);
  }
}

main();
