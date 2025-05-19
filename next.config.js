/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  // Enable experimental features for subdomain support
  experimental: {
    // Next.js 15 has app directory enabled by default
  },
  // Configure hostname rewrites for development
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite API requests to avoid CORS issues
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
