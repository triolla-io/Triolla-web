import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";

// Generic dependencies for consolidated assets approach
// All pages use the same consolidated CSS/JS files from /assets/_consolidated/

export const DEPS_EN: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets/_consolidated/",
  bodyClass: "port_page_mod",
  dataRsssl: null,
  css: [
    "style.css",
    "svgs-attachment.css",
    "cms-navigation-base.css",
    "cms-navigation.css",
    "style-new.css",
    "responsive.css",
    "animate.css_edabec9e.css",
    "animation.css_2af44128.css",
    "/assets/_shared/jquery.jConveyorTicker.min.css_edabec9e.css",
    "mlstyle.css_2af44128.css",
    "ml-responsive.css_2af44128.css",
    "fonts.css",
  ],
  js: [
    "jquery-3.6.0.min.js_edabec9e.js",
    "/assets/_shared/eb5e45d752068adfb4185f39ea2978f6_jquery.jConveyorTicker.min.js_edabec9e.js",
    "metaview.js_edabec9e.js",
    "gsap.min.js",
    "ScrollTrigger.min.js",
    "wow.js",
    "all.js_a1459148.js",
  ],
  pathEncoding: undefined,
};

export const DEPS_HE: TriollaPortfolioSnapshotDeps = {
  assetBase: "/assets/_consolidated/",
  bodyClass: "port_page_mod",
  dataRsssl: null,
  css: [
    "style.css",
    "svgs-attachment.css",
    "cms-navigation-base.css",
    "cms-navigation.css",
    "style-rtl.min.css_edabec9e.css",
    "style-he.css_edabec9e.css",
    "style-new-he.css_edabec9e.css",
    "responsive-he.css_edabec9e.css",
    "animate.css_edabec9e.css",
    "animation.css_edabec9e.css",
    "/assets/_shared/jquery.jConveyorTicker.min.css_edabec9e.css",
    "mlstyle.css_edabec9e.css",
    "ml-responsive.css_edabec9e.css",
    "fonts.css",
  ],
  js: [
    "jquery-3.6.0.min.js_edabec9e.js",
    "/assets/_shared/eb5e45d752068adfb4185f39ea2978f6_jquery.jConveyorTicker.min.js_edabec9e.js",
    "metaview.js_edabec9e.js",
    "gsap.min.js",
    "ScrollTrigger.min.js",
    "wow.js_edabec9e.js",
    "all.js_edabec9e.js",
  ],
  pathEncoding: undefined,
};
