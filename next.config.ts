import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to support API routes for admin dashboard
  images: {
    unoptimized: true
  }
};

export default nextConfig;
