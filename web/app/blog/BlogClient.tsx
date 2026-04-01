"use client";

import { useCallback } from "react";
import { TriollaPortfolioSnapshotClient } from "../lib/TriollaPortfolioSnapshotClient";
import type { TriollaPortfolioSnapshotDeps } from "../lib/TriollaPortfolioSnapshotClient";
import { mountTriollaBlogLoadMore } from "../lib/mountTriollaBlogLoadMore";
import deps from "./blog-deps.json";

export function BlogClient() {
  const afterScripts = useCallback((root: HTMLElement) => mountTriollaBlogLoadMore(root), []);

  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl="/fragments/blog-body.html"
      deps={deps as TriollaPortfolioSnapshotDeps}
      pageLabel="Blog"
      landingSlug="triolla-io-blog"
      assetDir="blog"
      afterScripts={afterScripts}
    />
  );
}
