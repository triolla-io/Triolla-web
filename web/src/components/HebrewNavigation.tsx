"use client";

import { useEffect, useRef, useState } from "react";
import { rewriteTriollaNavLinks } from "@/app/lib/rewriteTriollaNavLinks";

export function HebrewNavigation() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const normalizeNavAssetPaths = (root: HTMLElement) => {
    const replacements: Record<string, string> = {
      "/assets/home-he/tickerxlose.svg": "/images/tickerxlose.svg",
      "/assets/home-he/logo_new.png": "/images/logo_triolla.svg",
      "/assets/home-he/hamburger.svg": "/images/hamburger.svg",
      "/assets/home-he/hamburger_white.svg": "/images/hamburger.svg",
      "/assets/home-he/togleclose.svg": "/images/togleclose.svg",
      "/assets/home-he/calenderimg.svg": "/images/calenderimg.svg",
      "/assets/home-he/phmobicon.svg": "/images/phmobicon.svg",
      "/assets/home-he/whatmobicon.svg": "/images/whatmobicon.svg",
    };

    let patched = 0;
    root.querySelectorAll("img[src]").forEach((node) => {
      const img = node as HTMLImageElement;
      const src = img.getAttribute("src") ?? "";
      const mapped = replacements[src];
      if (mapped && mapped !== src) {
        img.setAttribute("src", mapped);
        patched++;
      }
    });

    // #region agent log: normalized injected nav asset paths
    fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:30',message:'Nav asset normalization',data:{patched},timestamp:Date.now(),hypothesisId:'H7',runId:'post-fix'})}).catch(()=>{});
    // #endregion
  };

  useEffect(() => {
    if (!navRef.current) return;

    // #region agent log: mobile layout verification
    const ticker = navRef.current.querySelector(".headerticker");
    const header = navRef.current.querySelector(".header");
    const hamburger = navRef.current.querySelector(".menutoggle button");
    const isMobile = window.innerWidth <= 1023;
    if (isMobile && ticker && header && hamburger) {
      const tickerRect = ticker.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const hamburgerRect = hamburger.getBoundingClientRect();
      const logoSubtext = navRef.current.querySelector(".logo a span");
      const logoSubtextStyle = logoSubtext instanceof HTMLElement ? window.getComputedStyle(logoSubtext) : null;
      fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:14',message:'Mobile layout verification',data:{tickerTop:tickerRect.top,tickerHeight:tickerRect.height,headerTop:headerRect.top,headerHeight:headerRect.height,hamburgerTop:hamburgerRect.top,hamburgerLeft:hamburgerRect.left,hamburgerRight:hamburgerRect.right,viewportWidth:window.innerWidth},timestamp:Date.now(),hypothesisId:'layout',runId:'pre-fix'})}).catch(()=>{});
      // #region agent log: logo subtext visibility
      fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:23',message:'Logo subtext visibility',data:{exists:Boolean(logoSubtext),display:logoSubtextStyle?.display ?? null,visibility:logoSubtextStyle?.visibility ?? null,fontSize:logoSubtextStyle?.fontSize ?? null,lineHeight:logoSubtextStyle?.lineHeight ?? null,text:logoSubtext?.textContent?.trim() ?? null,isMobile},timestamp:Date.now(),hypothesisId:'H5',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
      // #region agent log: duplicate mobile chrome probe
      const allHeaders = document.querySelectorAll(".header");
      const allHamburgers = document.querySelectorAll(".menutoggle");
      const allBadges = document.querySelectorAll(".header_contact a");
      const allTicker = document.querySelectorAll(".headerticker");
      fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:29',message:'Duplicate chrome probe',data:{headers:allHeaders.length,hamburgers:allHamburgers.length,badges:allBadges.length,tickers:allTicker.length},timestamp:Date.now(),hypothesisId:'H6',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
    }
    // #endregion

    rewriteTriollaNavLinks(navRef.current);
    normalizeNavAssetPaths(navRef.current);

    const handleMenuToggle = () => {
      // #region agent log: hamburger click handler
      fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:31',message:'Hamburger handler fired',data:{isMobile:window.innerWidth<=1023,prevIsMenuOpen:isMenuOpen},timestamp:Date.now(),hypothesisId:'H1',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
      setIsMenuOpen((prev) => !prev);
    };

    const toggleBtn = navRef.current.querySelector(".menutoggle button");
    const closeBtn = navRef.current.querySelector(".hmenumobclose button");
    const mobileMenu = navRef.current.querySelector(".hmenumob");

    toggleBtn?.addEventListener("click", handleMenuToggle);
    closeBtn?.addEventListener("click", handleMenuToggle);

    // #region agent log: listener attachment + overlay probe
    const burgerRect = toggleBtn?.getBoundingClientRect();
    const probeX = burgerRect ? Math.floor((burgerRect.left + burgerRect.right) / 2) : null;
    const probeY = burgerRect ? Math.floor((burgerRect.top + burgerRect.bottom) / 2) : null;
    const topElement = probeX !== null && probeY !== null ? document.elementFromPoint(probeX, probeY) : null;
    fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:44',message:'Mobile menu pre-toggle state',data:{hasToggleBtn:Boolean(toggleBtn),hasCloseBtn:Boolean(closeBtn),menuClass:mobileMenu?.className,menuDisplay:mobileMenu?window.getComputedStyle(mobileMenu).display:null,menuTransform:mobileMenu?window.getComputedStyle(mobileMenu).transform:null,probeX,probeY,topElementTag:topElement?.tagName ?? null,topElementClass:(topElement as HTMLElement | null)?.className ?? null},timestamp:Date.now(),hypothesisId:'H2,H3',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    const tickClose = navRef.current.querySelector(".tickclose");
    tickClose?.addEventListener("click", () => {
      const header = navRef.current?.querySelector(".header");
      if (header) {
        header.classList.remove("headnewact");
      }
      const ticker = navRef.current?.querySelector(".headerticker");
      if (ticker instanceof HTMLElement) {
        ticker.style.display = "none";
      }
    });

    return () => {
      toggleBtn?.removeEventListener("click", handleMenuToggle);
      closeBtn?.removeEventListener("click", handleMenuToggle);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!navRef.current) return;
    const mobileMenu = navRef.current.querySelector(".hmenumob");
    // #region agent log: menu state after render
    normalizeNavAssetPaths(navRef.current);
    fetch('http://127.0.0.1:7872/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f4ccd7'},body:JSON.stringify({sessionId:'f4ccd7',location:'HebrewNavigation.tsx:71',message:'Menu state after render',data:{isMenuOpen,menuClass:mobileMenu?.className,menuDisplay:mobileMenu?window.getComputedStyle(mobileMenu).display:null,menuTransform:mobileMenu?window.getComputedStyle(mobileMenu).transform:null},timestamp:Date.now(),hypothesisId:'H2',runId:'pre-fix'})}).catch(()=>{});
    // #endregion
  }, [isMenuOpen]);

  return (
    <div ref={navRef} dir="rtl" className="hebrew-navigation">
      <div className="headerticker">
        <button className="tickclose" type="button" aria-label="Close ticker">
          <img alt="Close" src="/images/tickerxlose.svg" />
        </button>
        <ul>
          <li>פיטנגו UX היא עכשיו טריאולה! שלום וברוכים הבאים</li>
        </ul>
      </div>

      <div className="header headnewact">
        <div className="header_wrap">
          <div className="header_in cf">
            <div className="logo">
              <a href="/he">
                <img className="logoimg" alt="Triolla" src="/images/logo_triolla.svg" />
                <span>Formally Pitangoux</span>
              </a>
            </div>

            <div className="header_menu">
              <div className="menu-header-menu-he-container">
                <ul id="menu-header-menu-he" className="menu">
                  <li className="bigmenu menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1858">
                    <a>פורטפוליו</a>
                    <span className="marrow" />
                    <ul className="sub-menu">
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1972">
                        <a href="#">test</a>
                        <span className="marrow" />
                        <ul className="sub-menu">
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1973">
                            <a href="https://triolla.io/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/">אבטחת סייבר</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1974">
                            <a href="https://triolla.io/he/%d7%91%d7%a8%d7%99%d7%90%d7%95%d7%aa-%d7%95%d7%a8%d7%a4%d7%95%d7%90%d7%94/">רפואה ובריאות</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1975">
                            <a href="https://triolla.io/he/%d7%a4%d7%99%d7%a0%d7%98%d7%a7-%d7%95%d7%a4%d7%99%d7%a0%d7%a0%d7%a1%d7%99%d7%9d/">פינטק ופיננסים</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2333">
                            <a href="https://triolla.io/he/%d7%92%d7%99%d7%99%d7%9e%d7%99%d7%a0%d7%92/">גיימינג</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2334">
                            <a href="https://triolla.io/he/%d7%90%d7%92%d7%a8%d7%99%d7%98%d7%a7/">אגריטק</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2335">
                            <a href="https://triolla.io/he/b2c/">B2C</a>
                            <span className="marrow" />
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1976">
                        <a href="#">test</a>
                        <span className="marrow" />
                        <ul className="sub-menu">
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1977">
                            <a href="https://triolla.io/he/%d7%9e%d7%9b%d7%a9%d7%99%d7%a8%d7%99%d7%9d-iot-new/">מכשירים ו-IoT</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1978">
                            <a href="https://triolla.io/he/startups-tech/">סטארט-אפים וטכנולוגיה</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1979">
                            <a href="https://triolla.io/he/%d7%90%d7%a4%d7%9c%d7%99%d7%a7%d7%a6%d7%99%d7%95%d7%aa-%d7%9e%d7%95%d7%91%d7%99%d7%99%d7%9c/">אפליקציות מובייל</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2336">
                            <a href="https://triolla.io/he/saas-platforms/">SaaS</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2337">
                            <a href="https://triolla.io/he/b2b/">B2B</a>
                            <span className="marrow" />
                          </li>
                          <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2338">
                            <a href="https://triolla.io/he/technology/">פיתוח מערכות</a>
                            <span className="marrow" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1859">
                    <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/">שירותים</a>
                    <span className="marrow" />
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1860">
                    <a href="https://triolla.io/he/technology/">טכנולוגיה</a>
                    <span className="marrow" />
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1861">
                    <a href="https://triolla.io/he/about/">אודותינו</a>
                    <span className="marrow" />
                  </li>
                </ul>
              </div>
            </div>

            <div className="menutoggle">
              <button type="button" aria-label="Toggle menu">
                <img className="one" alt="Menu" src="/images/hamburger.svg" />
              </button>
            </div>

            <div className="header_right">
              <div className="header_contact">
                <a href="https://triolla.io/he/contact-us/">
                  <span className="default-text">צור קשר</span>
                </a>
              </div>

              <div className="header_whatsapp">
                <a href="https://api.whatsapp.com/send/?phone=+972525956644&text=&app_absent=0" target="_blank" rel="noopener noreferrer">
                  <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_473_9905)">
                      <path d="M22.5 45.0017C10.0755 45.0017 0 34.9262 0 22.5017C0 10.0772 10.0755 0.00170898 22.5 0.00170898C34.9245 0.00170898 45 10.0772 45 22.5017C45 34.9262 34.9245 45.0017 22.5 45.0017Z" fill="#25D366" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M33.0273 12.034C30.2373 9.23955 26.5202 7.70054 22.5647 7.69604C14.4152 7.69604 7.77775 14.329 7.77775 22.483C7.77775 25.0885 8.45725 27.6355 9.75325 29.8765L7.65625 37.54L15.4952 35.4835C17.6552 36.6625 20.0852 37.2835 22.5602 37.2835H22.5647C30.7142 37.2835 37.3472 30.6505 37.3517 22.4965C37.3563 18.5455 35.8218 14.8285 33.0273 12.034ZM22.5692 34.786H22.5647C20.3597 34.786 18.1952 34.192 16.3097 33.0715L15.8597 32.806L11.2067 34.0255L12.4488 29.4895L12.1562 29.026C10.9277 27.0685 10.2752 24.8095 10.2752 22.483C10.2797 15.706 15.7922 10.1935 22.5737 10.1935C25.8587 10.1935 28.9412 11.476 31.2632 13.798C33.5852 16.12 34.8632 19.2115 34.8587 22.492C34.8587 29.2735 29.3417 34.786 22.5692 34.786ZM29.3102 25.579C28.9412 25.3945 27.1232 24.499 26.7857 24.3775C26.4482 24.256 26.2008 24.193 25.9532 24.562C25.7057 24.931 24.9993 25.7635 24.7832 26.011C24.5672 26.2585 24.3512 26.29 23.9823 26.1055C23.6132 25.921 22.4207 25.5295 21.0122 24.2695C19.9142 23.2885 19.1718 22.078 18.9557 21.709C18.7397 21.34 18.9332 21.1375 19.1177 20.953C19.2842 20.7865 19.4867 20.521 19.6712 20.305C19.8557 20.089 19.9187 19.936 20.0402 19.6885C20.1617 19.441 20.1032 19.225 20.0087 19.0405C19.9142 18.856 19.1762 17.038 18.8702 16.2955C18.5687 15.5755 18.2672 15.6745 18.0377 15.661C17.8217 15.652 17.5742 15.6475 17.3312 15.6475C17.0837 15.6475 16.6832 15.742 16.3457 16.111C16.0083 16.48 15.0542 17.3755 15.0542 19.1935C15.0542 21.0115 16.3772 22.771 16.5617 23.014C16.7462 23.2615 19.1672 26.992 22.8752 28.594C23.7572 28.9765 24.4457 29.2015 24.9812 29.3725C25.8677 29.656 26.6732 29.6155 27.3077 29.521C28.0187 29.413 29.4947 28.6255 29.8007 27.766C30.1067 26.902 30.1067 26.164 30.0167 26.011C29.9267 25.858 29.6792 25.768 29.3102 25.579Z" fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_473_9905">
                        <rect width="45" height="45" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </div>

              <div className="header_book">
                <a href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone" target="_blank" rel="noopener noreferrer">
                  <span className="default-text">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.61418 2.45849V3.07326C8.60311 3.6185 7.72211 3.92927 7.44361 3.33357C7.40611 3.25295 7.38767 3.16372 7.38582 3.07326V2.45849H5.5439C5.07112 2.43572 4.75451 1.81725 5.07973 1.44124C5.19162 1.31201 5.282 1.24186 5.5439 1.22894C6.15746 1.22894 6.77164 1.22709 7.38582 1.2234V0.614775C7.38767 0.514467 7.3975 0.481851 7.41656 0.422158C7.49771 0.175386 7.74056 0 8.0123 0C8.33998 0.0129232 8.6068 0.258464 8.61418 0.614775V1.21601C9.84192 1.20863 11.0703 1.20186 12.2986 1.20801V0.614775C12.3048 0.286157 12.5446 0.014154 12.9005 0C12.9085 0 12.9165 0 12.9245 0C13.2528 0.0129232 13.5196 0.258464 13.5264 0.614775V1.21909C13.7465 1.22217 13.9666 1.22586 14.1861 1.22955C15.1273 1.25909 15.9647 2.06956 15.9825 3.05049C16.0058 6.7533 16.0058 10.4567 15.9825 14.1601C15.9653 15.1109 15.1433 15.9626 14.1633 15.9811C10.0546 16.0063 5.94536 16.0063 1.8367 15.9811C0.890528 15.9632 0.0359654 15.1571 0.0175216 14.1601C-0.00584054 10.4567 -0.00584054 6.7533 0.0175216 3.05049C0.0347358 2.09294 0.854255 1.2357 1.8576 1.22894H2.47362V0.614775C2.47547 0.514467 2.48469 0.481851 2.50436 0.422158C2.58551 0.175386 2.82836 0 3.09948 0C3.42778 0.0129232 3.6946 0.258464 3.70136 0.614775V3.07326C3.69091 3.61788 2.83512 3.92311 2.54186 3.35572C2.49698 3.26895 2.47547 3.17234 2.47362 3.07326V2.45602C2.26336 2.45479 2.05372 2.45479 1.84407 2.45849C1.53237 2.46833 1.2551 2.74156 1.24526 3.05788C1.17702 6.75514 1.17641 10.4549 1.24526 14.1521C1.2551 14.4648 1.52807 14.7417 1.84407 14.7515C5.9472 14.8278 10.0528 14.8278 14.1559 14.7515C14.4676 14.7417 14.7449 14.4684 14.7547 14.1521C14.823 10.4549 14.823 6.75514 14.7547 3.05788C14.7449 2.73972 14.4615 2.46033 14.1387 2.45849H13.5264V3.07326C13.5159 3.61296 12.6577 3.91758 12.3669 3.35572C12.3226 3.26895 12.3005 3.17234 12.2986 3.07326V2.45849H8.61418ZM3.08719 12.293C3.42655 12.293 3.70136 12.5687 3.70136 12.9078C3.70136 13.2469 3.42655 13.5226 3.08719 13.5226C2.74843 13.5226 2.47362 13.2469 2.47362 12.9078C2.47362 12.5687 2.74843 12.293 3.08719 12.293Z" fill="white" />
                    </svg>
                    קבעו שיחה
                  </span>
                  <span className="hover-text">קבעו שיחה</span>
                  <span className="button-overlay" />
                </a>
              </div>

              <div className="clr" />
            </div>
          </div>
        </div>
      </div>

      <div className={`hmenumob ${isMenuOpen ? "open" : ""}`}>
        <div className="hmenumobclose">
          <button type="button" aria-label="Close menu">
            <img alt="Close" src="/images/togleclose.svg" />
          </button>
        </div>

        <div className="hmenumobdiv">
          <div className="menu-header-menu-he-container">
            <ul id="menu-header-menu-he-1" className="menu">
              <li className="bigmenu menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1858">
                <a>פורטפוליו</a>
                <span className="marrow" />
                <ul className="sub-menu">
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1972">
                    <a href="#">test</a>
                    <span className="marrow" />
                    <ul className="sub-menu">
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1973">
                        <a href="https://triolla.io/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/">אבטחת סייבר</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1974">
                        <a href="https://triolla.io/he/%d7%91%d7%a8%d7%99%d7%90%d7%95%d7%aa-%d7%95%d7%a8%d7%a4%d7%95%d7%90%d7%94/">רפואה ובריאות</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1975">
                        <a href="https://triolla.io/he/%d7%a4%d7%99%d7%a0%d7%98%d7%a7-%d7%95%d7%a4%d7%99%d7%a0%d7%a0%d7%a1%d7%99%d7%9d/">פינטק ופיננסים</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2333">
                        <a href="https://triolla.io/he/%d7%92%d7%99%d7%99%d7%9e%d7%99%d7%a0%d7%92/">גיימינג</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2334">
                        <a href="https://triolla.io/he/%d7%90%d7%92%d7%a8%d7%99%d7%98%d7%a7/">אגריטק</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2335">
                        <a href="https://triolla.io/he/b2c/">B2C</a>
                        <span className="marrow" />
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1976">
                    <a href="#">test</a>
                    <span className="marrow" />
                    <ul className="sub-menu">
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1977">
                        <a href="https://triolla.io/he/%d7%9e%d7%9b%d7%a9%d7%99%d7%a8%d7%99%d7%9d-iot-new/">מכשירים ו-IoT</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1978">
                        <a href="https://triolla.io/he/startups-tech/">סטארט-אפים וטכנולוגיה</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1979">
                        <a href="https://triolla.io/he/%d7%90%d7%a4%d7%9c%d7%99%d7%a7%d7%a6%d7%99%d7%95%d7%aa-%d7%9e%d7%95%d7%91%d7%99%d7%99%d7%9c/">אפליקציות מובייל</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2336">
                        <a href="https://triolla.io/he/saas-platforms/">SaaS</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2337">
                        <a href="https://triolla.io/he/b2b/">B2B</a>
                        <span className="marrow" />
                      </li>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2338">
                        <a href="https://triolla.io/he/technology/">פיתוח מערכות</a>
                        <span className="marrow" />
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1859">
                <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/">שירותים</a>
                <span className="marrow" />
              </li>
              <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1860">
                <a href="https://triolla.io/he/technology/">טכנולוגיה</a>
                <span className="marrow" />
              </li>
              <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1861">
                <a href="https://triolla.io/he/about/">אודותינו</a>
                <span className="marrow" />
              </li>
            </ul>
          </div>
        </div>

        <div className="hmobmenubot">
          <div className="menu-mobile-header-menu-he-container">
            <ul id="menu-mobile-header-menu-he" className="menu">
              <li className="menu-item wpml-ls-slot-8 wpml-ls-item wpml-ls-item-en wpml-ls-menu-item wpml-ls-first-item wpml-ls-last-item menu-item-type-wpml_ls_menu_item menu-item-object-wpml_ls_menu_item">
                <a href="https://triolla.io/" title="עבור ל-אנגלית" aria-label="עבור ל-אנגלית" role="menuitem">
                  <span className="wpml-ls-display">אנגלית</span>
                </a>
              </li>
              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-17869">
                <a href="https://triolla.io/he/%d7%91%d7%9c%d7%95%d7%92/">בלוג</a>
              </li>
              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-17870">
                <a href="https://triolla.io/he/%d7%a7%d7%a8%d7%99%d7%99%d7%a8%d7%94/">קריירה</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hmobmbuts">
          <div className="hmobbutlftb">
            <a href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone" target="_blank" rel="noopener noreferrer">
              <img alt="Calendar" src="/images/calenderimg.svg" />
              {" קבעו שיחה"}
            </a>
          </div>
          <div className="hmobbutrsocl">
            <a href="tel:+972-73-744-3322">
              <img alt="Phone" src="/images/phmobicon.svg" />
            </a>
            <a href="https://wa.me/+972525956644?text=">
              <img alt="WhatsApp" src="/images/whatmobicon.svg" />
            </a>
          </div>
          <div className="clr" />
        </div>
      </div>
    </div>
  );
}
