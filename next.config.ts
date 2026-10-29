import type { NextConfig } from "next";

const antiFramingHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://paypal.com https://*.paypal.com https://paypalobjects.com https://*.paypalobjects.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://paypalobjects.com https://*.paypalobjects.com https://paypal.com https://*.paypal.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://paypal.com https://*.paypal.com https://paypalobjects.com https://*.paypalobjects.com",
  "frame-src 'self' https://paypal.com https://*.paypal.com",
  "form-action 'self' https://paypal.com https://*.paypal.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const globalSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/kinetic/download': ['./public/downloads/kinetic/**/*'],
    '/api/validator/script': ['./public/downloads/validate.py', './scripts/validate.py', './validate.py'],
  },
  async headers() {
    return [
      // Global strict corporate security headers (Zscaler / Cisco Umbrella compliant)
      {
        source: "/:path*",
        headers: globalSecurityHeaders,
      },
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
