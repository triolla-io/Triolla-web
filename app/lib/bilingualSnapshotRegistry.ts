import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";
import type { TriollaSnapshotRevealPreset } from "./mountTriollaSnapshotRevealStack";
import careersDepsEn from "../careers/careers-deps.json";
import careersDepsHe from "../careers/careers-he-deps.json";
import contactUsDepsEn from "../contact-us/contact-us-deps.json";
import contactUsDepsHe from "../contact-us/contact-us-he-deps.json";
import portfolioPageDeps from "../portfolio-page/portfolio-page-deps.json";
import dashboardDesignDeps from "../dashboard-design/dashboard-design-deps.json";
import serviceDetailDeps from "../service-detail/service-detail-deps.json";
import devDepsEn from "../dev/dev-deps.json";
import devDepsHe from "../dev/dev-he-deps.json";
import { DEPS_EN, DEPS_HE } from "./snapshotDeps";

export type BilingualSnapshotRegistryEntry = {
  depsEn: TriollaPortfolioSnapshotDeps;
  depsHe: TriollaPortfolioSnapshotDeps;
  fragmentUrlEn: string;
  pageLabel: string;
  landingSlugEn: string;
  assetDirEn: string;
  /** When true, Hebrew fragment URL, asset dir, and landing slug come from `heSnapshotPathsFromDeps(depsHe)`. */
  hePathsFromDeps: boolean;
  fragmentUrlHe?: string;
  landingSlugHe?: string;
  assetDirHe?: string;
  revealPreset?: TriollaSnapshotRevealPreset;
};

function entry(
  pageLabel: string,
  fragmentUrlEn: string,
  fragmentUrlHe: string,
  landingSlugEn: string,
  landingSlugHe: string,
  revealPreset?: TriollaSnapshotRevealPreset,
): BilingualSnapshotRegistryEntry {
  const base: BilingualSnapshotRegistryEntry = {
    depsEn: DEPS_EN,
    depsHe: DEPS_HE,
    fragmentUrlEn,
    fragmentUrlHe,
    pageLabel,
    landingSlugEn,
    landingSlugHe,
    assetDirEn: "_consolidated",
    assetDirHe: "_consolidated",
    hePathsFromDeps: false,
  };
  return revealPreset ? { ...base, revealPreset } : base;
}

