/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    domains: ['localhost'], // Add your domain here if using external images
  },
  webpack: (config) => {
  
    config.resolve.alias = {
      ...config.resolve.alias,
      "util-types": require.resolve("@types/node/package.json")
    };

   
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