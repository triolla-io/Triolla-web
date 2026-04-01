---
name: triolla-html-to-react
description: Convert downloaded triolla.io landing pages to Next.js React components. Covers snapshots, dependency arrays, legacy script loading, fragment injection, restoring stripped inline behavior (.show, carousels), explicit mounts when theme JS uses DOMContentLoaded or script dedupe breaks re-runs, and fixing CSS url(images/...) vs flat asset mirrors. Use when converting triolla.io pages to Next.js or debugging missing UI after snapshot import.
---

# triolla.io → React Converter

Project-specific workflow for converting downloaded triolla.io pages into Next.js components.

**Core skill for dependency analysis and useEffect generation:**
→ Read and follow `~/.cursor/skills/dependencies-aware-react-converter/SKILL.md`

---

## Project Layout

```
html-to-react/
└── landing-page/
    └── <page-slug>/          ← INPUT ONLY (see “After conversion” below)
        ├── _download_snapshot.py   ← one-off download script (safe to delete)
        ├── index.html              ← downloaded page with rewritten asset paths
        └── _assets/                ← all CSS, JS, fonts, SVGs for the page
```

### After conversion: React only for the live page

Once a route exists under **`web/`**, treat that as the **only** surface you ship, preview, and link to:

- **Do not** use `landing-page/.../index.html` as the product (no `file://`, no separate static host for that HTML).
- **Do not** iframe the raw snapshot for the real UX — the Next.js route (`/about-us`, etc.) is canonical.
- **`landing-page/`** stays useful only as an **optional regeneration source** when you re-run `extract_snapshot_fragment.py` after upstream HTML changes. If you later replace the fragment with hand-written JSX, you can archive or delete that snapshot folder.

The **`public/fragments/*.html`** files are static **data** consumed by the React client loader — not a standalone page users should open; browsing still happens via **Next.js**.

---

Output lives in the Next.js app under `web/`:

```
web/app/<route>/page.tsx              ← server component + metadata
web/app/<route>/<Name>Client.tsx      ← client: load CSS/JS, inject fragment
web/app/<route>/<slug>-deps.json      ← assetBase, bodyClass, css[], js[]
web/public/fragments/<slug>-body.html ← body inner HTML, all <script> removed
web/public/assets/<page-slug>/        ← copy of landing-page/.../_assets/
web/scripts/extract_snapshot_fragment.py   ← regenerates fragment + deps from landing-page HTML
```

---

## Next.js: generic HTML snapshot page (no iframe)

Use this pattern for **any** triolla page, not only About Us.

### 1. Per-page artifacts

| Artifact | Role |
|----------|------|
| `public/assets/<slug>/` | Static mirror of `_assets/`; URLs in HTML become `/assets/<slug>/…` |
| `public/fragments/<slug>-body.html` | Contents of `<body>` with every `<script>…</script>` removed (React will not execute inline script from strings) |
| `<slug>-deps.json` | `assetBase`, optional `bodyClass` / `dataRsssl`, ordered `css[]` and `js[]` filenames matching files in `public/assets/<slug>/` |
| Client component | Sequentially inject `<link rel="stylesheet">`, set `innerHTML` from the fragment, sequentially append `<script src>`, then run small hooks (e.g. Lottie init). After inject, call **`mountTriollaSnapshotRevealStack(root, preset)`** once (`preset`: **`"technology"`** for almost all pages, **`"about"`** for About Us) — see `web/app/lib/mountTriollaSnapshotRevealStack.ts`. The stack **defers** arming observers until after `requestAnimationFrame` ×2 + `setTimeout(0)` so the snapshot root is not still `visibility: hidden` (otherwise sections like **`.abthretop`** / **`.abthrebot`** on home may never get `.show`). Use **`threshold: 0`** on reveal `IntersectionObserver`s so short blocks still intersect. |

