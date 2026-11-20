import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/api/photo/**": ["./private/photos/**/*.{webp,mp4}"],
  },
};

export default nextConfig;
