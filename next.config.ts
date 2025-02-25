/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Keep type checking enabled
  },
  webpack: (config) => {
    // Properly resolve the missing module
    config.resolve.alias = {
      ...config.resolve.alias,
      "util-types": require.resolve("@types/node/package.json")
    };

    // Add fallbacks for Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "aws-sdk": false,
      "mock-aws-s3": false,
      nock: false,
      "util/types": false
    };

    return config;
  }
};

export default nextConfig;