Generate the fragment and JSON with **`web/scripts/extract_snapshot_fragment.py`** (defaults = about-us; pass `--html`, `--out-body`, `--out-deps`, `--asset-base`, and optionally `--local-prefix` for non-`_assets/` snapshots). If the snapshot still uses absolute **`https://triolla.io/...`** asset URLs (WordPress tree under `landing-page/<slug>/` instead of `_assets/`), pass **`--rewrite-origin https://triolla.io`**: the script rewrites the body to `assetBase`, emits **`pathEncoding: "segments"`** in JSON, and the client must load each file via per-segment encoding (see **`web/app/lib/snapshotAssetUrl.ts`**). From `web/`: **`npm run sync:about`** / **`npm run sync:technology`** run the extractor (technology also rsyncs the mirror into `public/assets/`).

### 2. Why whole sections look “missing” (opacity 0)

triolla theme CSS (e.g. `style-new.css`) often sets headings and columns to **`opacity: 0`** until a parent gains **`.show`**. On WordPress, **inline `<script>`** blocks add `.show` on scroll (often via jQuery and `$.fn.visible`).

When you **strip `<script>` tags** from the body fragment (required for safe React injection), that logic disappears → content stays invisible even though the HTML is present.

**Restore generically:**

1. Grep the source `index.html` for **`addClass('show')`** / **`addClass("show")`** and collect **selector strings** (also check scripts **after `</body>`** — broken exports sometimes place them there; those never land in the body fragment).
2. After external JS has loaded, use **`IntersectionObserver`** (viewport) to add **`show`** when each target enters view — same outcome as scroll + `.visible(true)`, without depending on stripped inline code.
3. If the source calls **`equalheight('…')`** after load, the theme defines **`window.equalheight`** in `all.js` — invoke the same selectors on **`resize`** and once after paint. Home **`.abthrebot`** rectangles use **`equalheight('.abthrebotdiv')`** and **`equalheight('.abthrebottxt h5')`**; **`mountTechnologyReveal`** runs **`runTriollaEqualheightInRoot`** from **`web/app/lib/runTriollaEqualheight.ts`** after `.show` and on resize (not only the About page).

Keep selectors in a **dedicated module** per page (e.g. `aboutUsReveal.ts`) or drive them from a small JSON list if many pages share behavior.

**Portfolio template pages** (`page-template-page-portfolio`, e.g. cyber-security, gaming, fintech) need **extra** restoration beyond generic `.show` blocks:

1. **`.loaded` on an ancestor of `.portfoli_lists`:** Theme CSS uses `.loaded .portfoli_lists ul li .protfolio_img` and `.loaded .portfoli_lists ul li .protfolio_con` to move columns from `opacity:0` to visible. On WordPress, **`all.js`** registers `$(window).on('load', () => jQuery('body').addClass('loaded'))` (often after ~800ms). In Next.js, **`window` `load` has usually already fired** when scripts load dynamically, so **`body` never gets `loaded`**. The snapshot is also injected inside a **wrapper div** (WordPress `bodyClass`), not the real `<body>`. **Fix:** add class **`loaded`** to that **snapshot root** after the same delay (e.g. 800ms), scoped with cleanup on unmount. Implemented inside **`mountTriollaPortfolioTemplateFixes`** — do **not** call it directly from new routes; use **`mountTriollaSnapshotRevealStack(root, "technology")`** (or **`"about"`**), which always composes portfolio fixes + the right reveal preset.

2. **Per-row `.show` on `.protfolio_con` and `.protfolio_img`:** The saved HTML contains **inline jQuery** that runs on scroll and does `$('.rownumberN .protfolio_con').addClass('show')` (and the image column). Those `<script>` blocks are **stripped** from the fragment. Without them, **inner** blocks (`.protolio_log`, `.protolio_txt`, tags) stay at **`opacity:0`** (see `.portfoli_lists ul li .show .protolio_log` in `style.css`). **Fix:** **`IntersectionObserver`** on each **`.portfoli_lists > ul > li`**, then add **`show`** to **`.protfolio_con`** and **`.protfolio_img`** inside that row. Same module as above.

