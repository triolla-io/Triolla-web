/**
 * Maps desktop portfolio screenshot paths to WP `img.two` mobile assets (350×270 typical).
 * Used with `PortfolioItem` — spread onto each item: `...portfolioMobileFor("/images/….png")`.
 * Add entries when `*-mobile.png` exists in `public/images/` or on triolla.io uploads.
 * Not yet mapped (desktop-only below `min-[1200px]`): e.g. Luxon/Plus500, Cha/Aspire/Survivor gaming, agritech Frames except 4067-2.
 * @see https://triolla.io
 */

export type PortfolioMobileFields = {
  imageMobile: string;
  imageMobileWidth: number;
  imageMobileHeight: number;
};

const m = (
  imageMobile: string,
  imageMobileWidth = 350,
  imageMobileHeight = 270,
): PortfolioMobileFields => ({
  imageMobile,
  imageMobileWidth,
  imageMobileHeight,
});

/** Desktop `image` path → mobile fields. Entries without a WP mobile asset are omitted (desktop-only below `min-[1200px]`). */
export const PORTFOLIO_MOBILE_BY_DESKTOP: Record<string, PortfolioMobileFields> = {
  // cyber-security
  "/images/Armis-desktop.png": m("/images/Armis-mobile.png"),
  "/images/Suridata-desktop.png": m("/images/Suridata-mobile.png"),
  "/images/Okta-desktop.png": m("/images/Okta-mobile.png"),
  "/images/Safebridge-desktop.png": m("/images/Safebridge-mobile.png"),
  "/images/Cyngular-desktop.png": m("/images/Cyngular-mobile.png"),

  // device-iot / agritech (shared Frame asset for Bermad)
  "/images/Frame-2147224067-2.png": m("/images/Bermad-mobile.png"),
  "/images/Essence-desktop.png": m("/images/Essence-mobile.png"),
  "/images/Tadiran.png": m("/images/Tadiran-mobile.png"),
  "/images/Novetto-desktop.png": m("/images/Novetto-mobile.png"),
  "/images/Ayyeka-desktop.png": m("/images/Ayyeka-mobile.png"),
  "/images/Arkit-desktop.png": m("/images/Arkit-mobile.png"),

  // saas-platforms
  "/images/Jfrog-desktop.png": m("/images/Jfrog-mobile.png"),
  "/images/Playtika-desktop-2.png": m("/images/Playtika-mobile-2.png"),
  "/images/Taboola-desktop.png": m("/images/Taboola-mobile.png"),
  "/images/Juxta-desktop.png": m("/images/Juxta-mobile.png"),
  "/images/Layer-x-desktop.png": m("/images/Layer-x-mobile.png"),
  "/images/melingo-desktop-1-1.png": m("/images/melingo-mobile-1-1.png"),
  "/images/plain-id-desktop.png": m("/images/plain-id-mobile.png"),

  // fintech-finance
  "/images/Altshuler-desktop.png": m("/images/Altshuler-mobile-1.png"),
  "/images/Splitit-desktop.png": m("/images/Splitit-mobile.png"),
  "/images/IBI-desktop.png": m("/images/IBI-mobile.png"),

  // b2b
  "/images/adam-milo-desktop.png": m("/images/adam-milo-mobile.png"),
  "/images/Percepto-Desktop.png": m("/images/Percepto-Mobile.png"),
  "/images/Comax-Desktop-1.png": m("/images/Comax-Mobile.png"),
  "/images/Solaredge-Desktop.png": m("/images/Solaredge-Mobile.png", 351, 270),

  // gaming
  "/images/Playtika-desktop.png": m("/images/Playtika-mobile.png"),
  "/images/Eternal-overwolf-desktop.png": m("/images/Eternal-overwolf-mobile.png"),
  "/images/spring-game-desktop.png": m("/images/spring-game-mobile.png"),
  "/images/my-town-desktop.png": m("/images/my-town-mobile.png"),
  "/images/BabyTV-desktop.png": m("/images/BabyTV-mobile.png"),

  // medical-healthcare
  "/images/Ichilov-image-desktop.png": m("/images/Ichilov-mobile.png"),
  "/images/Sweetch-image-desktop.png": m("/images/Sweetch-mobile.png"),
  "/images/Edwards-image-desktop.png": m("/images/Edwards-image-mobile.png"),
  "/images/Elasitmed-image-desktop.png": m("/images/Elasitmed-image-mobile.png"),
  "/images/Twist-image-desktop.png": m("/images/Twist-image-mobile.png"),
  "/images/Digitalowl-image-desktop-1.png": m("/images/Digitalowl-image-mobile.png"),
  "/images/Soroka-image-desktop.png": m("/images/Soroka-image-mobile.png"),

  // mobile-apps
  "/images/Sweetch-desktop.png": m("/images/Sweetch-mobile.png"),
  "/images/Melingo-desktop.png": m("/images/Melingo-mobile.png"),
  "/images/Passport-card-desktop.png": m("/images/Passport-card-mobile.png"),
  "/images/Hot-desktop.png": m("/images/Hot-mobile.png"),

  // b2c
  "/images/Intel-Desktop.png": m("/images/Intel-mobile.png"),
  "/images/altshuler-desktop1.png": m("/images/Altshuler-mobile-1.png"),
  "/images/Sweetch-image-desktop-1.png": m("/images/Sweetch-mobile-1.png"),
  "/images/melingo-desktop1.png": m("/images/melingo-mobile1.png"),
  "/images/all-jobs-desktop-1.png": m("/images/all-jobs-mobile-1.png"),
  "/images/Skideal-desktop-1.png": m("/images/Skideal-mobile-1.png"),
  "/images/Passport-card-desktop-1.png": m("/images/Passport-card-mobile-1-1.png"),

  // dev
  "/images/Jfrog-desktop-1.png": m("/images/Jfrog-mobile-1.png"),

  // startups-tech
  "/images/Natiral-Intelligence-Desktop.png": m("/images/Natiral-Intelligence-Mobile.png"),
  "/images/Iron-Source-Desktop.png": m("/images/Iron-Source-Mobile.png"),
  "/images/Taboola-desktop-2.png": m("/images/Taboola-mobile-2.png"),
  "/images/Electreon-Desktop.png": m("/images/Electreon-Mobile.png"),
  "/images/WalkMe-Deskop.png": m("/images/WalkMe-Mobile.png"),
};

export function portfolioMobileFor(desktopImage: string): Partial<PortfolioMobileFields> {
  const fields = PORTFOLIO_MOBILE_BY_DESKTOP[desktopImage];
  return fields ? { ...fields } : {};
}
