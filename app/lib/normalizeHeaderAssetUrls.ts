export function normalizeHeaderAssetUrls(html: string): string {
  return html
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
