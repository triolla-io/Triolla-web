const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://triolla.io";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL.replace(/\/$/, "")}${p}`;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Triolla",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/logo_triolla.svg"),
    description:
      "Product UX/UI design studio crafting digital experiences for technology brands.",
    sameAs: [
      "https://twitter.com/triollastudio",
      "https://www.linkedin.com/company/triolla",
      "https://www.instagram.com/triollastudio",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
      addressLocality: "Tel Aviv",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: absoluteUrl("/contact-us"),
    },
  };
}

export function websiteJsonLd(): Record<string, unknown> {
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
        urlTemplate: absoluteUrl("/blog?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbListJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostingJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  inLanguage: "en" | "he";
}): Record<string, unknown> {
  const publisher = {
    "@type": "Organization",
    name: "Triolla",
    logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo_triolla.svg") },
  };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    publisher,
    author: { "@type": "Organization", name: "Triolla" },
    inLanguage: input.inLanguage === "he" ? "he-IL" : "en-US",
    ...(input.image && { image: [input.image] }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
  };
}

export function serviceJsonLd(input: {
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
}