3. **Hero `.portfolio_text`:** The banner uses `.portfolio_text.show h1` etc. Ensure **`.portfolio_text`** is included in the shared **`SHOW_SELECTORS`** for **`mountTechnologyReveal`** (see **`web/app/technology/technologyReveal.ts`**) or the page-specific reveal module.

4. **Above-the-fold blocks:** After wiring the observer, **flush** elements already in the viewport (double **`requestAnimationFrame`** + bounding rect check) so **`partners_with`** (“50+ … and counting”) and the hero are not stuck until a scroll event.

5. **Avoid stale duplicate reveal modules:** If you add a `[lang]/…/technologyReveal.ts` copy, it will **drift** from **`app/technology/technologyReveal.ts`** and drop selectors. Import the **single** shared module instead.

### 3. Theme fonts (`fonts.css`) — relative `url(...)` and missing binaries

Browser **“Save Page As”** snapshots and many flat mirrors copy **`fonts.css`** but often **omit** the actual **`.woff2` / `.woff` / `.ttf`** files. The triolla theme’s `fonts.css` uses **`url('SomeFont.woff2')` paths relative to the CSS file**. When the Next.js client loads **`/assets/<slug>/fonts.css`**, the browser resolves those URLs to **`/assets/<slug>/SomeFont.woff2`**. Missing files → **404** → typography falls back to system fonts (“fonts are wrong” or “missing”).

**Canonical URLs on production (do not guess paths):**
- Stylesheet: **`https://triolla.io/wp-content/themes/triolla/fonts/fonts.css`**
- Font files: same directory — **`https://triolla.io/wp-content/themes/triolla/fonts/<filename>`**

Wrong guesses (e.g. `.../themes/triolla/assets/fonts/...`) **404**; verify with `curl -I` if unsure.

**Preferred fix for snapshot routes (localhost-safe, no cross-origin font CORS issues):**
1. Place the **official** `fonts.css` from the URL above into **`public/assets/<slug>/fonts.css`** (keep its relative `url(...)` as-is).
2. Download every **`woff2`** referenced in that file (and any **`woff`-only** entries, e.g. some **`almoni-dl-*`** rules) into **`public/assets/<slug>/`** — **same folder** as `fonts.css`, because paths are sibling-relative.

**Avoid** “fixing” fonts only by pointing `@font-face` at absolute `https://triolla.io/...` while the app runs on **`localhost`**: cross-origin font requests **can fail** if responses lack **`Access-Control-Allow-Origin`** (browsers enforce this for web fonts in many cases).

**`deps.json`:** put **`fonts.css` first** in **`css[]`** (before `style.css` / `style-new.css`) so `@font-face` registers early. This is an **intentional** exception to “match `index.html` order exactly” for the snapshot loader.

**Verify:** DevTools → Network → filter **Font** (or watch **`*.woff2`**) on the route; no **404**s under **`/assets/<slug>/`**.

### 4. Theme bundles that register `DOMContentLoaded` (or equivalent “run once” hooks)

Many theme files wrap setup in **`document.addEventListener('DOMContentLoaded', …)`** or assume the script runs while the document is still parsing. In a Next.js client loader:

- **`DOMContentLoaded` has often already fired** before the bundle executes → the listener never runs → scroll/resize/header/FAQ behaviors silently skip.
- If you **dedupe script tags** (reuse the same `src` across navigations), the file may **not execute again** on a second visit → stale or missing behavior.

**Restore generically (any page):**

1. Grep the loaded theme bundle(s) (`all.js`, `main.js`, etc.) for **`DOMContentLoaded`**, **`readystatechange`**, and one-off **`querySelector`** blocks that attach **window** listeners (scroll, resize).
2. For each block that must run **after** your fragment is in the DOM, reimplement the same logic in a **small module** that takes **`root: HTMLElement`**, uses **`root.querySelector`** (not bare `document` unless intentional), and returns a **dispose** function: remove listeners, clear timeouts, reset inline styles you set.
3. Call that mount from the same `useEffect` that finishes after **HTML + JS** load; in the effect **cleanup**, call **dispose** (same pattern as `.show` restoration).

