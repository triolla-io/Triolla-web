"use client";

import { useCallback } from "react";
import { TriollaPortfolioSnapshotClient } from "../../lib/TriollaPortfolioSnapshotClient";
import type { TriollaPortfolioSnapshotDeps } from "../../lib/TriollaPortfolioSnapshotClient";
import { mountTriollaBlogLoadMore } from "../../lib/mountTriollaBlogLoadMore";
import blogDeps from "../../blog/blog-deps.json";

const heBlogFallbackDeps: TriollaPortfolioSnapshotDeps = {
  ...(blogDeps as TriollaPortfolioSnapshotDeps),
  // Keep the working English fallback assets, but preserve Hebrew/RTL layout semantics.
  bodyClass: `rtl ${(blogDeps as TriollaPortfolioSnapshotDeps).bodyClass}`,
};

export function HeBlogClient() {
  const afterScripts = useCallback((root: HTMLElement) => mountTriollaBlogLoadMore(root), []);

  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl="/fragments/blog-body.html"
      deps={heBlogFallbackDeps}
      pageLabel="בלוג"
      landingSlug="triolla-io-blog"
      assetDir="blog"
      lang="he"
      afterScripts={afterScripts}
    />
  );
}
