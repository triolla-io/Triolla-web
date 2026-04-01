"use client";

import { TriollaPortfolioSnapshotClient } from "../lib/TriollaPortfolioSnapshotClient";
import type { TriollaPortfolioSnapshotDeps } from "../lib/TriollaPortfolioSnapshotClient";

export type BlogPostClientProps = {
  slug: string;
  deps: TriollaPortfolioSnapshotDeps;
};

export function BlogPostClient({ slug, deps }: BlogPostClientProps) {
  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl={`/fragments/blog-${slug}-body.html`}
      deps={deps}
      pageLabel={slug}
      landingSlug={`triolla-io-blog-${slug}`}
      assetDir={`blog-${slug}`}
    />
  );
}