/** Single source of truth: consolidated snapshot deps + explicit EN/HE fragment URLs. */
export const bilingualSnapshotRegistry = {
  "accessibility-statement": entry(
    "Accessibility statement",
    "/fragments/accessibility-statement-body.html",
    "/fragments/accessibility-statement-he-body.html",
    "triolla-io-accessibility-statement",
    "triolla-io-he-accessibility-statement",
  ),
  "privacy-policy": entry(
    "Privacy policy",
    "/fragments/privacy-policy-body.html",
    "/fragments/privacy-policy-he-body.html",
    "triolla-io-privacy-policy",
    "triolla-io-he-privacy-policy",
  ),
  "branding-studio": entry(
    "Branding studio",
    "/fragments/branding-studio-body.html",
    "/fragments/branding-studio-he-body.html",
    "triolla-io-branding-studio",
    "triolla-io-he-branding-studio",
  ),
  careers: {
    ...entry(
      "Careers",
      "/fragments/careers-body.html",
      "/fragments/careers-he-body.html",
      "triolla-io-careers",
      "triolla-io-he-careers",
    ),
    depsEn: careersDepsEn as TriollaPortfolioSnapshotDeps,
    depsHe: careersDepsHe as TriollaPortfolioSnapshotDeps,
    assetDirEn: "careers",
    assetDirHe: "careers-he",
  },
  "device-iot": entry(
    "Devices & IoT",
    "/fragments/device-iot-body.html",
    "/fragments/device-iot-he-body.html",
    "triolla-io-device-iot",
    "triolla-io-he-device-iot",
  ),
  "mobile-apps": entry(
    "Mobile apps",
    "/fragments/mobile-apps-body.html",
    "/fragments/mobile-apps-he-body.html",
    "triolla-io-mobile-apps",
    "triolla-io-he-mobile-apps",
  ),
  "contact-us": {
    ...entry(
      "Contact us",
      "/fragments/contact-us-body.html",
      "/fragments/contact-us-he-body.html",
      "triolla-io-contact-us",
      "triolla-io-he-contact-us",
    ),
    depsEn: contactUsDepsEn as TriollaPortfolioSnapshotDeps,
    depsHe: contactUsDepsHe as TriollaPortfolioSnapshotDeps,
    assetDirEn: "contact-us",
    assetDirHe: "contact-us-he",
  },
  dev: {
    ...entry(
      "Development",
      "/fragments/dev-body.html",
      "/fragments/dev-he-body.html",
      "triolla-io-dev",
      "triolla-io-he-dev",
    ),
    depsEn: devDepsEn as TriollaPortfolioSnapshotDeps,
    depsHe: devDepsHe as TriollaPortfolioSnapshotDeps,
    assetDirEn: "dev",
    assetDirHe: "dev-he",
  },
  b2b: entry(
    "B2B",
    "/fragments/b2b-body.html",
    "/fragments/b2b-he-body.html",
    "triolla-io-b2b",
    "triolla-io-he-b2b",
  ),
  "startups-tech": entry(
    "Startups & tech",
    "/fragments/startups-tech-body.html",
    "/fragments/startups-tech-he-body.html",
    "triolla-io-startups-tech",
    "triolla-io-he-startups-tech",
  ),
  "saas-platforms": entry(
    "SaaS platforms",
    "/fragments/saas-platforms-body.html",
    "/fragments/saas-platforms-he-body.html",
    "triolla-io-saas-platforms",
    "triolla-io-he-saas-platforms",
  ),
  "terms-of-use": entry(
    "Terms of use",
    "/fragments/terms-of-use-body.html",
    "/fragments/terms-of-use-body.html",
    "triolla-io-terms-of-use",
    "triolla-io-terms-of-use",
  ),
  "services-motion-design": entry(
    "Motion design",
    "/fragments/services-motion-design-body.html",
    "/fragments/services-motion-design-he-body.html",
    "triolla-io-services-motion-design",
    "triolla-io-services-motion-design-he",
  ),
  "services-prototyping": entry(
    "Prototyping",
    "/fragments/services-prototyping-body.html",
    "/fragments/services-prototyping-he-body.html",
    "triolla-io-services-prototyping",
    "triolla-io-services-prototyping-he",
  ),
  "services-front-end-dev": entry(
    "Front-end development",
    "/fragments/services-front-end-dev-body.html",
    "/fragments/services-front-end-dev-he-body.html",
    "triolla-io-services-front-end-dev",
    "triolla-io-services-front-end-dev-he",
  ),
  "services-ui-design": entry(
    "UI design",
    "/fragments/services-ui-design-body.html",
    "/fragments/services-ui-design-he-body.html",
    "triolla-io-services-ui-design",
    "triolla-io-services-ui-design-he",
  ),
  "services-creative-concept": entry(
    "Creative concept",
    "/fragments/services-creative-concept-body.html",
    "/fragments/services-creative-concept-body.html",
    "triolla-io-services-creative-concept",
    "triolla-io-services-creative-concept",
  ),
  "services-presentations": entry(
    "Presentations",
    "/fragments/services-presentations-body.html",
    "/fragments/services-presentations-he-body.html",
    "triolla-io-services-presentations",
    "triolla-io-services-presentations-he",
  ),
  "services-design-system-creation": entry(
    "Design system creation",
    "/fragments/services-design-system-creation-body.html",
    "/fragments/services-design-system-creation-he-body.html",
    "triolla-io-services-design-system-creation",
    "triolla-io-services-design-system-creation-he",
  ),
  "services-wireframing": entry(
    "Wireframing",
    "/fragments/services-wireframing-body.html",
    "/fragments/services-wireframing-he-body.html",
    "triolla-io-services-wireframing",
    "triolla-io-services-wireframing-he",
  ),
  services: {
    ...entry(
      "Services",
      "/fragments/services-body.html",
      "/fragments/services-he-body.html",
      "triolla-io-services",
      "triolla-io-services-he",
    ),
    /** Theme CSS targets `.page-template-page-service` (layout, blog strip, header). */
    depsEn: {
      ...DEPS_EN,
      bodyClass:
        "port_page_mod wp-singular page-template page-template-page-service page wp-theme-triolla",
    },
    depsHe: {
      ...DEPS_HE,
      bodyClass:
        "port_page_mod rtl wp-singular page-template page-template-page-service page wp-theme-triolla",
    },
  },
  "fintech-finance": entry(
    "Fintech & Finance",
    "/fragments/fintech-finance-body.html",
    "/fragments/fintech-finance-he-body.html",
    "triolla-io-fintech-finance",
    "triolla-io-fintech-finance-he",
  ),
  b2c: entry(
    "B2C",
    "/fragments/b2c-body.html",
    "/fragments/b2c-he-body.html",
    "triolla-io-b2c",
    "triolla-io-b2c-he",
  ),
  agritech: entry(
    "Agritech",
    "/fragments/agritech-body.html",
    "/fragments/agritech-he-body.html",
    "triolla-io-agritech",
    "triolla-io-agritech-he",
  ),
  gaming: entry(
    "Gaming",
    "/fragments/gaming-body.html",
    "/fragments/gaming-he-body.html",
    "triolla-io-gaming",
    "triolla-io-gaming-he",
  ),
  "cyber-security": entry(
    "Cyber Security",
    "/fragments/cyber-security-body.html",
    "/fragments/cyber-security-he-body.html",
    "triolla-io-cyber-security",
    "triolla-io-cyber-security-he",
  ),
  "medical-healthcare": entry(
    "Medical & Healthcare",
    "/fragments/medical-healthcare-body.html",
    "/fragments/medical-healthcare-he-body.html",
    "triolla-io-medical-healthcare",
    "triolla-io-medical-healthcare-he",
  ),
  technology: {
    ...entry(
      "Technology",
      "/fragments/technology-body.html",
      "/fragments/technology-he-body.html",
      "triolla-io-technology",
      "triolla-io-technology-he",
    ),
    /** Theme CSS/JS from consolidated mirror; page images live under `/assets/technology` (+ `-he`). */
    depsEn: DEPS_EN,
    depsHe: DEPS_HE,
    assetDirEn: "technology",
    assetDirHe: "technology-he",
  },
  "services-ai-automation": entry(
    "AI & Automation",
    "/fragments/services-ai-automation-body.html",
    "/fragments/services-ai-automation-body.html",
    "triolla-io-services-ai-automation",
    "triolla-io-services-ai-automation",
  ),
  "services-back-end-dev": entry(
    "Back-end development",
    "/fragments/services-back-end-dev-body.html",
    "/fragments/services-back-end-dev-body.html",
    "triolla-io-services-back-end-dev",
    "triolla-io-services-back-end-dev",
  ),
  "services-character-design": entry(
    "Character design",
    "/fragments/services-character-design-body.html",
    "/fragments/services-character-design-body.html",
    "triolla-io-services-character-design",
    "triolla-io-services-character-design",
  ),
  "services-logo-design": entry(
    "Logo design",
    "/fragments/services-logo-design-body.html",
    "/fragments/services-logo-design-body.html",
    "triolla-io-services-logo-design",
    "triolla-io-services-logo-design",
  ),
  "services-motion-design-old": entry(
    "Motion design (legacy)",
    "/fragments/services-motion-design-old-body.html",
    "/fragments/services-motion-design-old-body.html",
    "triolla-io-services-motion-design-old",
    "triolla-io-services-motion-design-old",
  ),
  "services-product-stars": entry(
    "Product stars",
    "/fragments/services-product-stars-body.html",
    "/fragments/services-product-stars-body.html",
    "triolla-io-services-product-stars",
    "triolla-io-services-product-stars",
  ),
  "services-product-ux-ui-design": entry(
    "Product UX/UI design",
    "/fragments/services-product-ux-ui-design-body.html",
    "/fragments/services-product-ux-ui-design-body.html",
    "triolla-io-services-product-ux-ui-design",
    "triolla-io-services-product-ux-ui-design",
  ),
  "services-user-testing": entry(
    "User testing",
    "/fragments/services-user-testing-body.html",
    "/fragments/services-user-testing-body.html",
    "triolla-io-services-user-testing",
    "triolla-io-services-user-testing",
  ),
  "services-ux-research": entry(
    "UX research",
    "/fragments/services-ux-research-body.html",
    "/fragments/services-ux-research-body.html",
    "triolla-io-services-ux-research",
    "triolla-io-services-ux-research",
  ),
  "dashboard-design": {
    ...entry(
      "Dashboard design",
      "/fragments/dashboard-design-body.html",
      "/fragments/dashboard-design-body.html",
      "triolla-io-dashboard-design",
      "triolla-io-dashboard-design",
    ),
    depsEn: dashboardDesignDeps as TriollaPortfolioSnapshotDeps,
    depsHe: dashboardDesignDeps as TriollaPortfolioSnapshotDeps,
    assetDirEn: "dashboard-design",
    assetDirHe: "dashboard-design",
  },
  "portfolio-page": {
    ...entry(
      "Portfolio",
      "/fragments/portfolio-page-body.html",
      "/fragments/portfolio-page-body.html",
      "triolla-io-portfolio-page",
      "triolla-io-portfolio-page",
    ),
    depsEn: portfolioPageDeps as TriollaPortfolioSnapshotDeps,
    depsHe: portfolioPageDeps as TriollaPortfolioSnapshotDeps,
    assetDirEn: "portfolio-page",
    assetDirHe: "portfolio-page",
  },
  "service-detail": {
    ...entry(
      "Service detail",
      "/fragments/service-detail-body.html",
      "/fragments/service-detail-body.html",
      "triolla-io-service-detail",
      "triolla-io-service-detail",
    ),
    depsEn: serviceDetailDeps as TriollaPortfolioSnapshotDeps,
    depsHe: serviceDetailDeps as TriollaPortfolioSnapshotDeps,
    assetDirEn: "service-detail",
    assetDirHe: "service-detail",
  },
};

export type BilingualSnapshotRegistryKey = keyof typeof bilingualSnapshotRegistry;

export const bilingualSnapshotRegistryTyped = bilingualSnapshotRegistry as Record<
  BilingualSnapshotRegistryKey,
  BilingualSnapshotRegistryEntry
>;
