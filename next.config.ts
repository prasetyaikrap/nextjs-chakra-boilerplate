import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  distDir: "build",
  staticPageGenerationTimeout: 300,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "localhost:8080", "localhost:3000"],
    },
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/providers/i18n/index.ts",
});

export default withNextIntl(nextConfig);
