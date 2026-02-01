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
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // For Landing Page Mockups
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com', // For Premium Unsplash Images
            },
            {
                protocol: 'https',
                hostname: 'cdn.brandfetch.io',
            },
            {
                protocol: 'https',
                hostname: 'cdn.simpleicons.org',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'www.vectorlogo.zone',
            }
        ],
        formats: ['image/avif', 'image/webp'], // Maximum compression for LCP
    },
    reactStrictMode: true,
}

module.exports = nextConfig
