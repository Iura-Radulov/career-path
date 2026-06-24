import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  allowedDevOrigins: ['careerpathsim.com', 'www.careerpathsim.com'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
