import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Cloudflare Pages compatibility
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
