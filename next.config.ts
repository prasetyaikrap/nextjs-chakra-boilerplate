import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  distDir: "build",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "localhost:8080", "localhost:3000"],
    },
  },
};

export default nextConfig;
