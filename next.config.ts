import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ["gw8hy3fdcv.ufs.sh"],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
