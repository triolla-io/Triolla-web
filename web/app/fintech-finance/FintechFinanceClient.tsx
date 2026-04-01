"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { FINTECH_PAGE_DATA_EN, FINTECH_PAGE_DATA_HE } from "./fintechPageData";

export function FintechFinanceClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? FINTECH_PAGE_DATA_HE : FINTECH_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/fintech-finance-he-deps.json" : "/fintech-finance-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
