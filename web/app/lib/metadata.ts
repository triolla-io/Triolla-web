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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

/**
 * Generate Open Graph image URL
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
 * Predefined descriptions for common pages
 */
export const PAGE_DESCRIPTIONS = {
  en: {
    home: "#1 Product UX/UI design studio in Israel. We craft exceptional digital experiences.",
    about: "Meet Triolla - a team of experienced UX/UI designers dedicated to creating world-class digital products.",
    services:
      "Explore our comprehensive UX/UI design services including research, wireframing, prototyping, and design systems.",
    blog: "Insights and trends in UX/UI design, product strategy, and digital innovation.",
    contact: "Get in touch with our team for your next design project. Let's create something amazing together.",
  },
  he: {
    home: "סטודיו עיצוב UX/UI מובחר בישראל. אנחנו יוצרים חוויות דיגיטליות יוצאות דופן.",
    about: "הכירו את טריולה - צוות של מעצבי UX/UI בעלי ניסיון המוקדשים ליצור מוצרים דיגיטליים ברמה עולמית.",
    services:
      "גלו את שירותי עיצוב UX/UI שלנו כולל מחקר, תיאום, prototyping וקביעת מערכות עיצוב.",
    blog: "תובנות וטרנדים בעיצוב UX/UI, אסטרטגיה מוצר וחדשנות דיגיטלית.",
    contact: "צור קשר עם הצוות שלנו לפרויקט העיצוב הבא. בואו ניצור משהו מדהים ביחד.",
  },
};
