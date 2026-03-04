import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.vteximg.com.br',
      },
      {
        protocol: 'https',
        hostname: 'sobharealtypoc.vtexcommercestable.com.br',
      },
      {
        protocol: 'https',
        hostname: 'sobharealtypoc.vtexassets.com',
      },
    ],
  },
};

export default nextConfig;

