import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Case-study screenshots are dense UI with small text; serve them at a
    // higher quality than the default (Next 16 requires an allowlist).
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