Dispatching synthetic **`DOMContentLoaded`** / **`load`** events is unreliable for code that registered **before** the dispatch or for deduped scripts — prefer explicit mounts.

### 5. CSS `url(...)` vs flat asset mirrors

Stylesheets often use paths **relative to the CSS file**, e.g. **`url(images/icon.svg)`**, which resolves to **`/assets/<slug>/images/icon.svg`**. Snapshot tools frequently flatten everything into **one folder** (`_assets/` or `public/assets/<slug>/`) with **no `images/` subdirectory** → the browser **404s** those URLs → missing icons, FAQ toggles, menu carets, background textures, etc.

**Concrete header example (Portfolio dropdown caret):** In **`responsive.css`**, the rule **`.header_menu ul.menu li > a:after`** sets **`background: url(images/menuarowdesk.svg)`**. The SVG is usually saved as **`menuarowdesk.svg`** next to that CSS in the flat mirror. If the path is wrong, the chevron next to **Portfolio** (and other **`.menu-item-has-children`** top-level links) disappears even though **`display:block`** applies. Grep **`menuarowdesk`** / **`menuarowdeskwhite`** in loaded CSS after each asset sync.

**Verify generically:**

1. Grep theme CSS (files you actually load) for **`url(images/`** and **`url(../images/`**.
2. In DevTools **Network**, filter **CSS** / **Img** while loading the route; fix **404**s by either:
   - creating **`public/assets/<slug>/images/`** and placing the referenced files there (matches original theme layout), or
   - rewriting **`url(...)`** in the copied CSS to match the **actual** file locations (e.g. sibling of the `.css` file).

Repeat after re-syncing assets if the extractor overwrites CSS.

### 6. Checklist for each new snapshot route

- [ ] Copy `_assets/` → `web/public/assets/<slug>/`
- [ ] Run extractor: body fragment + `deps.json`; rewrite `_assets/` → `/assets/<slug>/` in the fragment
- [ ] **Fonts:** ensure **`fonts.css`** and **all `url(...)` font files** exist under **`public/assets/<slug>/`** (Save-as snapshots often omit binaries — mirror from **`https://triolla.io/wp-content/themes/triolla/fonts/`**); list **`fonts.css` first** in `deps.json` **`css[]`**
- [ ] Client loads **CSS then HTML then JS** (order in `deps.json` matches `index.html`, except **`fonts.css` first** per subsection 3)
- [ ] Restore **`.show`** (and any **parallax** / **`startani`** logic) from grepped inline scripts
- [ ] After inject: **`mountTriollaSnapshotRevealStack(root, "technology")`** (or **`"about"`** for About Us only). That stack applies portfolio `.loaded` / per-row `.show` when `.portfoli_lists` exists, **`.portfolio_text`** + flush via **`mountTechnologyReveal`**, and avoids per-route duplication.
- [ ] Restore **Owl Carousel** inits (`$('.learslider').owlCarousel({...})`, `.bullet_slider`, `.abmobile`) — they usually live in stripped `$(document).ready()` blocks; without them, carousel markup renders as a **single column list**
- [ ] Call **`equalheight`** if layout depends on it
- [ ] Verify scroll: no invisible blocks when CSS expects `.show`
- [ ] Grep theme JS for **`DOMContentLoaded`** / scroll-only inits; **mount explicitly** under `rootRef` with **cleanup** if the bundle does not run at the right time (SPA + deduped scripts)
- [ ] Grep loaded CSS for **`url(images/...)`**; fix **404** paths vs flat mirror (subfolder or CSS rewrite)

---

## Step 0: Download a Page (if not already downloaded)

Use the `/download` skill to snapshot a triolla.io URL into `landing-page/`:

```
/download https://triolla.io/<page-path>/
```

Or run the existing `_download_snapshot.py` if one was already generated:

```bash
python3 landing-page/<page-slug>/_download_snapshot.py
```

---

## Step 1: Build the Dependency Arrays

