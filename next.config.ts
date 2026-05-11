import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi build dan runtime
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Optimasi gambar
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hwztchapter.dramaboxdb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thwztchapter.dramaboxdb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.animein.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xyz-api.animein.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p19-novel-sign-sg.fizzopic.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p16-novel-sign-sg.fizzopic.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fmcdn.mangahere.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mangahere.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "fmcdn.mangahere.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fmcdn.mangahere.com",
        pathname: "/**",
      },
    ],
  },

  // Experimental features untuk optimasi
  experimental: {
    // Mengoptimasi bundle size
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
    ],
  },
};

export default nextConfig;
