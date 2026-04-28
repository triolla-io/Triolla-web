import type { ReactNode } from "react";
import type { Metadata } from "next";
import NavigationProgress from "@/components/NavigationProgress";
import AccessibilityFix from "@/components/AccessibilityFix";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const DEFAULT_LOCALE = process.env.SITE_DEFAULT_LOCALE ?? "en";
const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);
const IS_RTL = RTL_LOCALES.has(DEFAULT_LOCALE.toLowerCase());

// Pre-hydration visibility fix.
//
// Static HTML is served with the theme's CSS already parsed, so rules like
// `.portfolio_text h1 { opacity:0 }` and `.wow { visibility:hidden }` take
// effect immediately — before React hydrates and adds `.show` to every element.
// This creates a flash of invisible content (FOIC) that lasts until
// useLayoutEffect fires (~100–400ms after first paint).
//
// Fix: while body lacks `.loaded` (set by SnapshotClient after scripts run),
// force all snapshot content to be fully visible. Once `.loaded` lands, this
// rule becomes inert and the theme's .show / .animated CSS takes over — by
// which point flushSnapshotVisibility has already added .show everywhere.
//
// WOW.js keeps `visibility:hidden` until `.animated` is added on scroll; since
// snapshots don't animate on scroll we override that globally too.
const PRE_HYDRATION_FIX = `
body:not(.loaded) [data-snapshot-client],
body:not(.loaded) [data-snapshot-client] *{opacity:1!important;visibility:visible!important}
body:not(.loaded) [data-snapshot-client] .hover-text,
body:not(.loaded) [data-snapshot-client] .button-overlay{opacity:0!important;visibility:hidden!important}
body:not(.loaded) [data-snapshot-client] .portfolio_text h1,
body:not(.loaded) [data-snapshot-client] .portfolio_text h4,
body:not(.loaded) [data-snapshot-client] .portfolio_text .postfolio_banner_but,
body:not(.loaded) [data-snapshot-client] .portfolio_text .arbackbut{bottom:0!important}
.wow{visibility:visible!important}
`;

// HEADER_OFFSET_FIX
// Raise the ticker above the header: SCROLL_PERF_FIX bumps .header to z-index:100 for
// GPU compositing — without this override .headerticker (z:99 in theme CSS) would be
// buried on Vercel where render-blocking <link> stylesheets apply before JS runs.
// NOTE: do NOT set top:0!important on .header — CSS !important from a stylesheet beats
// JS inline styles (element.style.top), which would prevent the CAS bundle from
// positioning the header below the ticker.
// Also pin .portfolio_text at top:0 — all.js fires a jQuery parallax handler on the
// synthetic window.scroll that SnapshotClient dispatches, computing top=ractWeb.top/8
// (~33px at scroll=0) and applying it as an inline style. On the real site this handler
// only runs when the user actually scrolls, so the initial position is never shifted.
const HEADER_OFFSET_FIX = `
.headerticker{z-index:101!important}
.portfolio_text{top:0!important}
`;

// Scroll performance optimization for sticky header + book-a-call button.
// Removed contain:layout because it breaks button animation sync with header collapse.
const SCROLL_PERF_FIX = `
.header,header{will-change:transform;transform:translateZ(0);z-index:100!important}
.header_book,.hmobbutlftb,.foo_book{will-change:none;transform:translateZ(0);z-index:80;transition:none!important}
.header_menu ul.menu{will-change:none;z-index:99}
`;

// Critical ticker CSS — prevents the vertical-list flash before the CAS bundle loads.
// Targets only .company_triker (the WordPress element class) so it never conflicts
// with jctkr's own .jctkr-wrapper/.jctkr-initialized classes or other elements.
// No !important — jctkr can override freely once its CSS arrives.
const TICKER_FIX = `
.company_triker{overflow:hidden;position:relative}
.company_triker ul{position:relative;white-space:nowrap;list-style:none;padding:0;margin:0}
.company_triker ul li{display:inline-block}
`;

