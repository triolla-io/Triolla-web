"use client";

import { TriollaBilingualPortfolioSnapshotClient } from "./TriollaBilingualPortfolioSnapshotClient";
import { heSnapshotPathsFromDeps } from "./heSnapshotPathsFromDeps";
import {
  bilingualSnapshotRegistryTyped,
  type BilingualSnapshotRegistryKey,
} from "./bilingualSnapshotRegistry";
import type { TriollaLangProps } from "./triollaLangProps";

export function BilingualSnapshotByRegistryKey({
  pageKey,
  lang = "en",
}: TriollaLangProps & { pageKey: BilingualSnapshotRegistryKey }) {
  const entry = bilingualSnapshotRegistryTyped[pageKey];
  const heResolved = entry.hePathsFromDeps
    ? heSnapshotPathsFromDeps(entry.depsHe)
    : {
        fragmentUrlHe: entry.fragmentUrlHe as string,
        landingSlugHe: entry.landingSlugHe as string,
        assetDirHe: entry.assetDirHe as string,
      };
  return (
    <TriollaBilingualPortfolioSnapshotClient
      lang={lang}
      depsEn={entry.depsEn}
      depsHe={entry.depsHe}
      fragmentUrlEn={entry.fragmentUrlEn}
      fragmentUrlHe={heResolved.fragmentUrlHe}
      pageLabel={entry.pageLabel}
      landingSlugEn={entry.landingSlugEn}
      landingSlugHe={heResolved.landingSlugHe}
      assetDirEn={entry.assetDirEn}
      assetDirHe={heResolved.assetDirHe}
      revealPreset={entry.revealPreset}
    />
  );
}
