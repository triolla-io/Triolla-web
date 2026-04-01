import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

/** Derive fragment URL, public/assets dir, and landing-page slug from Hebrew snapshot deps. */
export function heSnapshotPathsFromDeps(depsHe: TriollaPortfolioSnapshotDeps) {
  const assetDirHe = depsHe.assetBase.replace(/^\/assets\//, "");
  const fragmentUrlHe = `/fragments/${assetDirHe}-body.html`;
  const landingSlugHe = `triolla-io-${assetDirHe.replace(/-he$/, "")}`;
  return { assetDirHe, fragmentUrlHe, landingSlugHe };
}
