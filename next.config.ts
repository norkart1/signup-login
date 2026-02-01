import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins is required for Replit's proxy but not in official types yet
  experimental: {
    allowedDevOrigins: ["*"],
  },
};

export default nextConfig;
