"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import { LazyPageBottomSectionService as PageBottomSectionService } from "@/components/LazyBelowFoldMarketing";

/** Mobile-first: smaller title below `sm` (768px) to match triolla.io service pages (~34px). */
const H1_DEFAULT =
  "m-0 pb-6 text-center text-[34px] font-bold leading-[34px] text-black sm:pb-8 sm:text-[60px] sm:leading-[0.9] md:text-[60px] lg:text-[80px] xl:text-[100px]";
const H1_LARGE =
  "m-0 pb-6 text-center text-[34px] font-bold leading-[34px] text-black sm:pb-8 sm:text-[80px] sm:leading-[0.9] md:text-[110px] lg:text-[140px] xl:text-[190px]";

/** Lead block wrapper (size/spacing only) — pair with `serviceDetailLeadStrongClass` inside `<strong>` for WP parity. */
export const serviceDetailLeadWrapperClass =
  "mb-12 text-[22px] leading-[1.3] text-black md:text-[28px] lg:text-[32px]";
/** Semibold (600) on `<strong>` — matches SF Pro Semibold / WP heading scale; overrides UA `strong { font-weight: bolder }`. */
export const serviceDetailLeadStrongClass = "font-semibold";
/** Lead paragraph under the hero image (services detail pages). */
export const serviceDetailLeadClass = `${serviceDetailLeadWrapperClass} ${serviceDetailLeadStrongClass}`;
/** Body copy paragraphs. */
export const serviceDetailBodyPClass =
  "mb-6 text-[20px] font-medium leading-[1.7] text-black/70 md:text-[22px]";

export type ServiceDetailLayoutProps = {
  title: string;
  heroImageSrc: string;
  heroImageAlt: string;
  /** Intrinsic dimensions of `heroImageSrc` (for Next/Image optimization). */
  heroImageWidth?: number;
  heroImageHeight?: number;
  /** Shorter title scale (e.g. "UX Research") vs long lines ("Front End Development"). */
  titleSize?: "default" | "large";
  dir?: "ltr" | "rtl";
  children: ReactNode;
};

export default function ServiceDetailLayout({
  title,
  heroImageSrc,
  heroImageAlt,
  heroImageWidth = 1400,
  heroImageHeight = 660,
  titleSize = "large",
  dir,
  children,
}: ServiceDetailLayoutProps) {
  const h1Class = titleSize === "default" ? H1_DEFAULT : H1_LARGE;

  return (
    <div dir={dir}>
      <section className="relative overflow-x-hidden bg-[#FED125] pt-[160px] pb-[40px] sm:pt-[200px] md:pt-[230px] lg:pt-[262px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/images/banner_grid.svg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-60"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-[1214px] px-5 sm:px-[30px] md:px-[80px] lg:px-[150px]">
          <HeroJumpSvgs />
          <div className="relative text-center">
            <motion.h1
              className={h1Class}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="relative z-30 overflow-visible bg-[#FED125] -mt-8 pt-2 pb-0">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <div className="relative z-30 isolate -mb-32 translate-y-4 md:-mb-44 md:translate-y-6 lg:-mb-56 lg:translate-y-8">
            <Image
              src={heroImageSrc}
              alt={heroImageAlt}
              width={heroImageWidth}
              height={heroImageHeight}
              priority
              className="relative z-30 h-auto w-full rounded-[24px] object-cover shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>
      </section>

      <section className="relative z-0 mx-auto max-w-[900px] bg-[#E7EBF0] px-5 pb-[100px] pt-44 sm:pt-52 md:pt-60 lg:pt-72">
        {children}
      </section>

      <PageBottomSectionService />
    </div>
  );
}
