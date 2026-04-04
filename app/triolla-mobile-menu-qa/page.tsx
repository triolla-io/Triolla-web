"use client";

import { useEffect, useRef } from "react";
import { mountTriollaMobileMenu } from "../lib/mountTriollaMobileMenu";

/**
 * Single-segment URL so this never competes with `app/[lang]/…` routing.
 * `/temp/mobile-menu` redirects here (see next.config.ts).
 */
export default function TriollaMobileMenuQaPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return mountTriollaMobileMenu(el);
  }, []);

  return (
    <div
      ref={rootRef}
      data-triolla-snapshot="1"
      dir="rtl"
      className="main_container rtl wp-theme-triolla temp-mobile-nav-qa"
      style={{ minHeight: "100vh", background: "#e7eaef" }}
    >
      <p
        style={{
          margin: 0,
          padding: "12px 16px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
          color: "#444",
        }}
      >
        Triolla mobile menu QA — tap the hamburger. Canonical URL:{" "}
        <code>/triolla-mobile-menu-qa</code>
      </p>

      <div className="header headnewact">
        <div className="header_wrap">
          <div className="header_in cf">
            <div className="logo">
              <a href="/">
                <img
                  className="logoimg"
                  src="/images/logo-black.svg"
                  alt="Triolla"
                  width={79}
                  height={38}
                />
              </a>
            </div>
            <div className="header_menu" style={{ display: "none" }} aria-hidden>
              <ul className="menu">
                <li>
                  <a href="#">Placeholder</a>
                </li>
              </ul>
            </div>
            <div className="menutoggle">
              <a href="javascript:void(0);">
                <img className="one" alt="" src="/images/hamburger.svg" />
                <img className="two" alt="" src="/images/hamburger_white.svg" />
              </a>
            </div>
            <div className="header_right">
              <div className="header_contact">
                <a href="/he/contact-us/">
                  <span className="default-text">צור קשר</span>
                  <span className="hover-text">צור קשר</span>
                  <span className="button-overlay" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hmenumob">
        <div className="hmenumobclose">
          <a href="javascript:void(0);">
            <img alt="" src="/images/togleclose.svg" width={24} height={24} />
          </a>
        </div>
        <div className="hmenumobdiv">
          <p style={{ fontSize: "clamp(18px, 4vw, 28px)", margin: "16px 0 0 0" }}>
            If you see this panel, <code>mountTriollaMobileMenu</code> +{" "}
            <code>body.mbodyact</code> + snapshot mobile CSS are working.
          </p>
        </div>
      </div>
    </div>
  );
}
