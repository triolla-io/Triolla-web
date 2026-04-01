"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

/**
 * Static export: root layout cannot vary `<html lang>` per route. Sync `lang` and `dir` on the client from the URL.
 */
export default function DocumentLangDir() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === "he" ? "he" : "en";
    root.dir = locale === "he" ? "rtl" : "ltr";
    return () => {
      root.lang = "en";
      root.dir = "ltr";
    };
  }, [locale]);

  useEffect(() => {
    const MOBILE_MAX = 1023;
    const BLACK_LOGO_SRC = "/images/logo-black.svg";

    const applyMobileLogoSwap = () => {
      const isMobile = window.innerWidth <= MOBILE_MAX;
      const logos = document.querySelectorAll<HTMLImageElement>("img.logoimg");

      logos.forEach((img) => {
        const original = img.dataset.originalLogoSrc || img.getAttribute("src") || "";
        if (!img.dataset.originalLogoSrc && original) {
          img.dataset.originalLogoSrc = original;
        }

        if (isMobile) {
          if (img.getAttribute("src") !== BLACK_LOGO_SRC) {
            img.setAttribute("src", BLACK_LOGO_SRC);
          }
          img.removeAttribute("srcset");
        } else if (img.dataset.originalLogoSrc) {
          img.setAttribute("src", img.dataset.originalLogoSrc);
        }
      });
    };

    applyMobileLogoSwap();
    window.addEventListener("resize", applyMobileLogoSwap, { passive: true });

    const observer = new MutationObserver(() => applyMobileLogoSwap());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "class"],
    });

    const delayed = window.setTimeout(applyMobileLogoSwap, 300);

    return () => {
      window.removeEventListener("resize", applyMobileLogoSwap);
      observer.disconnect();
      window.clearTimeout(delayed);
    };
  }, []);

  return null;
}
