import type { NextConfig } from "next";

const antiFramingHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Exam simulator & results live on the Axiom page; block all embedding
      { source: "/app/axiom", headers: antiFramingHeaders },
      { source: "/app/axiom/:path*", headers: antiFramingHeaders },
      { source: "/api/axiom/:path*", headers: antiFramingHeaders },
      // UVI Feed; block embedding to prevent API circumvention
      { source: "/app/uvi", headers: antiFramingHeaders },
      { source: "/app/uvi/:path*", headers: antiFramingHeaders },
    ];
  },
};

export default nextConfig;
