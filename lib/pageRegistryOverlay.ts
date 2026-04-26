/**
 * Phase 4 — User-created pages layered on top of `snapshotRegistry.json`.
 * Catch-all route + runtime registry would read from here.
 */
export type OverlayPageEntry = {
  slug: string;
  locale: string;
  fragment: string;
  title: string;
};

export const overlayPageRegistry: OverlayPageEntry[] = [];