// Portfolio section CLS fix.
//
// The theme animates portfolio items via bottom:-100px→0 (protfolio_img) and
// bottom:-30px→0 (protolio_log/txt/tags/gallery/con) using transitions triggered
// by the .show class. These bottom offsets are measured by Lighthouse as layout
// shifts (CLS ~0.4) because the elements visually jump when .show is added
// after hydration — even though PRE_HYDRATION_FIX already forces opacity:1.
//
// Fix: force bottom:0 + skip transitions for all animated portfolio descendants.
// Using [data-snapshot-client] prefix for higher specificity than the theme's
// plain class selectors (theme uses !important on some rules, so we need the
// attribute selector to win the cascade).
const PORTFOLIO_CLS_FIX = `
[data-snapshot-client] .protfolio_img,
[data-snapshot-client] .protfolio_con,
[data-snapshot-client] .protolio_log,
[data-snapshot-client] .protolio_txt,
[data-snapshot-client] .protolio_tags,
[data-snapshot-client] .protolio_gallery{bottom:0!important;opacity:1!important;transition:none!important}
`;

// Reserve height for owl carousels before owl.js measures them.
// Without this the container collapses to 0 then jumps when items are measured → high CLS.
const OWL_CLS_FIX = `
.owl-carousel:not(.owl-loaded){min-height:200px;overflow:hidden}
.owl-carousel .owl-item img{max-width:100%;height:auto}
`;

// Image quality optimization.
const IMAGE_QUALITY_FIX = `
[data-snapshot-client] img{
  image-rendering:auto;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden
}
[data-snapshot-client] img[width][height]{max-width:100%;height:auto}
`;

// Color contrast fix — ensures WPML language switcher text and animated .show
// spans meet WCAG AA (4.5:1). The mobile header uses a light background so
// wpml-ls-display gets a very dark color; the dark footer overrides that to
// near-white so the language labels remain readable.
const CONTRAST_FIX = `
.wpml-ls-display{color:#1a1a1a!important}
.footlangmenu .wpml-ls-display,
.footer_bot_socail .wpml-ls-display{color:#e8e8e8!important}
`;


