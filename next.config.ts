import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async redirects() {
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
