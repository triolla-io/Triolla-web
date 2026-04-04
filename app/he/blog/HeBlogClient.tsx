"use client";

import { useCallback } from "react";
import { TriollaPortfolioSnapshotClient } from "../../lib/TriollaPortfolioSnapshotClient";
import type { TriollaPortfolioSnapshotDeps } from "../../lib/TriollaPortfolioSnapshotClient";
import { mountTriollaBlogLoadMore } from "../../lib/mountTriollaBlogLoadMore";
import deps from "./blog-he-deps.json";

export function HeBlogClient() {
  const afterScripts = useCallback((root: HTMLElement) => {
    const gsapWin = window as unknown as {
      gsap?: { registerPlugin?: (plugin: unknown) => void };
      ScrollTrigger?: unknown;
    };
    if (gsapWin.gsap?.registerPlugin && gsapWin.ScrollTrigger) {
      gsapWin.gsap.registerPlugin(gsapWin.ScrollTrigger);
    }
    return mountTriollaBlogLoadMore(root);
  }, []);

  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl="/fragments/blog-he-body.html"
      deps={deps as TriollaPortfolioSnapshotDeps}
      pageLabel="Hebrew Blog"
      landingSlug="triolla-io-he-blog"
      assetDir="_consolidated"
      lang="he"
      afterScripts={afterScripts}
    />
  );
}