// NAV_DROPDOWN_FIX
// ─────────────────────────────────────────────────────────────────────────────
// 1) Header JS gives .header_menu a transform — position:fixed children clip.
//    NAV_HOVER_SCRIPT portals .bigmenu>ul to <body>.
// 2) Visuals match the home bundle stylesheet
//    public/assets/_cas/50400963873c627d18fff6285922768737140a6b22f9a742e17fddbdc43561e8.css
//    (bigmenu: width 843px, padding 20px 390px 23px 36px, promo ::after, etc.)
// 3) Geometry is applied in JS: top = li.top + 68px, left = li.left − 333
//    (or −202px at viewport ≤ 1365px) — same as theme absolute offsets.
// ─────────────────────────────────────────────────────────────────────────────
const NAV_DROPDOWN_FIX = `
/* Hide the portaled panel on every viewport — desktop block below re-enables it */
.nav-dropdown-portal{display:none!important}
@media only screen and (min-width:1200px){
  .nav-dropdown-portal{display:block!important}
  .header{z-index:100!important}
  .header_menu .bigmenu>ul{display:none}

  /* Portal — copied from .header_menu ul.menu li.bigmenu>ul + children rules */
  .nav-dropdown-portal{
    position:fixed;box-sizing:border-box;
    width:843px;max-width:min(843px,100vw - 16px);
    box-shadow:0 32px 28.8px 0 #00000040;
    -webkit-box-shadow:0 32px 28.8px 0 #00000040;
    /* Base fill + right promo (theme: .bigmenu>ul::after — 380px photo). Stacked
       backgrounds on the <ul> keep valid HTML (no div inside <ul>) and work
       after portaling, unlike ::after in some cascade edge cases. */
    /* !important: beat any theme ul/sub-menu background reset after the panel moves to body */
    background-color:#fff !important;
    background-image:url(/wp-content/uploads/2025/06/menu-image2.png) !important;
    background-repeat:no-repeat !important;
    background-position:right top !important;
    background-size:380px 100% !important;
    background-clip:padding-box !important;
    border-radius:15px;
    -webkit-border-radius:15px;
    z-index:99;
    padding:20px 390px 23px 36px;
    font-size:0;
    overflow:hidden;
    opacity:0;
    pointer-events:none;
    /* Snappy open/close (theme used .3s — feels slow on local dev) */
    transition:opacity .1s ease-out;
    -webkit-transition:opacity .1s ease-out;
  }
  /* RTL mirror: image moves to the left, padding flips so the 390px reserve is on the left. */
  html[dir="rtl"] .nav-dropdown-portal,
  .rtl .nav-dropdown-portal{
    background-image:url(/wp-content/uploads/2025/05/menuimg.jpg) !important;
    background-position:left top !important;
    padding:20px 36px 23px 390px;
    direction:rtl;
  }
  html[dir="rtl"] .nav-dropdown-portal>li,
  .rtl .nav-dropdown-portal>li{
    padding:0 0 0 10px;
  }
  html[dir="rtl"] .nav-dropdown-portal>li:last-child,
  .rtl .nav-dropdown-portal>li:last-child{
    padding:0;
  }
  html[dir="rtl"] .nav-dropdown-portal>li>ul>li,
  .rtl .nav-dropdown-portal>li>ul>li{
    text-align:right;
  }
  .nav-dropdown-portal.open{opacity:1;pointer-events:all}
  .nav-dropdown-portal::before{
    content:'';width:100%;height:46px;background:0 0;display:block;
    left:0;position:absolute;top:-40px;
  }

  .nav-dropdown-portal>li{
    display:inline-block;vertical-align:top;
    width:234px;padding:0 10px 0 0;position:relative;z-index:1;
  }
  .nav-dropdown-portal>li:last-child{width:182px;padding:0}
  .nav-dropdown-portal>li>a{display:none}
  .nav-dropdown-portal>li>ul{
    margin:0;padding:0;list-style:none;opacity:1;transition:none;
  }
  .nav-dropdown-portal>li>ul>li{
    display:block;padding:0;margin:0;width:100%;text-align:left;
  }
  .nav-dropdown-portal>li>ul>li:last-child{margin-bottom:0}
  .nav-dropdown-portal>li>ul>li>a{
    font-size:20px;color:#000;font-family:SFProText,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:510;line-height:41px;padding:0;display:block;text-decoration:none;white-space:nowrap;
  }
  html[dir="rtl"] .nav-dropdown-portal>li>ul>li>a,
  .rtl .nav-dropdown-portal>li>ul>li>a{font-weight:400}
  .nav-dropdown-portal>li>ul>li>a:hover{color:#3088ef}
}
`;

// Portal-based dropdown script.
//
// .header_menu gets transform:scale(1) from the header JS, making it a CSS
// containing block for position:fixed. To escape that, we move the dropdown
// panel to document.body (portal pattern) and position it with JS each time
// the dropdown opens, so it always sits exactly below the nav pill regardless
// of viewport size or scroll state.
// Patch jctkr to never re-initialize elements that already carry
// .jctkr-initialized (i.e. the snapshot HTML). Runs before any WordPress JS
// so the patch is in place when jQuery.fn.jctkr is first defined.
const JCTKR_PATCH = `(function(){
  function patch($){
    if(!$ || !$.fn || !$.fn.jctkr || $.fn.__jctkrPatched)return;
    var orig=$.fn.jctkr;
    $.fn.jctkr=function(){
      var args=arguments;
      return this.each(function(){
        if(this.classList&&this.classList.contains('jctkr-initialized'))return;
        orig.apply($(this),args);
      });
    };
    $.fn.__jctkrPatched=true;
  }
  // Patch immediately if jQuery is already loaded, then re-patch on every
  // script load so it catches the moment jctkr.js is first evaluated.
  patch(window.jQuery||window.$);
  var _orig=document.createElement.bind(document);
  document.createElement=function(tag){
    var el=_orig(tag);
    if(tag.toLowerCase()==='script'){
      el.addEventListener('load',function(){patch(window.jQuery||window.$);},true);
    }
    return el;
  };
})();`;

