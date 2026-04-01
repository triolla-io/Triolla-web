"use client";

import Link from "next/link";
import { useCurrentLocale, toggleLocale } from "./useCurrentLocale";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useCurrentLocale();
  const pathname = usePathname();
  const otherPath = toggleLocale(pathname);

  return (
    <Link href={otherPath} style={{ textDecoration: "none", color: "inherit" }}>
      <span style={{ cursor: "pointer", fontWeight: 500 }}>
        {locale === "en" ? "עברית" : "English"}
      </span>
    </Link>
  );
}
