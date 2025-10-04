import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Não bloqueia o build se houver erros de lint
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://crud-dzl8.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
