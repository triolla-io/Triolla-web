import type { NextConfig } from "next";

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
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
