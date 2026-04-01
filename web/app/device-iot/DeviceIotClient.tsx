"use client";

import { PortfolioPageWithCSS } from "../components/PortfolioPageWithCSS";
import type { TriollaLangProps } from "../lib/triollaLangProps";
import { DEVICE_IOT_PAGE_DATA_EN, DEVICE_IOT_PAGE_DATA_HE } from "./deviceIotPageData";

export function DeviceIotClient({ lang = "en" }: TriollaLangProps) {
  const data = lang === "he" ? DEVICE_IOT_PAGE_DATA_HE : DEVICE_IOT_PAGE_DATA_EN;
  const depsPath =
    lang === "he" ? "/device-iot-he-deps.json" : "/device-iot-deps.json";
  return (
    <PortfolioPageWithCSS data={data} depsPath={depsPath} lang={lang} />
  );
}
