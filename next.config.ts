import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fh-passkey-generator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