Read `index.html` and extract every `<link rel="stylesheet">` and `<script src=...>` in document order. Then classify each as LOAD or SKIP.

### CSS — SKIP rules

Skip a stylesheet if it matches any of these:
- `wp-block-library`, `svgs-attachment`, `wpml-` → WordPress core
- `gdpr`, `moove_gdpr`, `cookie` → GDPR/cookie plugins
- `gravityforms`, `gform_` → GravityForms plugin

Load everything else, **preserving the exact source order** (do not reorder CSS).

### JS — SKIP rules

Skip a script if it matches any of these:
- `jquery.min.js` (WordPress bundled), `jquery-migrate`, `jquery-core` → use the theme's jQuery instead
- `dom-ready.min`, `hooks.min`, `i18n.min`, `a11y.min`, `utils.min` → WP core
- `language-cookie`, `sitepress`, `wpml` → WPML
- `DOMPurify`, `svgs-inline`, `email-decode` → WP utilities
- `gravityforms`, `gform_`, `placeholders.jquery`, `jquery.json`, `vendor-theme`, `scripts-theme` → GravityForms
- `gdpr`, `moove_gdpr`, `main.js` (gdpr) → GDPR plugin
- Analytics/tracking: any of `gtm`, `analytics`, `fbevents`, `hubspot`, `leadin`, `5905093`, `collectedforms`, `cloudflare`
- `widget.js` → chat widgets
- `isotope` → layout library (not needed server-side)

### JS — LOAD rules and ordering

For every script that passes the SKIP filter, determine its type and load it in this priority order:

```
1. jquery-<version>.min.js        ← theme jQuery, always first
2. jQuery plugins                 ← any plugin that depends on $:
     owl.carousel.js, jquery.jConveyorTicker.min.js,
     jquery.bez.min.js, matchHeight.js, slick.js, etc.
3. lottie.min.js                  ← independent, load early if present
4. TweenMax.min.js / gsap.min.js  ← animation core(s)
     If BOTH present: TweenMax first, then gsap
5. ScrollMagic.min.js             ← after TweenMax
6. ScrollTrigger.min.js           ← after gsap.min.js
7. Flip.min.js, other GSAP plugins ← after gsap
8. wow.js                         ← after jQuery, before theme JS
9. metaview.js and other helpers  ← before theme JS
10. all.js / custom.js / theme.js ← always last
```

> **Note:** A page may use both GSAP v2 (TweenMax + ScrollMagic) and GSAP v3 (gsap + ScrollTrigger) simultaneously. If both are present, load both — do not remove either.

---

## Step 2: Run Dependency Analysis

Use the personal skill's analyzer on the downloaded `index.html`:

```bash
python3 ~/.cursor/skills/dependencies-aware-react-converter/scripts/analyze-dependencies.py \
  "landing-page/<page-slug>/index.html" \
  --output landing-page/<page-slug>/deps-manifest.json
```

If the script doesn't exist yet (personal skill may not include it separately), follow the inline scan in the personal skill's Phase 1 instead.

---

## Step 3: Lottie-Specific Handling

triolla.io pages use Lottie for SVG animations. The animation data is inline JSON or a separate `.json` asset.

```tsx
useEffect(() => {
  const lottie = (window as any).lottie;
  if (!lottie) return;

  const containers = document.querySelectorAll<HTMLElement>('[data-lottie]');
  containers.forEach((container) => {
    const src = container.dataset.lottie;
    if (!src) return;
    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: src,
    });
  });
}, [depsReady]); // Run after deps load
```

---

## Step 4: ScrollMagic + TweenMax AND GSAP v3

triolla.io pages can use **both** simultaneously — ScrollMagic wired to TweenMax (v2) for scene-based animations, and GSAP v3 + ScrollTrigger for separate scroll-driven effects. If both are present in the dependency array, implement both patterns.

