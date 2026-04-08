/**
 * Visual Regression Test Matrix Configuration
 *
 * Supports matrix-based test case generation:
 * - pages: list of pages to test
 * - languages: language variants (en, he, etc)
 * - viewports: screen size definitions
 * - baseConfig: default config for all test cases
 * - pageOverrides: page-specific config overrides
 * - regionRules: region classification thresholds
 *
 * Usage:
 *   npm run regression --pages=home --languages=en --viewports=desktop
 *   npm run regression --all
 *   npm run regression --filter="home.*en"
 */

module.exports = {
  // Phase 1: Pages to test
  // Currently: home (PoC)
  // Future: 50+ pages (about, services, blog-*, etc)
  pages: [
    'home',
    // 'about',
    // 'services',
    // 'agritech',
    // ... 46 more pages
  ],

  // Languages to test
  languages: ['en', 'he'],

  // Viewport definitions (widthxheightpx shorthand)
  viewports: {
    desktop: { width: 1920, height: 1080, label: 'Desktop' },
    tablet: { width: 768, height: 1024, label: 'Tablet' },
    mobile: { width: 375, height: 667, label: 'Mobile' },
  },

  // Base configuration for all test cases
  baseConfig: {
    scrollConfig: {
      enabled: true,
      speed: 'slow', // slow | medium | fast
      pauseBetweenScrolls: 300, // ms, allow animations to settle
      waitAfterScroll: 1000, // ms, final wait before screenshot
    },
    waitStrategy: {
      initial: 'networkidle',
      afterScroll: 1500, // additional wait after scroll completes
      beforeCapture: 2000, // increased from 500ms to allow GSAP animations to start and complete
    },
    acceptanceCriteria: {
      minMatchPercent: 99.0,
      maxPixelsDifferent: 5000,
      maxConsoleErrors: 0,
    },
  },

  // Page-specific overrides
  pageOverrides: {
    home: {
      acceptanceCriteria: {
        minMatchPercent: 99.0,
        maxPixelsDifferent: 5000,
        maxConsoleErrors: 0,
      },
    },
    // about: {
    //   acceptanceCriteria: { minMatchPercent: 98.5, maxPixelsDifferent: 8000 },
    // },
    // blog-*: { acceptanceCriteria: { minMatchPercent: 98.0, maxPixelsDifferent: 10000 } },
  },

  // Region classification rules and thresholds
  // Used by Phase 2: Region Classification
  regionRules: {
    // Minimum region size to report (pixels)
    minRegionSize: 500,

    // Filter rules: regions matching these criteria are classified as 'noise'
    filters: {
      // Skip very small regions (rendering artifacts, anti-aliasing)
      maxSmallRegion: 200,

      // Skip edge-only changes (border/shadow rendering)
      maxEdgeOnlyDensity: 0.05,

      // Skip single-line text rendering changes
      maxSingleLineHeight: 5,

      // Skip very sparse scattered changes
      minDensity: 0.01,
    },

    // Region location estimation (based on Y position)
    locationBoundaries: {
      hero: { yMax: 600 },
      nav: { yMax: 150 },
      footer: { yMin: 0.9 }, // Bottom 10% of page
    },

    // Expected size ranges for different region types
    sizeRanges: {
      small: { maxPixels: 1000 },
      medium: { minPixels: 1000, maxPixels: 10000 },
      large: { minPixels: 10000 },
    },
  },

  /**
   * Helper: Generate URL for test case
   * Handles language variants and localhost vs production
   */
  getUrls(page, language) {
    const langPath = language === 'en' ? '' : `/${language}`;
    const localPath = language === 'en' ? '/' : `/${language}`;

    return {
      original: `https://triolla.io${langPath}`,
      current: `http://localhost:3000${localPath}`,
    };
  },
};
