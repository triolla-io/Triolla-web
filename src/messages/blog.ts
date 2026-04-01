import type { Locale } from "@/lib/i18n";

export const blogIndexCopy: Record<
  Locale,
  { title: string; boldText: string; shortText: string }
> = {
  en: {
    title: "Wisdom Hub",
    boldText: "Design it. Build it. Launch it.",
    shortText: "We're your dream team for UX/UI, front-end magic, and back-end brains.",
  },
  he: {
    title: "מרכז הידע",
    boldText: "לעצב. לבנות. להשיק.",
    shortText: "הצוות שחולם איתכם על UX/UI, קסם פרונט־אנד ומוחות בק־אנד.",
  },
};

export const blogPostUICopy: Record<
  Locale,
  {
    formHeading: string;
    moreArticles: string;
    browseAll: string;
    backToCategory: string;
  }
> = {
  en: {
    formHeading: "Ready to work together?",
    moreArticles: "More Articles",
    browseAll: "Browse all",
    backToCategory: "←",
  },
  he: {
    formHeading: "מוכנים לעבוד ביחד?",
    moreArticles: "עוד כתבות",
    browseAll: "לכל הפוסטים",
    backToCategory: "→",
  },
};
