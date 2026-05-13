import type { NextConfig } from "next";
const path = require('path')

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['localhost', '*.bitmutex.com','bitmutex.com'],

  images: {
    unoptimized: process.env.NEXT_PUBLIC_IMAGES_UNOPTIMIZED === "true",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: 'https',
        hostname: "strapiadmin.bitmutex.com",
        port: '',
        pathname: "/uploads/**/*",
        search: '',
      },
      {
        protocol: "https",
        hostname: "motivated-health-e41c7505c5.media.strapiapp.com",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: process.env.DISABLE_TYPECHECK === "true",
  },

  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
