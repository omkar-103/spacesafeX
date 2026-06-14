import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Set the root directory to avoid the lockfile detection warning
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
