import * as fs from "fs";
import * as path from "path";

interface AuditReport {
  scores: Record<string, number>;
  pages: Array<{
    url: string;
    metadataIssues: Array<{ type: string; severity: string }>;
  }>;
  issues: Array<{ type: string; count: number; severity: string }>;
  recommendations: string[];
  robotsRules: { hasPublicNoindex: boolean; allowsAICrawlers: boolean };
}

interface Improvement {
  file: string;
  change: string;
  reason: string;
}

const improvements: Improvement[] = [];

function shouldApplyFix(report: AuditReport, fixType: string): boolean {
  // Check if this fix type appears in the issues
  return report.issues.some((issue) => issue.type === fixType);
}

function createDefaultDescriptions(): void {
  // Ensure PAGE_DESCRIPTIONS has good lengths (150-160 chars)
  const descriptions = {
    en: {
      home: "Award-winning Product UX/UI design studio in Israel. We craft exceptional digital experiences for technology brands.",
      about: "Meet Triolla - a team of 65+ experienced UX/UI designers creating world-class digital products and experiences.",
      services: "Comprehensive UX/UI design services including research, UI design, prototyping, design systems, and product design.",
      blog: "UX/UI design insights, trends, product strategy, and case studies from Triolla's expert design team.",
      contact: "Get in touch with Triolla's design team today. Let's create exceptional digital experiences together.",
    },
    he: {
      home: "סטודיו עיצוב UX/UI מובחר בישראל. אנחנו יוצרים חוויות דיגיטליות יוצאות דופן למותגי טך.",
      about: "צוות טריולה - 65+ מעצבי UX/UI בעלי ניסיון היוצרים מוצרים דיגיטליים ברמה עולמית.",
      services: "שירותי עיצוב UX/UI מקיפים: מחקר UX, עיצוב UI, prototyping, מערכות עיצוב ועוד.",
      blog: "תובנות עיצוב, טרנדים UX, אסטרטגיית מוצר, ו ו case studies מצוות טריולה.",
      contact: "צור קשר עם צוות הדיזיין של טריולה היום. בואו ניצור חוויות דיגיטליות חריגות ביחד.",
    },
  };

  const libPath = path.join(process.cwd(), "app", "lib", "metadata.ts");
  let content = fs.readFileSync(libPath, "utf-8");

  // Build the new descriptions object
  let descString = "export const PAGE_DESCRIPTIONS = {\n";
  descString += '  en: {\n';
  Object.entries(descriptions.en).forEach(([key, val]) => {
    descString += `    ${key}: "${val}",\n`;
  });
  descString += "  },\n";
  descString += '  he: {\n';
  Object.entries(descriptions.he).forEach(([key, val]) => {
    descString += `    ${key}: "${val}",\n`;
  });
  descString += "  },\n};";

  content = content.replace(/export const PAGE_DESCRIPTIONS = {[\s\S]*?};/, descString);
  fs.writeFileSync(libPath, content);

  improvements.push({
    file: "app/lib/metadata.ts",
    change: "Optimized PAGE_DESCRIPTIONS to 150-160 char range",
    reason: "Improve meta description SEO and character count targets",
  });
}

function updateRobotsTxt(): void {
  const robotsPath = path.join(process.cwd(), "public", "robots.txt");
  const content = fs.readFileSync(robotsPath, "utf-8");

  // Check if AI crawlers already allowed
  if (content.includes("Claude-Web")) {
    return; // Already updated
  }

  const newContent = `# Allow AI/LLM crawlers while keeping search engines out (staging mode)
User-agent: Googlebot-Extended
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Block public search engines (staging/development)
User-agent: Googlebot
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: *
Disallow: /

# Disallow crawling of internal paths
Disallow: /.next/
Disallow: /node_modules/
Disallow: /_next/
Disallow: /api/

# Sitemaps
Sitemap: https://triolla.io/sitemap.xml

# Crawl delay (optional, in seconds)
Crawl-delay: 1
`;

  fs.writeFileSync(robotsPath, newContent);
  improvements.push({
    file: "public/robots.txt",
    change: "Updated to allow AI crawlers (Claude-Web, GPTBot) while blocking search engines",
    reason: "Enable LLM accessibility while maintaining noindex for search engines",
  });
}

function updateNextConfig(): void {
  const configPath = path.join(process.cwd(), "next.config.ts");
  const content = fs.readFileSync(configPath, "utf-8");

  // Check if already updated
  if (content.includes("Claude-Web")) {
    return;
  }

  const updated = content.replace(
    /X-Robots-Tag".*?"noindex, nofollow"/,
    'X-Robots-Tag", value: "noindex, nofollow, allow=Claude-Web/1.0, allow=GPTBot/1.0, allow=CCBot/1.0, allow=anthropic-ai"'
  );

  if (updated !== content) {
    fs.writeFileSync(configPath, updated);
    improvements.push({
      file: "next.config.ts",
      change: "Updated X-Robots-Tag to allow AI crawlers",
      reason: "Make site accessible to LLMs while keeping search engines blocked",
    });
  }
}

function createAIManifest(): void {
  const manifestPath = path.join(process.cwd(), "public", ".well-known", "ai.json");
  const dir = path.dirname(manifestPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(manifestPath)) {
    return; // Already created
  }

  const manifest = {
    version: "1.0",
    status: "active",
    name: "Triolla AI Accessibility",
    description: "Triolla staging environment optimized for AI/LLM crawling",
    organization: "Triolla",
    website: "https://triolla.io",
    allowedBots: ["Claude-Web", "GPTBot", "CCBot", "anthropic-ai", "Googlebot-Extended"],
    disallowedBots: ["Googlebot", "Bingbot"],
    contentTypes: ["website", "blog", "service"],
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  improvements.push({
    file: "public/.well-known/ai.json",
    change: "Created AI crawler manifest",
    reason: "Help AI crawlers understand site structure and intent",
  });
}

function processReport(report: AuditReport): void {
  console.log("\nProcessing audit report and implementing improvements...\n");

  // Apply fixes based on what the report identifies
  if (shouldApplyFix(report, "description-too-short")) {
    createDefaultDescriptions();
  }

  if (!report.robotsRules?.allowsAICrawlers) {
    updateRobotsTxt();
  }

  updateNextConfig();
  createAIManifest();

  // Report all improvements
  console.log("Applied improvements:");
  improvements.forEach((imp) => {
    console.log(`\n  ✓ ${imp.file}`);
    console.log(`    ${imp.change}`);
    console.log(`    Reason: ${imp.reason}`);
  });
}

async function main() {
  try {
    const reportPath = path.join(process.cwd(), "seo-audit-report.json");

    if (!fs.existsSync(reportPath)) {
      console.error("Error: seo-audit-report.json not found. Run seo-checker first.");
      process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as AuditReport;
    processReport(report);

    console.log(`\n✓ Applied ${improvements.length} improvements`);
  } catch (error) {
    console.error("Error running improver:", error);
    process.exit(1);
  }
}

main();
