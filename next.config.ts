import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add the backend's image host here when content moves off local /public.
    remotePatterns: [],
  },
};

export default nextConfig;
