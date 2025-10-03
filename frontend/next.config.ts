import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Não bloqueia o build se houver erros de lint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
