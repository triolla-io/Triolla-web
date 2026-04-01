"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import { useLocale } from "@/components/LocaleProvider";

type IndustryHeroProps = {
  title: ReactNode;
  subtitle: string;
  description?: ReactNode;
  cta?: ReactNode;
  eyebrow?: ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  titleDir?: "ltr" | "rtl" | "auto";
  showGrid?: boolean;
};

export default function IndustryHero({
  title,
  subtitle,
  description,
  cta,
  eyebrow = "Product design for",
  sectionClassName = "",
  containerClassName = "",
  contentClassName = "",
  titleClassName = "",
  titleDir,
  showGrid = true,
}: IndustryHeroProps) {
  const locale = useLocale();
  const resolvedTitleDir = titleDir ?? (locale === "he" ? "rtl" : "ltr");

  return (
    <section
      className={`relative overflow-x-hidden bg-[#FED125] pt-[100px] pb-16 sm:pt-[140px] sm:pb-20 md:pt-[180px] md:pb-28 lg:pt-[220px] lg:pb-36 xl:pt-[262px] xl:pb-[201px] ${sectionClassName}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {showGrid ? (
          <Image
            src="/images/banner_grid.svg"
            alt=""
            fill
            className="object-cover object-top opacity-40 sm:opacity-50 md:opacity-60"
            priority
          />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portolio_layer.svg"
          alt=""
          className="absolute top-0 h-full w-auto max-w-full max-md:right-0 max-md:max-h-[85%] max-md:opacity-40 sm:right-0 sm:max-h-none sm:opacity-100 min-[1024px]:left-0 min-[1024px]:right-auto min-[1024px]:top-[50px] min-[1024px]:h-[115%] min-[1024px]:max-h-none min-[1024px]:max-w-none min-[1024px]:origin-left"
        />
      </div>

      <div
        className={`relative mx-auto w-full max-w-[1214px] min-w-0 px-4 sm:px-[30px] md:px-[80px] lg:px-[150px] ${containerClassName}`.trim()}
      >
        <HeroJumpSvgs />

        <div className={`relative text-center ${contentClassName}`.trim()}>
          <motion.h4
            className="mb-3 text-base font-normal text-black opacity-80 sm:mb-5 sm:text-lg md:text-[20px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {eyebrow}
          </motion.h4>

          <motion.h1
            dir={resolvedTitleDir}
            className={`m-0 max-w-full break-normal text-balance text-center text-[clamp(2.5rem,15vw+1.1rem,5rem)] font-bold leading-[0.88] text-black hyphens-none sm:text-[96px] sm:leading-[0.85] md:text-[138px] lg:text-[180px] xl:text-[220px] 2xl:text-[260px] pb-8 sm:pb-12 md:pb-14 lg:pb-[70px] ${titleClassName}`.trim()}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="m-0 max-w-[52rem] px-1 text-center text-base font-bold leading-snug tracking-[-0.04em] text-black sm:text-lg md:text-2xl md:leading-[1.15] lg:text-[32px] lg:tracking-[-0.96px] mx-auto">
              {subtitle}
            </p>
            {description}
          </motion.div>

          {cta ? (
            <motion.div
              className="flex justify-center pt-6 sm:pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {cta}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
