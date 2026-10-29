import type { NextConfig } from "next";

const antiFramingHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/kinetic/download': ['./public/downloads/kinetic/**/*'],
    '/api/validator/script': ['./public/downloads/validate.py', './scripts/validate.py', './validate.py'],
  },
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
  async redirects() {
    return [
      {
        source: "/products/kinetic/pricing",
        destination: "/account/subscription?product=kinetic",
        permanent: false,
      },
      {
        source: "/products/kinetic",
        destination: "/app/patches",
        permanent: false,
      },
      {
        source: "/products/praxis",
        destination: "/app/patches",
        permanent: false,
      },
      {
        source: "/products/valkyrie",
        destination: "/app/valkyrie",
        permanent: false,
      },
      {
        source: "/products/eris",
        destination: "/app/eris",
        permanent: false,
      },
      {
        source: "/daedelus",
        destination: "/products/daedelus",
        permanent: false,
      },
      {
        source: "/account/tokens",
        destination: "/account?tab=tokens",
        permanent: false,
      },
      {
        source: "/research",
        destination: "/wiki",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
