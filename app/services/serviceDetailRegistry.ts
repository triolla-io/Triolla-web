import type { Metadata } from "next";
import type { ComponentType } from "react";
import { ServicesAiAutomationClient } from "../services-ai-automation/ServicesAiAutomationClient";
import { ServicesBackEndDevClient } from "../services-back-end-dev/ServicesBackEndDevClient";
import { ServicesCharacterDesignClient } from "../services-character-design/ServicesCharacterDesignClient";
import { ServicesCreativeConceptClient } from "../services-creative-concept/ServicesCreativeConceptClient";
import { ServicesDesignSystemCreationClient } from "../services-design-system-creation/ServicesDesignSystemCreationClient";
import { ServicesFrontEndDevClient } from "../services-front-end-dev/ServicesFrontEndDevClient";
import { ServicesLogoDesignClient } from "../services-logo-design/ServicesLogoDesignClient";
import { ServicesMotionDesignClient } from "../services-motion-design/ServicesMotionDesignClient";
import { ServicesMotionDesignOldClient } from "../services-motion-design-old/ServicesMotionDesignOldClient";
import { ServicesPresentationsClient } from "../services-presentations/ServicesPresentationsClient";
import { ServicesProductStarsClient } from "../services-product-stars/ServicesProductStarsClient";
import { ServicesProductUxUiDesignClient } from "../services-product-ux-ui-design/ServicesProductUxUiDesignClient";
import { ServicesPrototypingClient } from "../services-prototyping/ServicesPrototypingClient";
import { ServicesUiDesignClient } from "../services-ui-design/ServicesUiDesignClient";
import { ServicesUserTestingClient } from "../services-user-testing/ServicesUserTestingClient";
import { ServicesUxResearchClient } from "../services-ux-research/ServicesUxResearchClient";
import { ServicesWireframingClient } from "../services-wireframing/ServicesWireframingClient";

export type ServiceDetailSlug = keyof typeof SERVICE_DETAILS;

export type ServiceDetailEntry = {
  metaEn: Metadata;
  metaHe?: Metadata;
  hasHebrew: boolean;
  Client: ComponentType<{ lang?: "en" | "he" }>;
};

