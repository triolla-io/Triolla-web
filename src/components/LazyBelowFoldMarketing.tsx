"use client";

import dynamic from "next/dynamic";

const sectionSkeleton = (
  <div
    style={{ minHeight: 120 }}
    className="w-full bg-black/5 animate-pulse rounded-lg"
    aria-hidden
  />
);

/** Below-the-fold marketing sections — code-split to improve FCP on long pages. */
export const LazyFaqSection = dynamic(() => import("@/components/FaqSection"), {
  ssr: false,
  loading: () => sectionSkeleton,
});

export const LazyClientLogosSection = dynamic(
  () => import("@/components/ClientLogosSection"),
  { ssr: false, loading: () => sectionSkeleton },
);

export const LazyPageBottomSection = dynamic(
  () => import("@/components/PageBottomSection"),
  { ssr: false, loading: () => sectionSkeleton },
);

export const LazyPageBottomSectionService = dynamic(
  () => import("@/components/PageBottomSectionService"),
  { ssr: false, loading: () => sectionSkeleton },
);

export const LazyWhyChooseUsSection = dynamic(
  () => import("@/components/WhyChooseUsSection"),
  { ssr: false, loading: () => sectionSkeleton },
);

export const LazyDesignProcessSection = dynamic(
  () => import("@/components/DesignProcessSection"),
  { ssr: false, loading: () => sectionSkeleton },
);
