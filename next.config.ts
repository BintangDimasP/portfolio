import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.140", "localhost"],
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb", // Mengizinkan payload upload s/d 20 MB (+ buffer overhead)
    },
  },
};

export default nextConfig;
