import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' https://dragoncontrol.vercel.app https://*.vercel.app https://*.dragonstudios.com http://localhost:* http://127.0.0.1:*",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.env.VERCEL ? path.resolve(__dirname, "../../") : __dirname,
  outputFileTracingExcludes: {
    '*': [
      '**/Application Data/**',
      'C:/Users/ASUS/Application Data/**',
      'C:\\Users\\ASUS\\Application Data\\**',
      'C:/Users/**',
      'C:\\Users\\**',
    ],
  },
  outputFileTracingIncludes: {
    '/api/**/*': [
      '../../packages/shared-db/src/generated/client/**/*',
      '../../packages/shared-db/schema.prisma',
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@dragon/auth", "@dragon/ui", "@dragon/utils", "@dragon/storage", "@dragon/config", "@dragon/validation", "ably"],
  serverExternalPackages: ["@prisma/client", "prisma"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://dragoncontrol.vercel.app" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
