import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://triolla.io";

export interface PageMetadataProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  lang?: "en" | "he";
  ogType?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate comprehensive metadata for pages with Open Graph, Twitter Cards, and canonical URLs
 */
export function generatePageMetadata({
  title,
  description,
  path = "/",
  image = "/og-image.png",
  lang = "en",
  ogType = "website",
  author,
  publishedTime,
  modifiedTime,
}: PageMetadataProps): Metadata {
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const isHebrew = lang === "he";

  return {
    title,
    description,
    keywords: isHebrew
      ? ["ריוקס", "עיצוב UX", "עיצוב UI", "תיוקל", "אתרים", "אפליקציות"]
      : ["UX design", "UI design", "design studio", "product design", "website design"],
    authors: author ? [{ name: author }] : undefined,
    creator: "Triolla",
    publisher: "Triolla",
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${BASE_URL}${path}`,
        he: `${BASE_URL}/he${path}`,
        "x-default": `${BASE_URL}${path}`,
      },
    },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      title,
      description,
      siteName: "Triolla",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
        {
          url: fullImageUrl,
          width: 800,
          height: 600,
          alt: title,
          type: "image/png",
        },
      ],
      locale: isHebrew ? "he_IL" : "en_US",
      ...(ogType === "article" &&
        publishedTime && {
          publishedTime,
          modifiedTime: modifiedTime || publishedTime,
          authors: author ? [author] : undefined,
        }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      site: "@triollastudio",
      creator: "@triollastudio",
    },
    robots:
      {
        index: false,
        follow: false,
      },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

/**
 * Generate Open Graph image URL for dynamic OG generation
 */
export function generateOGImageUrl(
  title: string,
  description?: string,
  variant: "default" | "blog" = "default"
): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
    variant,
  });

  return `${BASE_URL}/api/og?${params.toString()}`;
}

/**
 * Get OG image URL with fallback to static image
 */
export function getOGImageUrl(imageUrl?: string): string {
  if (imageUrl?.startsWith("http")) return imageUrl;
  if (imageUrl) return `${BASE_URL}${imageUrl}`;
  return `${BASE_URL}/og-image.png`;
}

/**
 * Common SEO keywords by page type
 */
export const SEO_KEYWORDS = {
  en: {
    general: ["UX design", "UI design", "design studio", "product design"],
    services: ["design services", "UX/UI design", "product design services"],
    blog: ["design tips", "UX insights", "design trends"],
    company: ["about us", "design agency", "design company"],
  },
  he: {
    general: ["עיצוב UX", "עיצוב UI", "סטודיו עיצוב", "עיצוב מוצרים"],
    services: ["שירותי עיצוב", "עיצוב UX/UI", "שירותי עיצוב מוצרים"],
    blog: ["טיפים לעיצוב", "תובנות UX", "טרנדים בעיצוב"],
    company: ["אודות", "סוכנות עיצוב", "חברת עיצוב"],
  },
};

/**
 * Generate metadata for blog articles with proper article schema
 */
export function generateArticleMetadata({
  title,
  description,
  path = "/blog",
  image = "/og-image.png",
  publishedTime,
  modifiedTime,
  author = "Triolla",
}: PageMetadataProps & {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Metadata {
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    ...generatePageMetadata({
      title,
      description,
      path,
      image,
      lang: "en",
      ogType: "article",
      author,
      publishedTime,
      modifiedTime,
    }),
    openGraph: {
      ...generatePageMetadata({ title, description, path, image, lang: "en", ogType: "article" }).openGraph,
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: author ? [author] : undefined,
    },
  };
}

/**
 * Hebrew blog post under `/he/blog/*` with canonical `/he/blog/...` and hreflang to the English twin.
 */
export function generateHebrewBlogPostMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  author = "Triolla",
}: {
  title: string;
  description: string;
  /** English content path, e.g. `/blog/my-slug` */
  path: string;
  image?: string;
  author?: string;
}): Metadata {
  const canonicalPath = `/he${path}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const enUrl = `${BASE_URL}${path}`;

  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS.he.blog],
    authors: [{ name: author }],
    creator: "Triolla",
    publisher: "Triolla",
    formatDetection: { email: false, telephone: false, address: false },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": enUrl,
        he: canonicalUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: "Triolla",
      images: [
        { url: fullImageUrl, width: 1200, height: 630, alt: title, type: "image/png" },
        { url: fullImageUrl, width: 800, height: 600, alt: title, type: "image/png" },
      ],
      locale: "he_IL",
      alternateLocale: ["en_US"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      site: "@triollastudio",
      creator: "@triollastudio",
    },
    robots: { index: false, follow: false },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

/**
 * Predefined descriptions for common pages (150-160 chars optimal for SEO)
 */
export const PAGE_DESCRIPTIONS = {
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
