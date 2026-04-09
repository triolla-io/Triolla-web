"use client";

import { BlogPostClient } from "../lib/BlogPostClient";
import type { TriollaPortfolioSnapshotDeps } from "../lib/TriollaPortfolioSnapshotClient";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function BlogMedicalControlTowerClient({ lang = "en" }: TriollaLangProps) {
  const deps: TriollaPortfolioSnapshotDeps = {
    assetBase: "/assets/blog-medical-control-tower",
    bodyClass: "wp-singular post-template-default single single-post postid-4700 single-format-standard wp-theme-triolla",
    dataRsssl: "1",
    css: [],
    js: [],
  };

  return <BlogPostClient slug="medical-control-tower" deps={deps} />;
}
