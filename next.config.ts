import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async redirects() {
    /**
     * Hebrew service slugs from triolla.io WP → canonical English slugs in this app.
     * Handles direct navigation / external links that land on URL-encoded Hebrew paths.
     * Both encoded (%XX) and literal Unicode forms are covered by Next.js automatically.
     */
    const hebrewServiceRedirects = [
      ["%D7%A7%D7%95%D7%A0%D7%A1%D7%A4%D7%98-%D7%99%D7%A6%D7%99%D7%A8%D7%AA%D7%99", "creative-concept"],
      ["%D7%99%D7%A6%D7%99%D7%A8%D7%AA-%D7%93%D7%99%D7%96%D7%99%D7%99%D7%9F-%D7%A1%D7%99%D7%A1%D7%98%D7%9D-2", "design-system-creation"],
      ["%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA-%D7%A9%D7%9E%D7%99%D7%A9%D7%95%D7%AA", "user-testing"],
      ["%D7%9E%D7%A0%D7%94%D7%9C%D7%99-%D7%9E%D7%95%D7%A6%D7%A8-%D7%9E%D7%95%D7%91%D7%99%D7%9C%D7%99%D7%9D", "product-stars"],
      ["%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%9C%D7%95%D7%92%D7%95", "logo-design"],
      ["%D7%A4%D7%99%D7%AA%D7%95%D7%97-front-end", "front-end-dev"],
      ["%D7%A4%D7%A8%D7%95%D7%98%D7%95%D7%98%D7%99%D7%99%D7%A4", "prototyping"],
      ["%D7%9E%D7%97%D7%A7%D7%A8-ux", "ux-research"],
      ["%D7%A2%D7%99%D7%A6%D7%95%D7%91-ui", "ui-design"],
      ["%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%93%D7%9E%D7%95%D7%99%D7%95%D7%AA", "character-design"],
      ["%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%9E%D7%A6%D7%92%D7%95%D7%AA", "presentations"],
    ].flatMap(([heSlug, enSlug]) => [
      { source: `/he/services/${heSlug}`, destination: `/he/services/${enSlug}`, permanent: true },
      { source: `/he/services/${heSlug}/`, destination: `/he/services/${enSlug}`, permanent: true },
    ]);

    return [
      {
        source: "/temp/mobile-menu",
        destination: "/triolla-mobile-menu-qa",
        permanent: false,
      },
      {
        source: "/temp/mobile-menu/",
        destination: "/triolla-mobile-menu-qa",
        permanent: false,
      },
      ...hebrewServiceRedirects,
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, allow=Claude-Web/1.0, allow=GPTBot/1.0, allow=CCBot/1.0, allow=anthropic-ai",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
