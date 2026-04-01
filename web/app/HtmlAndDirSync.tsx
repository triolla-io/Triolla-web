"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Keep a single <html> in root layout; sync lang/dir for /he/* without nesting a second <html>. */
export function HtmlAndDirSync() {
  const pathname = usePathname() ?? "";
  useLayoutEffect(() => {
    const isHe = /^\/he(\/|$)/.test(pathname);
    const root = document.documentElement;
    root.lang = isHe ? "he" : "en";
    root.dir = isHe ? "rtl" : "ltr";
  }, [pathname]);
  return null;
}
