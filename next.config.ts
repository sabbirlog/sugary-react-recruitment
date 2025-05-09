import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1wh1xji6f82aw.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

