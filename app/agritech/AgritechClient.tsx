"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { AGRITECH_PAGE_DATA_EN, AGRITECH_PAGE_DATA_HE } from "./agritechPageData";

export function AgritechClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? AGRITECH_PAGE_DATA_HE : AGRITECH_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/agritech-he-deps.json" : "/agritech-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
