import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    prerenderResponseLimit: 10485760, // 10MB
  },
};

export default nextConfig;
