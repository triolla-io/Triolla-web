import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

// Generic dependencies for consolidated assets approach
// All pages use the same consolidated CSS/JS files from /assets/_shared/

export const DEPS_EN: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets",
  bodyClass: "port_page_mod",
  dataRsssl: null,
  css: [
    "_shared/style.css",
    "_shared/cms-navigation-base.css",
    "_shared/cms-navigation.css",
    "_shared/style-new.css",
    "_shared/responsive.css",
    "_shared/animate.css",
    "_shared/animation.css",
    "_shared/jquery.jConveyorTicker.min.css",
    "_shared/mlstyle.css",
    "_shared/ml-responsive.css",
    "_shared/fonts.css",
  ],
  js: [
    "_shared/jquery-3.6.0.min.js",
    "_shared/jquery.jConveyorTicker.min.js",
    "_shared/metaview.js",
    "_shared/wow.js",
    "_shared/all.js",
  ],
  pathEncoding: undefined,
};

export const DEPS_HE: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets",
  /** Match WP Hebrew body (`rtl`); theme rules often scope under `.rtl`. */
  bodyClass: "port_page_mod rtl",
  dataRsssl: null,
  css: [
    "_shared/style.css",
    "_shared/cms-navigation-base.css",
    "_shared/cms-navigation.css",
    "_shared/style-rtl.min.css",
    "_shared/style-he.css",
    "_shared/style-new-he.css",
    "_shared/responsive-he.css",
    "_shared/animate.css",
    "_shared/animation.css",
    "_shared/jquery.jConveyorTicker.min.css",
    "_shared/mlstyle.css",
    "_shared/rtl.css",
    "_shared/ml-responsive.css",
    "_shared/fonts.css",
  ],
  js: [
    "_shared/jquery-3.6.0.min.js",
    "_shared/jquery.jConveyorTicker.min.js",
    "_shared/metaview.js",
    "_shared/wow.js",
    "_shared/all.js",
  ],
  pathEncoding: undefined,
};
