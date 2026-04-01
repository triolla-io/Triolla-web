"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localeFromPathname, withLocalePrefix } from "@/lib/i18n";
import { common, footerHrefMap } from "@/messages/common";

/** Press logos — single row on mobile (`lg:hidden` block); LTR order matches assets */
const mentionLogos = [
  { src: "/images/logo_marker_731.svg", alt: "TheMarker", width: 120, height: 31 },
  { src: "/images/logo_733.svg", alt: "Globes", width: 82, height: 31 },
  { src: "/images/logo_736.svg", alt: "Anashim", width: 86, height: 32 },
  { src: "/images/logo_biz_735.svg", alt: "Bizportal", width: 120, height: 31 },
  { src: "/images/logo_mako_734.svg", alt: "Mako", width: 100, height: 31 },
  { src: "/images/logo_732.svg", alt: "Reshet 13", width: 108, height: 31 },
];

const CALENDLY_BOOK = "https://calendly.com/triolla/pitangoux-introductory-meeting-clone";

const WA_HREF =
  "https://api.whatsapp.com/send/?phone=972525956644&text=Hello%2C+I%27d+like+to+learn+more...&app_absent=0";

const col6Social = [
  { label: "Facebook", href: "https://facebook.com/triolla" },
  { label: "LinkedIn", href: "https://linkedin.com/company/triolla" },
  { label: "Instagram", href: "https://instagram.com/triolla" },
  { label: "Tiktok", href: "https://tiktok.com/@triolla" },
  { label: "Dribbble", href: "https://dribbble.com/triolla" },
  { label: "Behance", href: "https://behance.net/triolla" },
];

function MenuCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[16px] font-bold text-white mb-5">
        <span>{title}</span>
      </h3>
      <ul className="space-y-[10px]">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[14px] text-white/60 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      className={`shrink-0 text-white transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const t = common[locale];
  const p = (path: string) => withLocalePrefix(path, locale);
  const isRtl = locale === "he";
  const [openSection, setOpenSection] = useState<number | null>(null);

  const col1 = {
    title: t.footerCols.col1.title,
    items: t.footerCols.col1.items.map((label) => ({ label, href: p(footerHrefMap.col1) })),
  };
  const col2 = {
    title: t.footerCols.col2.title,
    items: t.footerCols.col2.items.map((label, i) => ({
      label,
      href: p(footerHrefMap.col2[i]),
    })),
  };
  const col3 = {
    title: t.footerCols.col3.title,
    items: t.footerCols.col3.items.map((label) => ({ label, href: p(footerHrefMap.col3) })),
  };
  const col4 = {
    title: t.footerCols.col4.title,
    items: t.footerCols.col4.items.map((label, i) => ({
      label,
      href: p(footerHrefMap.col4[i]),
    })),
  };
  const col5 = {
    title: t.footerCols.col5.title,
    items: t.footerCols.col5.items.map((label) => ({ label, href: p(footerHrefMap.col5) })),
  };

  const menuColumns = [col1, col2, col3, col4, col5];

  const toggleSection = (index: number) => {
    setOpenSection((prev) => (prev === index ? null : index));
  };

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1560px] px-6 lg:px-[60px]">
        {/* ── Desktop: mentions + 7 columns ───────────────── */}
        <div className="hidden lg:block">
          <ScrollReveal direction="up" delay={0}>
            <div className="footer_top flex flex-col gap-5 border-b border-white/10 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:py-10 lg:gap-10">
              <span className="flex-shrink-0 text-[15px] font-normal text-white/40">{t.mentions}</span>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-5 gap-y-5 sm:justify-start md:gap-x-8 lg:gap-x-10 lg:gap-y-4">
                {mentionLogos.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="h-[26px] w-auto max-w-[min(100%,160px)] object-contain sm:h-[28px]"
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-8 py-14 sm:grid-cols-3 lg:grid-cols-7">
            <ScrollReveal direction="up" delay={0}>
              <MenuCol {...col1} />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.05}>
              <MenuCol {...col2} />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <MenuCol {...col3} />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.15}>
              <MenuCol {...col4} />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <MenuCol {...col5} />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <div>
                <h3 className="mb-5 text-[16px] font-bold text-white">{t.social}</h3>
                <ul className="space-y-[10px]">
                  {col6Social.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-white/60 transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div>
                <h3 className="mb-5 text-[16px] font-bold text-white">{t.talkToUs}</h3>
                <div className="space-y-[10px] text-[14px] text-white/60">
                  <p>
                    {t.mail}{" "}
                    <a href="mailto:Fun@triolla.io" className="transition-colors hover:text-white">
                      Fun@triolla.io
                    </a>
                  </p>
                  <p>
                    <strong className="font-normal text-white/80">{t.tlvOffices}</strong>{" "}
                    <a href="tel:+972737443322" className="transition-colors hover:text-white">
                      +972-73-744-3322
                    </a>
                  </p>
                  <p>
                    <strong className="font-normal text-white/80">{t.nyOffices}</strong>{" "}
                    <a href="tel:+14086277350" className="transition-colors hover:text-white">
                      +1408-627-7350
                    </a>
                  </p>
                </div>
                <a
                  href={CALENDLY_BOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-[44px] items-center gap-2 rounded-full bg-[#006BFF] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#005ee0]"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.614 2.458V3.073c-.011.545-.89.856-1.17.26a.63.63 0 01-.039-.26V2.458H5.544c-.473-.023-.789-.641-.464-1.017C5.192 1.312 5.282 1.242 5.544 1.229c.613 0 1.228-.002 1.842-.005V.615C7.388.514 7.398.482 7.417.422A.81.81 0 018.012 0c.328.013.607.258.614.615V1.216c1.228-.007 2.456-.014 3.685-.008V.615c.006-.329.245-.601.601-.615.008 0 .016 0 .025 0 .328.013.606.258.613.615v.604c.22.003.44.007.66.01.94.03 1.778.84 1.796 1.821.023 3.703.023 7.406 0 11.11-.017.95-.839 1.802-1.819 1.82-4.109.026-8.217.026-12.326 0C.89 15.963.036 15.157.018 14.16c-.023-3.703-.023-7.406 0-11.11C.035 2.093.854 1.236 1.858 1.229h.616V.615C2.475.514 2.485.482 2.504.422A.81.81 0 013.1 0c.328.013.606.258.613.615V3.073c-.01.545-.867.85-1.157.284a.664.664 0 01-.047-.284V2.456c-.21-.001-.42-.001-.63 0-.312.01-.589.283-.598.6C.904 6.755.903 10.455.992 14.152c.01.313.282.59.598.6 4.103.076 8.21.076 12.312 0 .312-.01.589-.283.598-.6.069-3.697.069-7.397 0-11.094-.01-.318-.294-.597-.621-.6H12.3V3.073c-.01.54-.868.845-1.16.283a.664.664 0 01-.047-.283V2.458H8.614z"
                      fill="white"
                    />
                  </svg>
                  {t.bookACall}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Mobile: CTA strip + accordions (triolla.io mobile footer) ── */}
        <div className={`lg:hidden ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
          <div className="border-b border-white/30 py-8 text-center">
            <h2 className="mb-5 text-[24px] font-bold leading-tight text-white">{t.talkToUs}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href={CALENDLY_BOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 min-h-[40px] items-center gap-2 rounded-full bg-[#006BFF] px-4 text-[13px] font-medium text-white sm:h-11 sm:px-5 sm:text-[14px]"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.614 2.458V3.073c-.011.545-.89.856-1.17.26a.63.63 0 01-.039-.26V2.458H5.544c-.473-.023-.789-.641-.464-1.017C5.192 1.312 5.282 1.242 5.544 1.229c.613 0 1.228-.002 1.842-.005V.615C7.388.514 7.398.482 7.417.422A.81.81 0 018.012 0c.328.013.607.258.614.615V1.216c1.228-.007 2.456-.014 3.685-.008V.615c.006-.329.245-.601.601-.615.008 0 .016 0 .025 0 .328.013.606.258.613.615v.604c.22.003.44.007.66.01.94.03 1.778.84 1.796 1.821.023 3.703.023 7.406 0 11.11-.017.95-.839 1.802-1.819 1.82-4.109.026-8.217.026-12.326 0C.89 15.963.036 15.157.018 14.16c-.023-3.703-.023-7.406 0-11.11C.035 2.093.854 1.236 1.858 1.229h.616V.615C2.475.514 2.485.482 2.504.422A.81.81 0 013.1 0c.328.013.606.258.613.615V3.073c-.01.545-.867.85-1.157.284a.664.664 0 01-.047-.284V2.456c-.21-.001-.42-.001-.63 0-.312.01-.589.283-.598.6C.904 6.755.903 10.455.992 14.152c.01.313.282.59.598.6 4.103.076 8.21.076 12.312 0 .312-.01.589-.283.598-.6.069-3.697.069-7.397 0-11.094-.01-.318-.294-.597-.621-.6H12.3V3.073c-.01.54-.868.845-1.16.283a.664.664 0 01-.047-.283V2.458H8.614z"
                    fill="white"
                  />
                </svg>
                {t.bookACall}
              </a>
              <Link
                href={p("/contact-us/")}
                className="inline-flex h-10 min-h-[40px] items-center rounded-full bg-[#FFDC56] px-4 text-[13px] font-medium text-black sm:h-11 sm:px-5 sm:text-[14px]"
              >
                {t.contactUs}
              </Link>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center"
                aria-label={t.whatsappLabel}
              >
                <svg width="40" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip_footer_wa)">
                    <path
                      d="M22.5 45.0017C10.0755 45.0017 0 34.9262 0 22.5017C0 10.0772 10.0755 0.00170898 22.5 0.00170898C34.9245 0.00170898 45 10.0772 45 22.5017C45 34.9262 34.9245 45.0017 22.5 45.0017Z"
                      fill="#25D366"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M33.0273 12.034C30.2373 9.23955 26.5202 7.70054 22.5647 7.69604C14.4152 7.69604 7.77775 14.329 7.77775 22.483C7.77775 25.0885 8.45725 27.6355 9.75325 29.8765L7.65625 37.54L15.4952 35.4835C17.6552 36.6625 20.0852 37.2835 22.5602 37.2835H22.5647C30.7142 37.2835 37.3472 30.6505 37.3517 22.4965C37.3563 18.5455 35.8218 14.8285 33.0273 12.034ZM22.5692 34.786H22.5647C20.3597 34.786 18.1952 34.192 16.3097 33.0715L15.8597 32.806L11.2067 34.0255L12.4488 29.4895L12.1562 29.026C10.9277 27.0685 10.2752 24.8095 10.2752 22.483C10.2797 15.706 15.7922 10.1935 22.5737 10.1935C25.8587 10.1935 28.9412 11.476 31.2632 13.798C33.5852 16.12 34.8632 19.2115 34.8587 22.492C34.8587 29.2735 29.3417 34.786 22.5692 34.786ZM29.3102 25.579C28.9412 25.3945 27.1232 24.499 26.7857 24.3775C26.4482 24.256 26.2008 24.193 25.9532 24.562C25.7057 24.931 24.9993 25.7635 24.7832 26.011C24.5672 26.2585 24.3512 26.29 23.9823 26.1055C23.6132 25.921 22.4207 25.5295 21.0122 24.2695C19.9142 23.2885 19.1718 22.078 18.9557 21.709C18.7397 21.34 18.9332 21.1375 19.1177 20.953C19.2842 20.7865 19.4867 20.521 19.6712 20.305C19.8557 20.089 19.9187 19.936 20.0402 19.6885C20.1617 19.441 20.1032 19.225 20.0087 19.0405C19.9142 18.856 19.1762 17.038 18.8702 16.2955C18.5687 15.5755 18.2672 15.6745 18.0377 15.661C17.8217 15.652 17.5742 15.6475 17.3312 15.6475C17.0837 15.6475 16.6832 15.742 16.3457 16.111C16.0083 16.48 15.0542 17.3755 15.0542 19.1935C15.0542 21.0115 16.3772 22.771 16.5617 23.014C16.7462 23.2615 19.1672 26.992 22.8752 28.594C23.7572 28.9765 24.4457 29.2015 24.9812 29.3725C25.8677 29.656 26.6732 29.6155 27.3077 29.521C28.0187 29.413 29.4947 28.6255 29.8007 27.766C30.1067 26.902 30.1067 26.164 30.0167 26.011C29.9267 25.858 29.6792 25.768 29.3102 25.579Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip_footer_wa">
                      <rect width="45" height="45" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a
                href="tel:+972737443322"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
                aria-label="Phone"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          {menuColumns.map((col, index) => {
            const open = openSection === index;
            return (
              <div key={col.title} className="border-b border-white/30">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 py-[18px] text-start text-[14px] font-bold leading-none text-white ${isRtl ? "flex-row-reverse text-end" : ""}`}
                  onClick={() => toggleSection(index)}
                  aria-expanded={open}
                  aria-controls={`footer-panel-${index}`}
                  id={`footer-heading-${index}`}
                >
                  <span>{col.title}</span>
                  <AccordionChevron open={open} />
                </button>
                <div
                  id={`footer-panel-${index}`}
                  role="region"
                  aria-labelledby={`footer-heading-${index}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <ul className={`space-y-3 pb-5 ${isRtl ? "text-end" : "text-start"}`}>
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="text-[14px] text-white/60 transition-colors hover:text-white"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Social accordion */}
          <div className="border-b border-white/30">
            <button
              type="button"
              className={`flex w-full items-center justify-between gap-3 py-[18px] text-start text-[14px] font-bold leading-none text-white ${isRtl ? "flex-row-reverse text-end" : ""}`}
              onClick={() => toggleSection(5)}
              aria-expanded={openSection === 5}
              aria-controls="footer-panel-social"
              id="footer-heading-social"
            >
              <span>{t.social}</span>
              <AccordionChevron open={openSection === 5} />
            </button>
            <div
              id="footer-panel-social"
              role="region"
              aria-labelledby="footer-heading-social"
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${openSection === 5 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className={`space-y-3 pb-5 ${isRtl ? "text-end" : "text-start"}`}>
                  {col6Social.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-white/60 transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Talk to us — contact accordion */}
          <div className="border-b border-white/30">
            <button
              type="button"
              className={`flex w-full items-center justify-between gap-3 py-[18px] text-start text-[14px] font-bold leading-none text-white ${isRtl ? "flex-row-reverse text-end" : ""}`}
              onClick={() => toggleSection(6)}
              aria-expanded={openSection === 6}
              aria-controls="footer-panel-talk"
              id="footer-heading-talk"
            >
              <span>{t.talkToUs}</span>
              <AccordionChevron open={openSection === 6} />
            </button>
            <div
              id="footer-panel-talk"
              role="region"
              aria-labelledby="footer-heading-talk"
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${openSection === 6 ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={`space-y-3 pb-5 text-[14px] text-white/60 ${isRtl ? "text-end" : "text-start"}`}>
                  <p>
                    {t.mail}{" "}
                    <a href="mailto:Fun@triolla.io" className="transition-colors hover:text-white">
                      Fun@triolla.io
                    </a>
                  </p>
                  <p>
                    <strong className="font-normal text-white/80">{t.tlvOffices}</strong>{" "}
                    <a href="tel:+972737443322" className="transition-colors hover:text-white">
                      +972-73-744-3322
                    </a>
                  </p>
                  <p>
                    <strong className="font-normal text-white/80">{t.nyOffices}</strong>{" "}
                    <a href="tel:+14086277350" className="transition-colors hover:text-white">
                      +1408-627-7350
                    </a>
                  </p>
                  <a
                    href={CALENDLY_BOOK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-[#006BFF] px-4 text-[13px] font-medium text-white sm:h-11 sm:text-[14px]"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.614 2.458V3.073c-.011.545-.89.856-1.17.26a.63.63 0 01-.039-.26V2.458H5.544c-.473-.023-.789-.641-.464-1.017C5.192 1.312 5.282 1.242 5.544 1.229c.613 0 1.228-.002 1.842-.005V.615C7.388.514 7.398.482 7.417.422A.81.81 0 018.012 0c.328.013.607.258.614.615V1.216c1.228-.007 2.456-.014 3.685-.008V.615c.006-.329.245-.601.601-.615.008 0 .016 0 .025 0 .328.013.606.258.613.615v.604c.22.003.44.007.66.01.94.03 1.778.84 1.796 1.821.023 3.703.023 7.406 0 11.11-.017.95-.839 1.802-1.819 1.82-4.109.026-8.217.026-12.326 0C.89 15.963.036 15.157.018 14.16c-.023-3.703-.023-7.406 0-11.11C.035 2.093.854 1.236 1.858 1.229h.616V.615C2.475.514 2.485.482 2.504.422A.81.81 0 013.1 0c.328.013.606.258.613.615V3.073c-.01.545-.867.85-1.157.284a.664.664 0 01-.047-.284V2.456c-.21-.001-.42-.001-.63 0-.312.01-.589.283-.598.6C.904 6.755.903 10.455.992 14.152c.01.313.282.59.598.6 4.103.076 8.21.076 12.312 0 .312-.01.589-.283.598-.6.069-3.697.069-7.397 0-11.094-.01-.318-.294-.597-.621-.6H12.3V3.073c-.01.54-.868.845-1.16.283a.664.664 0 01-.047-.283V2.458H8.614z"
                        fill="white"
                      />
                    </svg>
                    {t.bookACall}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footmoblogos border-b border-white/10 py-[25px] md:py-10 lg:hidden">
          <ul
            aria-label={t.mentions}
            className="m-0 flex w-full min-w-0 list-none flex-nowrap items-center justify-evenly gap-1 p-0 2xs:gap-1.5 sm:gap-2 md:gap-3"
            role="list"
            dir="ltr"
          >
            {mentionLogos.map((logo) => (
              <li key={logo.alt} className="flex min-w-0 shrink items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  sizes="(max-width: 1023px) 14vw, 160px"
                  className="h-[17px] w-auto max-w-full object-contain brightness-0 invert opacity-75 2xs:h-[19px] sm:h-[22px] md:h-[26px]"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar — desktop (lg+): logo | [socials + legal under] | lang + SQLink; mobile: compact row */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-4 px-6 py-4 max-sm:gap-0 sm:py-5 lg:gap-5 lg:px-[60px]">
          <div
            className="flex w-full min-w-0 flex-wrap items-start gap-y-4 sm:flex-nowrap sm:items-center sm:gap-4 lg:items-start lg:gap-8"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <Link href={p("/")} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo_triolla.svg"
                alt="Triolla"
                style={{ height: "18px", width: "auto", filter: "brightness(0) invert(1)" }}
                className="sm:!h-[22px] lg:!h-[28px]"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 sm:gap-3 lg:min-h-[52px] lg:justify-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                <a href="https://tiktok.com/@triolla" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="32" height="32" viewBox="0 0 35 34" fill="none" className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px] lg:h-8 lg:w-8">
                    <circle cx="17.376" cy="18.433" r="11.163" fill="white" />
                    <path
                      d="M17.375 0C8.055 0 0.5 7.555 0.5 16.875C0.5 26.195 8.055 33.75 17.375 33.75C26.695 33.75 34.25 26.195 34.25 16.875C34.25 7.555 26.695 0 17.375 0ZM25.919 15.318C24.127 15.318 22.384 14.737 21.041 13.753L21.031 20.443C21.03 21.683 20.65 22.893 19.944 23.912C19.237 24.93 18.237 25.709 17.076 26.144C15.915 26.58 14.649 26.651 13.447 26.348C12.245 26.045 11.164 25.382 10.348 24.449C9.532 23.516 9.02 22.356 8.88 21.124C8.741 19.892 8.98 18.647 9.567 17.554C10.153 16.462 11.059 15.575 12.163 15.011C13.267 14.447 14.517 14.233 15.746 14.397V17.683C15.166 17.512 14.547 17.527 13.977 17.728C13.407 17.928 12.914 18.302 12.568 18.798C12.223 19.295 12.043 19.887 12.053 20.491C12.063 21.095 12.263 21.681 12.625 22.165C12.987 22.649 13.492 23.007 14.068 23.188C14.645 23.369 15.264 23.364 15.838 23.174C16.411 22.983 16.91 22.617 17.264 22.127C17.617 21.637 17.808 21.048 17.808 20.443V7.207H21.188C21.188 7.828 21.31 8.444 21.548 9.018C21.786 9.592 22.134 10.113 22.574 10.552C23.013 10.992 23.535 11.34 24.109 11.578C24.683 11.816 25.298 11.938 25.919 11.938V15.318Z"
                      fill="#4B4545"
                    />
                  </svg>
                </a>

                <a href="https://instagram.com/triolla" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/instagram.svg"
                    alt="Instagram"
                    style={{ height: "26px", width: "26px" }}
                    className="sm:!h-[30px] sm:!w-[30px] lg:!h-8 lg:!w-8"
                  />
                </a>

                <a href="https://facebook.com/triolla" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="32" height="32" viewBox="0 0 35 34" fill="none" className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px] lg:h-8 lg:w-8">
                    <path
                      d="M34.25 16.875C34.25 7.555 26.695 0 17.375 0C8.055 0 0.5 7.555 0.5 16.875C0.5 25.298 6.671 32.279 14.738 33.545V21.753H10.454V16.875H14.738V13.157C14.738 8.928 17.258 6.592 21.112 6.592C22.959 6.592 24.89 6.921 24.89 6.921V11.074H22.762C20.666 11.074 20.012 12.375 20.012 13.71V16.875H24.692L23.944 21.753H20.012V33.545C28.079 32.279 34.25 25.298 34.25 16.875Z"
                      fill="#1877F2"
                    />
                    <path
                      d="M23.945 21.753L24.693 16.875H20.013V13.71C20.013 12.375 20.667 11.074 22.763 11.074H24.891V6.921C24.891 6.921 22.96 6.592 21.114 6.592C17.259 6.592 14.74 8.928 14.74 13.157V16.875H10.455V21.753H14.74V33.545C15.599 33.68 16.48 33.75 17.377 33.75C18.274 33.75 19.154 33.68 20.013 33.545V21.753H23.945Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>

              <p
                className="m-0 hidden w-full max-w-[520px] flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[13px] text-white/40 md:flex"
              >
                <span>{t.allRights}</span>
                <Link href={p("/privacy-policy/")} className="transition-colors hover:text-white">
                  {t.privacyPolicy}
                </Link>
                <Link href={p("/terms-of-use/")} className="transition-colors hover:text-white">
                  {t.termsOfUse}
                </Link>
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 md:gap-4 lg:ms-auto">
              <LanguageSwitcher className="flex max-[499px]:hidden" />

              <a
                href="https://www.sqlink.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-end gap-0.5 text-[13px] text-white/40 transition-colors hover:text-white lg:gap-1"
              >
                <span className="text-[10px] leading-none lg:text-[11px]">{t.partOf}</span>
                <Image
                  src="/images/sqlink_icon.png"
                  alt="SQLink"
                  width={60}
                  height={20}
                  className="h-[17px] w-[62px] sm:h-[15px] sm:w-auto lg:h-[20px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
