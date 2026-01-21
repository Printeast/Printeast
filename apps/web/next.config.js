/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/types", "@repo/database"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co', // For Supabase Storage
            },
            {
                protocol: 'https',
                hostname: '**.cloudflare.com', // For Cloudflare CDN
            }
        ],
        formats: ['image/avif', 'image/webp'], // Maximum compression for LCP
    },
    reactStrictMode: true,
}

module.exports = nextConfig
