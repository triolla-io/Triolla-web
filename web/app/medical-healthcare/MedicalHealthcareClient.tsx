"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { MEDICAL_HEALTHCARE_PAGE_DATA_EN, MEDICAL_HEALTHCARE_PAGE_DATA_HE } from "./medicalHealthcarePageData";

export function MedicalHealthcareClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? MEDICAL_HEALTHCARE_PAGE_DATA_HE : MEDICAL_HEALTHCARE_PAGE_DATA_EN;
  const depsPath =
    lang === "he"
      ? "/medical-healthcare-he-deps.json"
      : "/medical-healthcare-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
