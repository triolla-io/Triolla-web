"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { MOBILE_APPS_PAGE_DATA_EN, MOBILE_APPS_PAGE_DATA_HE } from "./mobileAppsPageData";

export function MobileAppsClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? MOBILE_APPS_PAGE_DATA_HE : MOBILE_APPS_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/mobile-apps-he-deps.json" : "/mobile-apps-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
