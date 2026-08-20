import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable SVG optimization for Leaflet marker icons
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
