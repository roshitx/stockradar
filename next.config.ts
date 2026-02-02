import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-icons",
      "@heroicons/react",
    ],
    // Memory optimization untuk webpack fallback
    webpackMemoryOptimizations: true,
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 menit cache
    pagesBufferLength: 5, // Jumlah pages di buffer
  },
};

export default nextConfig;
