"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type MutableRefObject,
  type Ref,
} from "react";
import { initTriollaConveyorTicker } from "../lib/initTriollaConveyorTicker";
import { PortfolioCompanyTicker } from "./PortfolioCompanyTicker";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioList } from "./PortfolioList";
import { PortfolioWhy } from "./PortfolioWhy";
import { PortfolioGlobal } from "./PortfolioGlobal";

export interface PortfolioPageData {
  /** Page text direction; Hebrew industry pages use `rtl`. */
  dir?: "ltr" | "rtl";
  header: {
    /** Line above the main title (e.g. “Product design for”). */
    eyebrow?: string;
    title: string;
    subtitle: string;
    description: string;
    expandedText: string;
    buttonText: string;
    buttonLink: string;
    bannerGridImg: string;
    bannerLayerImg: string;
    jumpImg1: string;
    jumpImg2: string;
    jumpImg3: string;
  };
  portfolioItems: Array<{
    logo: string;
    desktopImg: string;
    mobileImg: string;
    title: string;
    description: string;
    tags: string[];
  }>;
  why: {
    mainTitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  global: {
    title: string;
    subtitle: string;
    logos: Array<{
      img: string;
      alt: string;
    }>;
    buttonText: string;
    buttonLink: string;
  };
  bannerColor: string;
  partnerCount: string;
  /** Optional client-name marquee between hero and case studies (Triolla `.company_triker`). */
  companyTicker?: string[];
}

interface PortfolioPageTemplateProps {
  data: PortfolioPageData;
}

function assignRef<T>(r: Ref<T> | undefined, el: T | null): void {
  if (!r) return;
  if (typeof r === "function") r(el);
  else (r as MutableRefObject<T | null>).current = el;
}

export const PortfolioPageTemplate = forwardRef<
  HTMLDivElement,
  PortfolioPageTemplateProps
>(function PortfolioPageTemplate({ data }, ref) {
  const localRef = useRef<HTMLDivElement | null>(null);

  const setMainContainerRef = (el: HTMLDivElement | null) => {
    localRef.current = el;
    assignRef(ref, el);
  };

  useEffect(() => {
    if (!data.companyTicker?.length) return;
    let attempts = 0;
    const maxAttempts = 40;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      const el = localRef.current;
      const $ = (
        window as unknown as {
          jQuery?: { fn?: { jConveyorTicker?: unknown } };
        }
      ).jQuery;
      if (el && $?.fn?.jConveyorTicker) {
        initTriollaConveyorTicker(el);
        window.clearInterval(intervalId);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(intervalId);
      }
    }, 125);
    return () => window.clearInterval(intervalId);
  }, [data.companyTicker]);

  const isRtl = (data.dir ?? "ltr") === "rtl";

  return (
    <div
      ref={setMainContainerRef}
      className={isRtl ? "main_container rtl" : "main_container"}
      dir={data.dir ?? "ltr"}
    >
      <style type="text/css">{`
        .portfolio_banner { background-color: ${data.bannerColor}; }
        .portfoli_lists ul li .protfolio_con { margin-top: 0 !important; }
        .portfoli_lists ul li { margin-top: 0 !important; }
        .portfoli_lists ul li .protfolio_img { bottom: -100px !important; opacity: 0 !important; }
        .portfoli_lists ul li .protfolio_img.show { bottom: 0px !important; opacity: 1 !important; }
      `}</style>

      <PortfolioHeader {...data.header} />
      {data.companyTicker?.length ? (
        <PortfolioCompanyTicker names={data.companyTicker} />
      ) : null}
      <PortfolioList
        items={data.portfolioItems}
        buttonText={data.header.buttonText}
        buttonLink={data.header.buttonLink}
        partnerCount={data.partnerCount}
      />
      <PortfolioWhy {...data.why} />
      <PortfolioGlobal {...data.global} />
    </div>
  );
});
