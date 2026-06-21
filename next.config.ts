import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists in the
  // user's home dir, which otherwise confuses Turbopack's root inference).
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Allow Supabase Storage public assets (blog covers, avatars).
      { protocol: "https", hostname: "*.supabase.co" },
      // Royalty-free photography (replaceable; see src/lib/images.ts).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // Old auth paths -> auth-free equivalents
      { source: "/login", destination: "/my-health", permanent: false },
      { source: "/portal", destination: "/my-health", permanent: false },
    ];
  },
};

export default nextConfig;
