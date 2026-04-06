/**
 * Visual Regression Test Cases
 *
 * Each test case defines:
 * - page: which page to test
 * - viewport: screen size
 * - language: language variant
 * - urls: original WP site vs current React version
 * - scrollConfig: how to simulate user scrolling
 * - waitStrategy: timing for animations/lazy loads
 * - acceptanceCriteria: pass/fail thresholds
 */

module.exports = {
  // Phase 1: Home page - Desktop - English (PoC)
  'home-desktop-en': {
    page: 'home',
    viewport: { width: 1920, height: 1080 },
    language: 'en',
    urls: {
      original: 'https://triolla.io/',
      current: 'http://localhost:3000/',
    },
    scrollConfig: {
      enabled: true,
      speed: 'slow', // slow | medium | fast
      pauseBetweenScrolls: 300, // ms, allow animations to settle
      waitAfterScroll: 1000, // ms, final wait before screenshot
    },
    waitStrategy: {
      initial: 'networkidle',
      afterScroll: 1500, // additional wait after scroll completes
      beforeCapture: 500,
    },
    acceptanceCriteria: {
      minMatchPercent: 99.0,
      maxPixelsDifferent: 5000,
      maxConsoleErrors: 0,
    },
  },

  // Phase 2 (future): Home page - Desktop - Hebrew (RTL)
  // 'home-desktop-he': {
  //   page: 'home',
  //   viewport: { width: 1920, height: 1080 },
  //   language: 'he',
  //   urls: {
  //     original: 'https://triolla.io/he/',
  //     current: 'http://localhost:3000/he',
  //   },
  //   ...
  // },

  // Phase 3 (future): Home page - Mobile - English
  // 'home-mobile-en': {
  //   page: 'home',
  //   viewport: { width: 375, height: 667 },
  //   language: 'en',
  //   ...
  // },
};
