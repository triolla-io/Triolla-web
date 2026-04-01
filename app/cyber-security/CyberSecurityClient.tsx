"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { CYBER_SECURITY_PAGE_DATA_EN, CYBER_SECURITY_PAGE_DATA_HE } from "./cyberSecurityPageData";

export function CyberSecurityClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? CYBER_SECURITY_PAGE_DATA_HE : CYBER_SECURITY_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/cyber-security-he-deps.json" : "/cyber-security-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
