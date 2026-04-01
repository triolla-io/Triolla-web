"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { GAMING_PAGE_DATA_EN, GAMING_PAGE_DATA_HE } from "./gamingPageData";

export function GamingClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? GAMING_PAGE_DATA_HE : GAMING_PAGE_DATA_EN;
  const depsPath = lang === "he" ? "/gaming-he-deps.json" : "/gaming-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
