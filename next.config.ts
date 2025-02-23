/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "aws-sdk": false,
      "mock-aws-s3": false,
      nock: false,
      "util/types": require.resolve("util-types")
    };
    return config;
  }
};

export default nextConfig;
