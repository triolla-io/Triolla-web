"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { localeFromPathname, withLocalePrefix, alternateLocalePath } from "@/lib/i18n";
import { shouldHideSiteChromeForPath } from "@/lib/snapshotFullPagePaths";
import { common, portfolioCol1Keys, portfolioCol2Keys } from "@/messages/common";

/** Normalize for comparison (Next pathname usually has no trailing slash). */
function normalizePath(p: string): string {
  if (!p) return "/";
  const t = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  return t || "/";
}

function pathMatches(pathname: string, href: string): boolean {
  return normalizePath(pathname) === normalizePath(href);
}

/** e.g. /services/back-end-dev matches /services/ */
function pathMatchesSection(pathname: string, href: string): boolean {
  const p = normalizePath(pathname);
  const h = normalizePath(href);
  if (p === h) return true;
  if (h === "/") return false;
  return p.startsWith(`${h}/`);
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  if (shouldHideSiteChromeForPath(pathname)) {
    return null;
  }
  const locale = localeFromPathname(pathname);
  const isHebrew = locale === "he";
  const t = common[locale];

  const portfolioCol1 = useMemo(
    () =>
      portfolioCol1Keys.map(({ key, href }) => ({
        label: t.portfolioItems[key],
        href: withLocalePrefix(href, locale),
      })),
    [locale, t]
  );
  const portfolioCol2 = useMemo(
    () =>
      portfolioCol2Keys.map(({ key, href }) => ({
        label: t.portfolioItems[key],
        href: withLocalePrefix(href, locale),
      })),
    [locale, t]
  );
  const navLinks = useMemo(
    () =>
      [
        { label: t.services, href: withLocalePrefix("/services/", locale) },
        { label: t.technology, href: withLocalePrefix("/technology/", locale) },
        { label: t.theCompany, href: withLocalePrefix("/about-us/", locale) },
      ] as const,
    [locale, t]
  );

  const portfolioAll = useMemo(() => [...portfolioCol1, ...portfolioCol2], [portfolioCol1, portfolioCol2]);
  const isPortfolioPage = portfolioAll.some((item) => pathMatches(pathname, item.href));

  const { en: pathEn, he: pathHe } = useMemo(
    () => alternateLocalePath(pathname),
    [pathname]
  );

  const [tickerVisible, setTickerVisible] = useState(true);
  const [isSticky, setIsSticky]           = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const lastScrollY = useRef(0);

  /** Current page in drawer — black + underline (readable on yellow) */
  const mobileNavActive = "font-bold underline decoration-2 underline-offset-4";

  /* scroll direction → sticky */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 60) setIsSticky(true);
      else if (y < lastScrollY.current)       setIsSticky(false);
      lastScrollY.current = Math.max(0, y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Open Portfolio accordion on mobile when current route is a portfolio page */
  useEffect(() => {
    if (mobileOpen && isPortfolioPage) setMobilePortfolioOpen(true);
  }, [mobileOpen, isPortfolioPage]);

  useEffect(() => {
    if (!mobileOpen) setMobilePortfolioOpen(false);
  }, [mobileOpen]);

  return (
    <>
      {/* ── TICKER ─────────────────────────────────────────── */}
      {tickerVisible && (
        <div className={`headerticker${isSticky ? " is-hidden" : ""}`}>
          <ul><li>{t.ticker}</li></ul>
          <button className="tickclose" onClick={() => setTickerVisible(false)} aria-label={t.closeTicker}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M7.877 6.578L12.57 1.885a1 1 0 00-1.414-1.413L6.564 5.265 1.676.377A1 1 0 00.262 1.69L5.15 6.578.558 11.271a1 1 0 001.414 1.414l4.58-4.58 4.51 4.511a1 1 0 001.414-1.414L7.877 6.578z" fill="white"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── HEADER PILL ────────────────────────────────────── */}
      <header
        className={`site-header${isSticky ? " is-sticky" : ""}${tickerVisible && !isSticky ? " ticker-visible" : ""}`}
      >
        <div className="header_in">

          {/* Logo */}
          <div className="logo">
            <Link href={withLocalePrefix("/", locale)}>
              <Image
                src="/images/logo_new.png"
                alt="Triolla"
                width={79}
                height={38}
                priority
                className="h-[20px] w-auto min-[768px]:h-[37px] max-[1023px]:brightness-0"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="header_menu">
            <ul className="menu">

              {/* Portfolio — bigmenu with dropdown */}
              <li
                className="relative"
                onMouseEnter={() => setPortfolioOpen(true)}
                onMouseLeave={() => setPortfolioOpen(false)}
              >
                <button
                  type="button"
                  className={isPortfolioPage ? "font-semibold text-[#FED125]" : ""}
                >
                  {t.portfolio}
                  <svg style={{ display:"inline-block", marginLeft:5, verticalAlign:"middle", transition:"transform 0.2s", transform: portfolioOpen ? "rotate(180deg)" : "rotate(0)" }} width="12" height="7" viewBox="0 0 12 7" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* invisible bridge so mouse can travel from nav pill to dropdown without triggering mouseleave */}
                <div className="absolute top-full left-0 right-0 h-[52px]" />

                <div
                  className={`absolute top-[calc(100%+50px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[200] overflow-hidden max-w-[min(800px,calc(100vw-32px))] ${portfolioOpen ? "grid grid-cols-[1fr_1fr_380px] w-[800px] max-[1299px]:grid-cols-[1fr_1fr] max-[1299px]:w-[min(380px,calc(100vw-32px))]" : "hidden"}`}
                >
                  <div className="py-[30px] px-5 pl-9 text-left">
                    {portfolioCol1.map((item) => {
                      const active = pathMatches(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPortfolioOpen(false)}
                          className={`block text-[20px] font-[510] leading-[41px] whitespace-nowrap transition-colors duration-150 hover:text-[#3088EF] ${
                            active ? "text-[#3088EF] font-semibold" : "text-black"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="py-[30px] px-5 pl-9 text-left">
                    {portfolioCol2.map((item) => {
                      const active = pathMatches(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPortfolioOpen(false)}
                          className={`block text-[20px] font-[510] leading-[41px] whitespace-nowrap transition-colors duration-150 hover:text-[#3088EF] ${
                            active ? "text-[#3088EF] font-semibold" : "text-black"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="bg-[url('/images/menu-image2.png')] bg-center bg-cover max-[1299px]:hidden" />
                </div>
              </li>

              {navLinks.map((link) => {
                const active = pathMatchesSection(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={active ? "font-semibold text-[#FED125]" : ""}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right buttons */}
          <div className="header_right">
            <div className="header_contact">
              <Link href={withLocalePrefix("/contact-us/", locale)}>
                <span className="header-contact-text-wrap">
                  <span className="header-contact-base">{t.contactUs}</span>
                </span>
              </Link>
            </div>

            <div className="header_whatsapp">
              <a href="https://api.whatsapp.com/send/?phone=972525956644&text=Hello%2C+I%27d+like+to+learn+more...&app_absent=0" target="_blank" rel="noopener noreferrer" aria-label={t.whatsappLabel}>
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#wa-clip)">
                    <path d="M22.5 45.0017C10.0755 45.0017 0 34.9262 0 22.5017C0 10.0772 10.0755 0.00170898 22.5 0.00170898C34.9245 0.00170898 45 10.0772 45 22.5017C45 34.9262 34.9245 45.0017 22.5 45.0017Z" fill="#25D366"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M33.0273 12.034C30.2373 9.23955 26.5202 7.70054 22.5647 7.69604C14.4152 7.69604 7.77775 14.329 7.77775 22.483C7.77775 25.0885 8.45725 27.6355 9.75325 29.8765L7.65625 37.54L15.4952 35.4835C17.6552 36.6625 20.0852 37.2835 22.5602 37.2835H22.5647C30.7142 37.2835 37.3472 30.6505 37.3517 22.4965C37.3563 18.5455 35.8218 14.8285 33.0273 12.034ZM22.5692 34.786H22.5647C20.3597 34.786 18.1952 34.192 16.3097 33.0715L15.8597 32.806L11.2067 34.0255L12.4488 29.4895L12.1562 29.026C10.9277 27.0685 10.2752 24.8095 10.2752 22.483C10.2797 15.706 15.7922 10.1935 22.5737 10.1935C25.8587 10.1935 28.9412 11.476 31.2632 13.798C33.5852 16.12 34.8632 19.2115 34.8587 22.492C34.8587 29.2735 29.3417 34.786 22.5692 34.786ZM29.3102 25.579C28.9412 25.3945 27.1232 24.499 26.7857 24.3775C26.4482 24.256 26.2008 24.193 25.9532 24.562C25.7057 24.931 24.9993 25.7635 24.7832 26.011C24.5672 26.2585 24.3512 26.29 23.9823 26.1055C23.6132 25.921 22.4207 25.5295 21.0122 24.2695C19.9142 23.2885 19.1718 22.078 18.9557 21.709C18.7397 21.34 18.9332 21.1375 19.1177 20.953C19.2842 20.7865 19.4867 20.521 19.6712 20.305C19.8557 20.089 19.9187 19.936 20.0402 19.6885C20.1617 19.441 20.1032 19.225 20.0087 19.0405C19.9142 18.856 19.1762 17.038 18.8702 16.2955C18.5687 15.5755 18.2672 15.6745 18.0377 15.661C17.8217 15.652 17.5742 15.6475 17.3312 15.6475C17.0837 15.6475 16.6832 15.742 16.3457 16.111C16.0083 16.48 15.0542 17.3755 15.0542 19.1935C15.0542 21.0115 16.3772 22.771 16.5617 23.014C16.7462 23.2615 19.1672 26.992 22.8752 28.594C23.7572 28.9765 24.4457 29.2015 24.9812 29.3725C25.8677 29.656 26.6732 29.6155 27.3077 29.521C28.0187 29.413 29.4947 28.6255 29.8007 27.766C30.1067 26.902 30.1067 26.164 30.0167 26.011C29.9267 25.858 29.6792 25.768 29.3102 25.579Z" fill="white"/>
                  </g>
                  <defs><clipPath id="wa-clip"><rect width="45" height="45" fill="white"/></clipPath></defs>
                </svg>
              </a>
            </div>

            <div className="header_book">
              <a href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.614 2.458V3.073c-.011.545-.89.856-1.17.26a.63.63 0 01-.039-.26V2.458H5.544c-.473-.023-.789-.641-.464-1.017C5.192 1.312 5.282 1.242 5.544 1.229c.613 0 1.228-.002 1.842-.005V.615C7.388.514 7.398.482 7.417.422A.81.81 0 018.012 0c.328.013.607.258.614.615V1.216c1.228-.007 2.456-.014 3.685-.008V.615c.006-.329.245-.601.601-.615.008 0 .016 0 .025 0 .328.013.606.258.613.615v.604c.22.003.44.007.66.01.94.03 1.778.84 1.796 1.821.023 3.703.023 7.406 0 11.11-.017.95-.839 1.802-1.819 1.82-4.109.026-8.217.026-12.326 0C.89 15.963.036 15.157.018 14.16c-.023-3.703-.023-7.406 0-11.11C.035 2.093.854 1.236 1.858 1.229h.616V.615C2.475.514 2.485.482 2.504.422A.81.81 0 013.1 0c.328.013.606.258.613.615V3.073c-.01.545-.867.85-1.157.284a.664.664 0 01-.047-.284V2.456c-.21-.001-.42-.001-.63 0-.312.01-.589.283-.598.6C.904 6.755.903 10.455.992 14.152c.01.313.282.59.598.6 4.103.076 8.21.076 12.312 0 .312-.01.589-.283.598-.6.069-3.697.069-7.397 0-11.094-.01-.318-.294-.597-.621-.6H12.3V3.073c-.01.54-.868.845-1.16.283a.664.664 0 01-.047-.283V2.458H8.614z" fill="white"/>
                </svg>
                {t.bookACall}
              </a>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className={`menutoggle${isHebrew ? " is-he" : ""}`}
              onClick={() => setMobileOpen(true)}
              aria-label={t.openMenu}
              style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}
            >
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                <rect y="0"  width="24" height="2" rx="1" fill="currentColor"/>
                <rect y="8"  width="24" height="2" rx="1" fill="currentColor"/>
                <rect y="16" width="24" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* ── MOBILE MENU ────────────────────────────────────── */}
      <div className={`hmenumob${mobileOpen ? " open" : ""}${isHebrew ? " is-he" : ""}`}>
        <div className="hmenumobclose">
          <button type="button" onClick={() => setMobileOpen(false)} aria-label={t.closeMenu}>
            <Image src="/images/togleclose.svg" alt="" width={18} height={18} />
          </button>
        </div>

        {/* Main nav — mockup: solid yellow, one Portfolio block + flat sub-links, then Services / Technology / Company */}
        <div className="hmenumobdiv">
          <div className="menu-header-menu-container">
            <ul className="menu">
              <li
                className={`bigmenu menu-item-has-children${mobilePortfolioOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className={`mobnav-row${mobilePortfolioOpen ? " is-open" : ""}${isPortfolioPage ? ` ${mobileNavActive}` : ""}`}
                  onClick={() => setMobilePortfolioOpen((v) => !v)}
                  aria-expanded={mobilePortfolioOpen}
                >
                  <span>{t.portfolio}</span>
                  <span className="marrow" aria-hidden />
                </button>
                <ul className="sub-menu sub-menu--portfolio-flat">
                  {portfolioAll.map((item) => {
                    const active = pathMatches(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={active ? mobileNavActive : ""}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {navLinks.map((link) => {
                const active = pathMatchesSection(pathname, link.href);
                return (
                  <li key={link.href} className="menu-item">
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`mobnav-link${active ? ` ${mobileNavActive}` : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Secondary nav — Blog + Career (mirrors WP hmobmenubot) */}
        <div className="hmobmenubot">
          <ul>
            <li>
              <Link
                className="hmenumob-lang"
                href={locale === "en" ? pathHe : pathEn}
                hrefLang={locale === "en" ? "he" : "en"}
                lang={locale === "en" ? "he" : "en"}
                onClick={() => setMobileOpen(false)}
              >
                {locale === "en" ? t.langHe : t.langEn}
              </Link>
            </li>
            <li>
              <Link
                href={withLocalePrefix("/blog/", locale)}
                onClick={() => setMobileOpen(false)}
                className={pathMatchesSection(pathname, withLocalePrefix("/blog/", locale)) ? mobileNavActive : ""}
                aria-current={pathMatchesSection(pathname, withLocalePrefix("/blog/", locale)) ? "page" : undefined}
              >
                {t.blog}
              </Link>
            </li>
            <li>
              <Link
                href={withLocalePrefix("/careers/", locale)}
                onClick={() => setMobileOpen(false)}
                className={pathMatches(pathname, withLocalePrefix("/careers/", locale)) ? mobileNavActive : ""}
                aria-current={pathMatches(pathname, withLocalePrefix("/careers/", locale)) ? "page" : undefined}
              >
                {t.career}
              </Link>
            </li>
          </ul>
        </div>

        <div className="hmobmbuts">
          <div className="hmobbutlftb">
            <a href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.614 2.458V3.073c-.011.545-.89.856-1.17.26a.63.63 0 01-.039-.26V2.458H5.544c-.473-.023-.789-.641-.464-1.017C5.192 1.312 5.282 1.242 5.544 1.229c.613 0 1.228-.002 1.842-.005V.615C7.388.514 7.398.482 7.417.422A.81.81 0 018.012 0c.328.013.607.258.614.615V1.216c1.228-.007 2.456-.014 3.685-.008V.615c.006-.329.245-.601.601-.615.008 0 .016 0 .025 0 .328.013.606.258.613.615v.604c.22.003.44.007.66.01.94.03 1.778.84 1.796 1.821.023 3.703.023 7.406 0 11.11-.017.95-.839 1.802-1.819 1.82-4.109.026-8.217.026-12.326 0C.89 15.963.036 15.157.018 14.16c-.023-3.703-.023-7.406 0-11.11C.035 2.093.854 1.236 1.858 1.229h.616V.615C2.475.514 2.485.482 2.504.422A.81.81 0 013.1 0c.328.013.606.258.613.615V3.073c-.01.545-.867.85-1.157.284a.664.664 0 01-.047-.284V2.456c-.21-.001-.42-.001-.63 0-.312.01-.589.283-.598.6C.904 6.755.903 10.455.992 14.152c.01.313.282.59.598.6 4.103.076 8.21.076 12.312 0 .312-.01.589-.283.598-.6.069-3.697.069-7.397 0-11.094-.01-.318-.294-.597-.621-.6H12.3V3.073c-.01.54-.868.845-1.16.283a.664.664 0 01-.047-.283V2.458H8.614z" fill="white"/>
              </svg>
              {t.bookACall}
            </a>
          </div>
          <div className="hmobbutrsocl">
            <a href="tel:+972737443322" aria-label="Call us">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" fill="white"/>
              </svg>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=972525956644" target="_blank" rel="noopener noreferrer" aria-label={t.whatsappLabel}>
              <svg width="22" height="22" viewBox="0 0 45 45" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M33.027 12.034C30.237 9.24 26.52 7.7 22.565 7.696c-8.15 0-14.787 6.633-14.787 14.787 0 2.606.68 5.153 1.975 7.394L7.656 37.54l7.839-2.057a14.76 14.76 0 007.065 1.8h.005c8.15 0 14.782-6.633 14.787-14.787.004-3.951-1.53-7.668-4.325-10.462zM22.569 34.786h-.005a12.26 12.26 0 01-6.26-1.714l-.449-.266-4.653 1.22 1.242-4.536-.308-.463a12.241 12.241 0 01-1.878-6.532c.005-6.777 5.517-12.29 12.3-12.29 3.284 0 6.367 1.282 8.69 3.604s3.577 5.414 3.573 8.694c0 6.782-5.517 12.294-12.252 12.294zm6.74-9.207c-.37-.185-2.188-1.08-2.525-1.202-.337-.12-.584-.184-.832.185-.247.37-.956 1.202-1.172 1.449-.216.248-.432.279-.8.093-.37-.185-1.563-.577-2.972-1.837-1.097-.98-1.84-2.19-2.056-2.56-.216-.37-.023-.572.162-.756.167-.167.37-.432.554-.648.185-.216.247-.37.37-.617.123-.248.062-.463-.032-.648-.093-.185-.831-2.003-1.138-2.745-.3-.72-.602-.62-.831-.633-.216-.009-.463-.014-.707-.014-.247 0-.647.093-.985.463-.337.37-1.29 1.265-1.29 3.083 0 1.818 1.323 3.577 1.507 3.82.185.247 2.61 3.978 6.317 5.58.883.382 1.57.607 2.107.778.886.284 1.692.243 2.326.148.71-.108 2.186-.895 2.492-1.755.307-.863.307-1.602.216-1.755-.092-.153-.34-.243-.709-.428z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