/** Canonical URLs: /services/<slug> (e.g. /services/front-end-dev). */
export const SERVICE_DETAILS = {
  "ai-automation": {
    metaEn: {
      title: "AI & Automation Services | Triolla",
      description:
        "AI-powered UX and automation: intelligent analysis, workflows, and product intelligence.",
    },
    hasHebrew: false,
    Client: ServicesAiAutomationClient,
  },
  "back-end-dev": {
    metaEn: {
      title: "Back-End Development Services | Triolla",
      description:
        "Back-end development services that support scalable, secure product infrastructure.",
    },
    hasHebrew: false,
    Client: ServicesBackEndDevClient,
  },
  "character-design": {
    metaEn: {
      title: "Character Design Services | Triolla",
      description: "Character design for products, brands, and campaigns.",
    },
    hasHebrew: false,
    Client: ServicesCharacterDesignClient,
  },
  "creative-concept": {
    metaEn: {
      title: "Creative Concept Services | Triolla",
      description: "Creative concept development for digital products and campaigns.",
    },
    metaHe: {
      title: "קונספט יצירתי | טריולה",
      description: "פיתוח קונספט ויזואלי למוצר.",
    },
    hasHebrew: true,
    Client: ServicesCreativeConceptClient,
  },
  "design-system-creation": {
    metaEn: {
      title: "Design System Creation | Triolla",
      description:
        "Design system creation: tokens, components, and documentation for product teams.",
    },
    metaHe: {
      title: "יצירת מערכת עיצוב | טריולה",
      description: "בניית מערכות עיצוב וקומפוננטים.",
    },
    hasHebrew: true,
    Client: ServicesDesignSystemCreationClient,
  },
  "front-end-dev": {
    metaEn: {
      title: "Front-End Development Services | Triolla",
      description: "Front-end development with modern frameworks and design-quality UI.",
    },
    metaHe: {
      title: "פיתוח Front-End | טריולה",
      description: "פיתוח צד לקוח עם ממשק איכותי.",
    },
    hasHebrew: true,
    Client: ServicesFrontEndDevClient,
  },
  "logo-design": {
    metaEn: {
      title: "Logo Design Services | Triolla",
      description: "Logo design and visual identity foundations for technology brands.",
    },
    hasHebrew: false,
    Client: ServicesLogoDesignClient,
  },
  "motion-design": {
    metaEn: {
      title: "Motion Design Services | Triolla",
      description: "Motion design for interfaces, marketing, and product storytelling.",
    },
    metaHe: {
      title: "עיצוב מושן | טריולה",
      description: "אנימציה ומושן לממשקים.",
    },
    hasHebrew: true,
    Client: ServicesMotionDesignClient,
  },
  "motion-design-old": {
    metaEn: {
      title: "Motion Design Services | Triolla",
      description: "Motion design for digital products and brand experiences.",
    },
    hasHebrew: false,
    Client: ServicesMotionDesignOldClient,
  },
  presentations: {
    metaEn: {
      title: "Presentation Design Services | Triolla",
      description: "Presentation design for pitches, decks, and stakeholder storytelling.",
    },
    metaHe: {
      title: "שירותי מצגות | טריולה",
      description: "עיצוב מצגות ודקים.",
    },
    hasHebrew: true,
    Client: ServicesPresentationsClient,
  },
  "product-stars": {
    metaEn: {
      title: "Product Stars & Showcase | Triolla",
      description: "Product design highlights and showcase work from Triolla.",
    },
    hasHebrew: false,
    Client: ServicesProductStarsClient,
  },
  "product-ux-ui-design": {
    metaEn: {
      title: "Product UX/UI Design Services | Triolla",
      description: "End-to-end product UX and UI design for digital products.",
    },
    metaHe: {
      title: "עיצוב מוצר UX/UI | טריולה",
      description: "עיצוב חוויית משתמש וממשק למוצרים דיגיטליים.",
    },
    /** Hebrew route serves English snapshot until a dedicated HE fragment exists in the registry. */
    hasHebrew: true,
    Client: ServicesProductUxUiDesignClient,
  },
  prototyping: {
    metaEn: {
      title: "Prototyping Services | Triolla",
      description: "Interactive prototyping to validate flows before development.",
    },
    metaHe: {
      title: "אבות טיפוס | טריולה",
      description: "בניית אבות טיפוס אינטראקטיביים.",
    },
    hasHebrew: true,
    Client: ServicesPrototypingClient,
  },
  "ui-design": {
    metaEn: {
      title: "UI Design Services | Triolla",
      description: "User interface design systems, screens, and visual polish for products.",
    },
    metaHe: {
      title: "עיצוב ממשק (UI) | טריולה",
      description: "עיצוב ממשק משתמש למוצרים דיגיטליים.",
    },
    hasHebrew: true,
    Client: ServicesUiDesignClient,
  },
  "user-testing": {
    metaEn: {
      title: "User Testing Services | Triolla",
      description: "User testing and validation to de-risk product decisions.",
    },
    hasHebrew: false,
    Client: ServicesUserTestingClient,
  },
  "ux-research": {
    metaEn: {
      title: "UX Research Services | Triolla",
      description: "UX research: discovery, usability, and evidence for product decisions.",
    },
    metaHe: {
      title: "מחקר UX | טריולה",
      description: "מחקר חוויית משתמש: גילוי, שימושיות ותובנות להחלטות מוצר.",
    },
    hasHebrew: true,
    Client: ServicesUxResearchClient,
  },
  wireframing: {
    metaEn: {
      title: "Wireframing Services | Triolla",
      description: "Wireframing and information architecture for complex products.",
    },
    metaHe: {
      title: "שירותי ווירפריימינג | טריולה",
      description: "ווירפריימים ומבנה מוצר בעברית.",
    },
    hasHebrew: true,
    Client: ServicesWireframingClient,
  },
} as const satisfies Record<string, ServiceDetailEntry>;

export const SERVICE_DETAIL_SLUGS = Object.keys(SERVICE_DETAILS) as ServiceDetailSlug[];

export function getServiceDetail(slug: string): ServiceDetailEntry | undefined {
  return SERVICE_DETAILS[slug as ServiceDetailSlug];
}
