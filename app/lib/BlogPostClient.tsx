"use client";

import { TriollaPortfolioSnapshotClient } from "./TriollaPortfolioSnapshotClient";
import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

export type BlogPostClientProps = {
  slug: string;
  deps: TriollaPortfolioSnapshotDeps;
  /**
   * Strip the snapshot header and inject blog chrome (EN/HE). Required for `/he/blog/*` fallbacks
   * that reuse English fragments so headers use a real `assetBase` instead of an empty per-slug folder.
   */
  snapshotLang?: "en" | "he";
};

export function BlogPostClient({ slug, deps, snapshotLang }: BlogPostClientProps) {
  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl={`/fragments/blog-${slug}-body.html`}
      deps={deps}
      pageLabel={slug}
      landingSlug={`triolla-io-blog-${slug}`}
      assetDir={`blog-${slug}`}
      {...(snapshotLang
        ? {
            lang: snapshotLang,
            chromeUrl:
              snapshotLang === "he"
                ? "/fragments/blog-chrome-he.html"
                : "/fragments/blog-chrome-en.html",
          }
        : {})}
    />
  );
}
