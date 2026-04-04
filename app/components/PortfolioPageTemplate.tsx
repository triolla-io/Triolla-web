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
  /**
   * Triolla site chrome (ticker, `.header`, `.menutoggle`, `.hmenumob`, …).
   * Must be React-rendered (e.g. dangerouslySetInnerHTML); imperative insertBefore
   * into this container is cleared on the next re-render when phase becomes "ready".
   */
  triollaPortfolioChromeHtml?: string;
}

function assignRef<T>(r: Ref<T> | undefined, el: T | null): void {
  if (!r) return;
  if (typeof r === "function") r(el);
  else (r as MutableRefObject<T | null>).current = el;
}

export const PortfolioPageTemplate = forwardRef<
  HTMLDivElement,
  PortfolioPageTemplateProps
>(function PortfolioPageTemplate({ data, triollaPortfolioChromeHtml = "" }, ref) {
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
      data-triolla-snapshot="1"
      className={isRtl ? "main_container rtl" : "main_container"}
      dir={data.dir ?? "ltr"}
    >
      {triollaPortfolioChromeHtml ? (
        <div
          className="triolla-portfolio-chrome-root"
          data-triolla-portfolio-chrome="1"
          style={{ display: "contents" }}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: triollaPortfolioChromeHtml }}
        />
      ) : null}
      <style type="text/css">{`
        .portfolio_banner { background-color: ${data.bannerColor}; }
        .portfoli_lists ul li .protfolio_con { margin-top: 0 !important; }
        .portfoli_lists ul li { margin-top: 0 !important; }
        .portfoli_lists ul li .protfolio_img { bottom: -100px !important; opacity: 0 !important; }
        .portfoli_lists ul li .protfolio_img.show { bottom: 0px !important; opacity: 1 !important; }
        /* Why section: equal-height bordered cards (theme uses inline-block li; height:100% does not align rows). */
        .portfolio_why ul.pdesktp {
          display: flex !important;
          flex-wrap: wrap;
          align-items: stretch;
        }
        .portfolio_why ul.pdesktp > li {
          display: flex !important;
          flex-direction: column;
        }
        .portfolio_why ul.pdesktp > li .port_cyber_con {
          flex: 1 1 auto;
          display: flex !important;
          flex-direction: column;
          width: 100%;
          min-height: 0;
        }
        .portfolio_why ul.pdesktp > li .port_cyber_con_new {
          flex: 1 1 auto;
          width: 100%;
        }
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
