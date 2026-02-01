import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins is required for Replit's proxy
  experimental: {
    allowedDevOrigins: ["*"],
  },
};

export default nextConfig;
