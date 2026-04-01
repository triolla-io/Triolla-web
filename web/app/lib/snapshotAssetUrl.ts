/**
 * Flat _assets/ mirrors use plain filenames. WordPress tree mirrors use paths
 * like wp-content/.../file.js?ver=x — encode each segment so "?" is not treated
 * as a URL query when loading from Next public/.
 *
 * If `?` is left unencoded in the path, the browser splits at `?` and requests
 * `file.js` (404) instead of the on-disk name `file.js?ver=...`.
 */
export function snapshotAssetUrl(
  assetBase: string,
  relativePath: string,
  /** JSON deps use a plain `string`; only `"segments"` enables per-segment encoding. */
  pathEncoding?: "segments" | string,
): string {
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }
  if (relativePath.startsWith("/")) {
    return relativePath;
  }
  const base = assetBase.replace(/\/$/, "");
  const useSegments =
    pathEncoding === "segments" || relativePath.includes("?");
  if (!useSegments) {
    return `${base}/${relativePath}`;
  }
  return `${base}/${relativePath.split("/").map(encodeURIComponent).join("/")}`;
}
