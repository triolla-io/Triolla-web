"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocalePath, localeFromPathname } from "@/lib/i18n";
import { common } from "@/messages/common";

type Variant = "footer" | "header";

export default function LanguageSwitcher({
  className = "",
  variant = "footer",
}: {
  className?: string;
  variant?: Variant;
}) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const { en: pathEn, he: pathHe } = alternateLocalePath(pathname);
  const textMuted =
    variant === "header" ? "text-white/50" : "text-white/40";
  const textActive =
    variant === "header" ? "text-white font-semibold" : "text-white font-medium";
  const textHover =
    variant === "header" ? "hover:text-white/80" : "hover:text-white/80";

  return (
    <div className={`flex items-center gap-2 text-[13px] ${textMuted} ${className}`}>
      {variant === "footer" && (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
          <path
            d="M9.995 0C4.47 0 0 4.475 0 10C0 15.525 4.47 20 9.995 20C15.52 20 20 15.525 20 10C20 4.475 15.52 0 9.995 0ZM16.92 6H13.97C13.645 4.75 13.19 3.55 12.59 2.44C14.43 3.07 15.96 4.345 16.92 6ZM10 2.035C10.835 3.235 11.485 4.57 11.91 6H8.09C8.515 4.57 9.165 3.235 10 2.035ZM2.26 12C2.095 11.36 2 10.69 2 10C2 9.31 2.095 8.64 2.26 8H5.635C5.555 8.655 5.5 9.32 5.5 10C5.5 10.68 5.555 11.345 5.64 12H2.26ZM3.075 14H6.025C6.35 15.25 6.805 16.45 7.405 17.565C5.565 16.935 4.035 15.655 3.075 14ZM6.025 6H3.075C4.035 4.345 5.565 3.065 7.405 2.435C6.805 3.55 6.35 4.75 6.025 6ZM10 17.965C9.17 16.765 8.52 15.43 8.09 14H11.91C11.48 15.43 10.83 16.765 10 17.965ZM12.34 12H7.66C7.565 11.345 7.5 10.68 7.5 10C7.5 9.32 7.565 8.655 7.66 8H12.34C12.435 8.655 12.5 9.32 12.5 10C12.5 10.68 12.435 11.345 12.34 12ZM12.595 17.56C13.195 16.445 13.65 15.25 13.975 14H16.925C15.96 15.655 14.43 16.93 12.595 17.56ZM14.36 12C14.44 11.345 14.5 10.68 14.5 10C14.5 9.32 14.445 8.655 14.36 8H17.735C17.9 8.64 18 9.31 18 10C18 10.69 17.905 11.36 17.735 12H14.36Z"
            fill="#808080"
          />
        </svg>
      )}
      <div className="flex items-center gap-2">
        <Link
          href={pathEn}
          className={locale === "en" ? textActive : `${textHover} transition-colors`}
          hrefLang="en"
          lang="en"
        >
          {common.en.langEn}
        </Link>
        <Link
          href={pathHe}
          className={locale === "he" ? textActive : `${textHover} transition-colors`}
          hrefLang="he"
          lang="he"
        >
          {common.he.langHe}
        </Link>
      </div>
    </div>
  );
}
