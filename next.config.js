/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep the Next.js image optimizer enabled, but only allow the Supabase
    // Storage host (where article covers are uploaded). External covers are
    // rendered unoptimized by <CoverImage> so the allow-list stays narrow.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'femroomripuxyscdenwj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Seed/legacy covers come from Unsplash; allowed here so they can be
        // optimized. <CoverImage> still renders unknown hosts unoptimized.
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