**ScrollMagic + TweenMax (v2):**
```tsx
useEffect(() => {
  const SM = (window as any).ScrollMagic;
  const TM = (window as any).TweenMax;
  if (!SM || !TM) return;

  const controller = new SM.Controller();

  new SM.Scene({ triggerElement: '#pin-section', duration: 400 })
    .setTween(TM.from('#animated-el', 1, { opacity: 0, y: 50 }))
    .addTo(controller);

  return () => controller.destroy(true);
}, [depsReady]);
```

**GSAP v3 + ScrollTrigger (separate effects):**
```tsx
useEffect(() => {
  const gsap = (window as any).gsap;
  const ST = (window as any).ScrollTrigger;
  if (!gsap || !ST) return;

  gsap.registerPlugin(ST);

  gsap.from('.fade-in-el', {
    opacity: 0, y: 40, duration: 0.8,
    scrollTrigger: { trigger: '.fade-in-el', start: 'top 80%' },
  });
}, [depsReady]);
```

---

## Step 5: Asset Path Convention

After conversion, copy `_assets/` to the Next.js public folder:

```bash
cp -r landing-page/<page-slug>/_assets/ ../next-app/public/assets/<page-slug>/
```

In the component, prefix all asset paths:

```tsx
const ASSETS = '/assets/<page-slug>';

// Then in JSX:
<img src={`${ASSETS}/logo_732.svg`} alt="Logo" />
```

---

## Step 6: Validation Checklist

Before shipping, verify:

- [ ] Lottie animations play on load
- [ ] ScrollMagic scenes trigger at correct scroll positions
- [ ] TweenMax tweens fire (no `TweenMax is not defined` errors)
- [ ] jQuery plugins initialized after jQuery loads
- [ ] No FOUC — page hidden until CSS loaded
- [ ] `_assets/` contents present in `public/assets/<page-slug>/`
- [ ] All `src` / `href` paths updated from `_assets/` to `/assets/<page-slug>/`
- [ ] No absolute `https://triolla.io/` URLs remaining in JSX

---

## Common Issues

**`ScrollMagic is not defined`**
→ TweenMax must load before ScrollMagic. Check load order in `useEffect`.

**Lottie container renders blank**
→ Container element must exist in the DOM before `lottie.loadAnimation()` runs. Ensure `depsReady` gate is in place.

**`$.bez is not defined`**
→ `jquery.bez.min.js` must load after jQuery. Add it explicitly in the script chain.

**Ticker not scrolling / carousel not initializing**
→ `jquery.jConveyorTicker.min.js` and `owl.carousel.js` must load after jQuery. Both need jQuery loaded as a global before they run.

**`gsap.registerPlugin is not a function`**
→ `gsap.min.js` (v3) must load before `ScrollTrigger.min.js`. These are separate from TweenMax — both sets must be present.

**CSS animations don't play**
→ Import `animation.css` after `style.css`. triolla.io's animation classes require base styles first.

**Whole sections present in HTML but invisible in Next.js**
→ Theme uses `opacity: 0` until `.show`. Inline scripts that called `addClass('show')` were removed with the fragment — reimplement with `IntersectionObserver` (and any `equalheight` / parallax from the same source). See **Next.js: generic HTML snapshot page** above.

**Header, FAQ toggles, or UI chrome wrong after scroll / navigation**
→ Theme code may live inside **`DOMContentLoaded`** in a late-loaded bundle, or not re-run when scripts are deduped. Reimplement critical listeners **scoped to the snapshot root** with effect cleanup. See **subsection 4** (theme bundles and `DOMContentLoaded`).

**Icons or `::after` backgrounds missing (CSS looks fine)**
→ **`url(images/...)`** in CSS does not match a flat `public/assets/<slug>/` mirror. See **subsection 5** (CSS `url(...)` vs flat mirrors).

**Fonts look wrong or “missing” on `localhost`**
→ **`fonts.css`** uses **relative** `url('*.woff2')` next to the CSS file; snapshot folders often lack those files → **404**. Do **not** guess theme paths under `assets/fonts`; use **`/wp-content/themes/triolla/fonts/`** and **host copies** under **`public/assets/<slug>/`**, or see **subsection 3**.
