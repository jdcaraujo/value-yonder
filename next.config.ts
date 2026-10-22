import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Set for GitHub Pages builds (served from /value-yonder); empty for valueyonder.com
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
};

export default nextConfig;
