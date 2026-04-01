"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { B2B_PAGE_DATA_EN, B2B_PAGE_DATA_HE } from "./b2bPageData";

export function B2bClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? B2B_PAGE_DATA_HE : B2B_PAGE_DATA_EN;
  const depsPath = lang === "he" ? "/b2b-he-deps.json" : "/b2b-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
