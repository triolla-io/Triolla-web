"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { SAAS_PLATFORMS_PAGE_DATA_EN, SAAS_PLATFORMS_PAGE_DATA_HE } from "./saasPlatformsPageData";

export function SaasPlatformsClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? SAAS_PLATFORMS_PAGE_DATA_HE : SAAS_PLATFORMS_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/saas-platforms-he-deps.json" : "/saas-platforms-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
