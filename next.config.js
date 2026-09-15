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
    ],
  },
};

module.exports = nextConfig;