const NAV_HOVER_SCRIPT = `(function(){
  function init(){
    if(window.innerWidth<1200)return;
    var bigmenu=document.querySelector('.header_menu ul.menu>li.bigmenu');
    var panel=bigmenu&&bigmenu.querySelector(':scope>ul');
    if(!bigmenu||!panel)return;

    document.body.appendChild(panel);
    panel.classList.add('nav-dropdown-portal');

    var t;
    var W=843;
    function leftNudge(){
      return window.innerWidth<=1365?202:333;
    }
    function place(){
      var r=bigmenu.getBoundingClientRect();
      var n=leftNudge();
      var l=r.left-n;
      l=Math.max(8,Math.min(l,window.innerWidth-W-8));
      panel.style.left=l+'px';
      panel.style.top=(r.top+68)+'px';
      panel.style.right='auto';
      panel.style.transform='none';
    }
    function show(){
      clearTimeout(t);
      place();
      panel.classList.add('open');
    }
    function hide(){t=setTimeout(function(){panel.classList.remove('open');},80);}
    function onMove(){if(panel.classList.contains('open'))place();}
    bigmenu.addEventListener('mouseenter',show);
    bigmenu.addEventListener('mouseleave',hide);
    panel.addEventListener('mouseenter',show);
    panel.addEventListener('mouseleave',hide);
    window.addEventListener('resize',onMove,{passive:true});
    window.addEventListener('scroll',onMove,{passive:true});
  }
  if(window.innerWidth>=1200){
    if(document.querySelector('.header_menu ul.menu>li.bigmenu')){init();}
    else{var mo=new MutationObserver(function(){
      if(document.querySelector('.header_menu ul.menu>li.bigmenu')){mo.disconnect();init();}
    });mo.observe(document.body||document.documentElement,{childList:true,subtree:true});}
  }
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} dir={IS_RTL ? "rtl" : "ltr"}>
      <head>
        {/* Preload portfolio promo image (LTR default — RTL site preloads via CSS). */}
        <link
          rel="preload"
          as="image"
          href={IS_RTL ? "/wp-content/uploads/2025/05/menuimg.jpg" : "/wp-content/uploads/2025/06/menu-image2.png"}
        />
        {/* Prefetch top-nav pages so clicks feel instant. */}
        <link rel="prefetch" href="/about-us/" />
        <link rel="prefetch" href="/services/" />
        <link rel="prefetch" href="/blog/" />
        <link rel="prefetch" href="/contact-us/" />
        <link rel="prefetch" href="/technology/" />
        {/* Preload critical SFProText fonts — regular + medium are used for all body text.
            Without preload the browser discovers these only after parsing the CSS bundle,
            adding a full extra round-trip before any text can render. */}
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous"
          href="/assets/_cas/76b54f15f034f86867ca1ce49d0c357f0b634a004102df3b38e7bd6a60f82bdc.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous"
          href="/assets/_cas/5440436a2364a491ee9c38eba1e8c2c3c69bedba857b2ee8bec0c12f0e24d2fc.woff2" />
        {/* Preconnect to font servers — speeds up font delivery and reduces FOUT. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        {/* Fallback system fonts while custom fonts load — prevents color/layout shift. */}
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: `html,body{font-family:system-ui,-apple-system,'Segoe UI','Helvetica Neue',sans-serif;color:#333}a{color:#0066cc}` }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: SCROLL_PERF_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: HEADER_OFFSET_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: TICKER_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_CLS_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: OWL_CLS_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: IMAGE_QUALITY_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: NAV_DROPDOWN_FIX }} />
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: CONTRAST_FIX }} />
      </head>
      <body>
        <NavigationProgress />
        <AccessibilityFix />
        {children}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: JCTKR_PATCH }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: NAV_HOVER_SCRIPT }} />
      </body>
    </html>
  );
}
