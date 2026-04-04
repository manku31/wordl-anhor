import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "0nvl73km-3000.inc1.devtunnels.ms"],
    },
  },
};

export default nextConfig;
