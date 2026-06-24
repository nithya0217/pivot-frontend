import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: backendOrigin,
  },
};

export default nextConfig;
