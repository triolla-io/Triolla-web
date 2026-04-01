/**
 * JSON-LD Structured Data Schemas for SEO
 * Reference: https://schema.org/
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://triolla.io";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Triolla",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "#1 Product UX/UI design studio in Israel",
  foundingDate: "2010",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Sales",
    email: "hello@triolla.io",
  },
  sameAs: [
    "https://www.linkedin.com/company/triolla",
    "https://twitter.com/triollastudio",
    "https://www.instagram.com/triollastudio",
    "https://www.facebook.com/triolla.io",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Israeli address",
    addressLocality: "Israel",
    addressCountry: "IL",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Triolla",
  url: BASE_URL,
  telephone: "+1-555-123-4567", // Replace with actual phone
  address: {
    "@type": "PostalAddress",
    streetAddress: "Israeli address",
    addressLocality: "Israel",
    postalCode: "12345",
    addressCountry: "IL",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  image: `${BASE_URL}/og-image.png`,
  areaServed: ["IL", "US", "EU"],
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "UX/UI Design Services",
  provider: {
    "@type": "Organization",
    name: "Triolla",
    url: BASE_URL,
  },
  description: "Comprehensive UX/UI design services for digital products",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  serviceType: "Design",
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
};

export const articleSchema = (props: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: props.headline,
    description: props.description,
    image: props.image.startsWith("http")
      ? props.image
      : `${BASE_URL}${props.image}`,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      "@type": "Organization",
      name: props.author || "Triolla",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Triolla",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
};

export const faqSchema = (
  items: Array<{
    question: string;
    answer: string;
  }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};

export const productSchema = (props: {
  name: string;
  description: string;
  image: string;
  price?: string;
  currency?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: props.name,
    description: props.description,
    image: props.image.startsWith("http")
      ? props.image
      : `${BASE_URL}${props.image}`,
    brand: {
      "@type": "Brand",
      name: "Triolla",
    },
    offers: props.price
      ? {
          "@type": "Offer",
          url: BASE_URL,
          priceCurrency: props.currency || "USD",
          price: props.price,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
};

/**
 * Helper function to serialize JSON-LD schema for HTML script tag
 */
export function serializeSchema(schema: any): string {
  return JSON.stringify(schema);
}

/**
 * Get all common schemas combined
 */
export function getAllSchemas() {
  return [organizationSchema, localBusinessSchema, serviceSchema];
}
