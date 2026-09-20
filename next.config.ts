import path from "node:path";
import type { NextConfig } from "next";
import { getTrainApiUrl } from "./src/lib/train-api-url";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    TRAIN_API_URL: getTrainApiUrl(),
  },
  images: {
    localPatterns: [{ pathname: "/images/**" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
