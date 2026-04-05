import * as fs from "fs";
import * as path from "path";

interface AuditReport {
  scores: Record<string, number>;
  pages: Array<{ url: string; metadataIssues: Array<{ type: string; severity: string }> }>;
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

function updateMetadataLib(): void {
  const libPath = path.join(process.cwd(), "app", "lib", "metadata.ts");
  let content = fs.readFileSync(libPath, "utf-8");

  // Enhance OG image generation with fallback
  const ogImageEnhancement = `export function generateOGImageUrl(
  title: string,
  description?: string,
  variant: "default" | "blog" = "default"
): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
    variant,
  });

  return \`\${BASE_URL}/api/og?\${params.toString()}\`;
}

/**
 * Get OG image URL with fallback to static image
 */
export function getOGImageUrl(imageUrl?: string): string {
  if (imageUrl?.startsWith("http")) return imageUrl;
  if (imageUrl) return \`\${BASE_URL}\${imageUrl}\`;
  return \`\${BASE_URL}/og-image.png\`;
}`;

  if (!content.includes("getOGImageUrl")) {
    content = content.replace(
      /export function generateOGImageUrl[\s\S]*?}\n}/,
      ogImageEnhancement
    );
    fs.writeFileSync(libPath, content);
    improvements.push({
      file: "app/lib/metadata.ts",
      change: "Added getOGImageUrl helper with fallback logic",
      reason: "Ensure OG images always have a valid URL",
    });
  }

  // Improve description templates
  const descriptionUpdate = content.replace(
    /export const PAGE_DESCRIPTIONS = \{[\s\S]*?\};/,
    `export const PAGE_DESCRIPTIONS = {
  en: {
    home: "#1 Product UX/UI design studio in Israel. We craft exceptional digital experiences for technology brands.",
    about: "Meet Triolla - an experienced UX/UI design team creating world-class digital products and experiences.",
    services: "Comprehensive UX/UI design services: UX research, UI design, prototyping, design systems, and more.",
    blog: "Design insights, UX trends, and product strategy from Triolla's expert design team.",
    contact: "Get in touch with our team. Let's create exceptional digital experiences together.",
  },
  he: {
    home: "סטודיו עיצוב UX/UI מובחר בישראל. אנחנו יוצרים חוויות דיגיטליות יוצאות דופן למותגי טק.",
    about: "הכירו את צוות טריולה - מעצבי UX/UI בעלי ניסיון היוצרים מוצרים דיגיטליים ברמה עולמית.",
    services: "שירותי עיצוב UX/UI מקיפים: מחקר UX, עיצוב UI, protyping, מערכות עיצוב ועוד.",
    blog: "תובנות עיצוב, טרנדים UX, ואסטרטגיית מוצר מצוות עיצוב מומחה.",
    contact: "צור קשר עם הצוות שלנו. בואו ניצור חוויות דיגיטליות חריגות ביחד.",
  },
};`
  );

  if (descriptionUpdate !== content) {
    fs.writeFileSync(libPath, descriptionUpdate);
    improvements.push({
      file: "app/lib/metadata.ts",
      change: "Optimized PAGE_DESCRIPTIONS for better clarity and length",
      reason: "Improve SEO relevance and character count",
    });
  }
}

function updateStructuredDataLib(): void {
  const libPath = path.join(process.cwd(), "app", "lib", "structured-data.ts");
  let content = fs.readFileSync(libPath, "utf-8");

  // Enhance Organization schema
  const organizationEnhanced = `export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Triolla",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/logo_triolla.svg"),
    description: "Product UX/UI design studio crafting digital experiences for technology brands.",
    sameAs: [
      "https://twitter.com/triollastudio",
      "https://www.linkedin.com/company/triolla",
      "https://www.instagram.com/triollastudio",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tel Aviv",
      addressCountry: "IL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: absoluteUrl("/contact-us"),
    },
  };
}`;

  if (!content.includes("contactPoint")) {
    content = content.replace(
      /export function organizationJsonLd[\s\S]*?\n}/,
      organizationEnhanced
    );
    fs.writeFileSync(libPath, content);
    improvements.push({
      file: "app/lib/structured-data.ts",
      change: "Enhanced Organization schema with social links, address, and contact",
      reason: "Improve LLM extraction and schema completeness",
    });
  }

  // Enhance WebSite schema
  const websiteEnhanced = `export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Triolla",
    url: absoluteUrl("/"),
    publisher: { "@type": "Organization", name: "Triolla", url: absoluteUrl("/") },
    inLanguage: ["en-US", "he-IL"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}`;

  if (!content.includes("potentialAction")) {
    content = content.replace(
      /export function websiteJsonLd[\s\S]*?\n}/,
      websiteEnhanced
    );
    fs.writeFileSync(libPath, content);
    improvements.push({
      file: "app/lib/structured-data.ts",
      change: "Enhanced WebSite schema with search action",
      reason: "Improve LLM comprehension of site capabilities",
    });
  }

  // Add service schema with image
  if (!content.includes("image:")) {
    const serviceEnhanced = `export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image && { image: input.image }),
    provider: {
      "@type": "Organization",
      name: "Triolla",
      url: absoluteUrl("/"),
    },
    areaServed: { "@type": "Country", name: "Israel" },
  };
}`;

    content = content.replace(
      /export function serviceJsonLd[\s\S]*?\n}/,
      serviceEnhanced
    );
    fs.writeFileSync(libPath, content);
    improvements.push({
      file: "app/lib/structured-data.ts",
      change: "Service schema now supports image field",
      reason: "Enable richer service data for LLMs",
    });
  }
}

function updateRobotsTxt(): void {
  const robotsPath = path.join(process.cwd(), "public", "robots.txt");
  const newContent = `# Allow AI crawlers while keeping search engines out (staging mode)
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

# Sitemap
Sitemap: https://triolla.io/sitemap.xml

# Crawl delay
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

  // Check if AI crawler allowance is already in place
  if (!content.includes("Claude-Web")) {
    const aiAllowPattern = `headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, allow=Claude-Web/1.0, allow=GPTBot/1.0, allow=CCBot/1.0, allow=anthropic-ai",
          },
        ],
      },
    ];
  },`;

    if (content.includes("headers:")) {
      // Replace existing headers
      const updated = content.replace(
        /headers:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\},/,
        aiAllowPattern
      );
      fs.writeFileSync(configPath, updated);
      improvements.push({
        file: "next.config.ts",
        change: "Updated X-Robots-Tag header to allow AI crawlers",
        reason: "Make site accessible to LLM crawlers while keeping search noindex",
      });
    }
  }
}

function createAIManifest(): void {
  const manifestPath = path.join(process.cwd(), "public", ".well-known", "ai.json");
  const dir = path.dirname(manifestPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

  // Update metadata lib
  updateMetadataLib();

  // Update structured data lib
  updateStructuredDataLib();

  // Update robots.txt
  updateRobotsTxt();

  // Update next.config.ts
  updateNextConfig();

  // Create AI manifest
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
