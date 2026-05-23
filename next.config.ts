import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pivot-backend-442e.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
