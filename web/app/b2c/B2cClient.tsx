"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { B2C_PAGE_DATA_EN, B2C_PAGE_DATA_HE } from "./b2cPageData";

export function B2cClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? B2C_PAGE_DATA_HE : B2C_PAGE_DATA_EN;
  const depsPath = lang === "he" ? "/b2c-he-deps.json" : "/b2c-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
