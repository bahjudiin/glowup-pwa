import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Nothing here may require network access at build time.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    // ESLint is not wired up in this repo — do not fail the build on it.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
