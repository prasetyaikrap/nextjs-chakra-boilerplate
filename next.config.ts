import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  distDir: "build",
  staticPageGenerationTimeout: 300,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "localhost:8080", "localhost:3000"],
    },
    // optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
