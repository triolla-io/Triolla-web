const SHARED_SNAPSHOT_SVGS =
  /\/assets\/[^"'\s/]+\/(togleclose|tickerxlose|calenderimg|phmobicon|whatmobicon)\.svg/gi;

/** Triolla chrome SVGs mirrored once under public/assets/_shared; deps use varying assetBase slugs. */
export function normalizeHeaderAssetUrls(html: string): string {
  return html
    .replace(SHARED_SNAPSHOT_SVGS, "/assets/_shared/$1.svg")
    .replace(
      /\/assets\/[^"'\s]+\/logo_new\.png/gi,
      "/images/logo_triolla.svg",
    )
    .replaceAll(
      "https://triolla.io/wp-content/themes/triolla/images/hamburger.svg",
      "/images/hamburger.svg",
    )
    .replaceAll(
      "https://triolla.io/wp-content/themes/triolla/images/hamburger_white.svg",
      "/images/hamburger_white.svg",
    )
    .replace(/\/assets\/[^"'\s]+\/hamburger\.svg/gi, "/images/hamburger.svg")
    .replace(/\/assets\/[^"'\s]+\/hamburger_white\.svg/gi, "/images/hamburger_white.svg");
}
