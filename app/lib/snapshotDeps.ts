import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

// Generic dependencies for consolidated assets approach
// All pages use the same consolidated CSS/JS files from /assets/_shared/

export const DEPS_EN: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets",
  bodyClass: "port_page_mod",
  dataRsssl: null,
  css: [
    "_shared/style.css.css",
    "_shared/cms-navigation-base.css.css",
    "_shared/cms-navigation.css.css",
    "_shared/style-new.css.css",
    "_shared/responsive.css.css",
    "_shared/animate.css.css",
    "_shared/animation.css.css",
    "_shared/jquery.jConveyorTicker.min.css.css",
    "_shared/mlstyle.css.css",
    "_shared/ml-responsive.css.css",
    "_shared/fonts.css",
  ],
  js: [
    "_shared/jquery-3.6.0.min.js.js",
    "_shared/jquery.jConveyorTicker.min.js.js",
    "_shared/metaview.js.js",
    "_shared/wow.js.js",
    "_shared/all.js.js",
  ],
  pathEncoding: undefined,
};

export const DEPS_HE: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets",
  /** Match WP Hebrew body (`rtl`); theme rules often scope under `.rtl`. */
  bodyClass: "port_page_mod rtl",
  dataRsssl: null,
  css: [
    "_shared/style.css.css",
    "_shared/cms-navigation-base.css.css",
    "_shared/cms-navigation.css.css",
    "_shared/style-rtl.min.css.css",
    "_shared/style-he.css.css",
    "_shared/style-new-he.css.css",
    "_shared/responsive-he.css.css",
    "_shared/animate.css.css",
    "_shared/animation.css.css",
    "_shared/jquery.jConveyorTicker.min.css.css",
    "_shared/mlstyle.css.css",
    "_shared/rtl.css.css",
    "_shared/ml-responsive.css.css",
    "_shared/fonts.css",
  ],
  js: [
    "_shared/jquery-3.6.0.min.js.js",
    "_shared/jquery.jConveyorTicker.min.js.js",
    "_shared/metaview.js.js",
    "_shared/wow.js.js",
    "_shared/all.js.js",
  ],
  pathEncoding: undefined,
};
