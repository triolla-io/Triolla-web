"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { STARTUPS_TECH_PAGE_DATA_EN, STARTUPS_TECH_PAGE_DATA_HE } from "./startupsTechPageData";

export function StartupsTechClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? STARTUPS_TECH_PAGE_DATA_HE : STARTUPS_TECH_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/startups-tech-he-deps.json" : "/startups-tech-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
