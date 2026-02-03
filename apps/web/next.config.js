const withNextIntl = require('next-intl/plugin')(
    './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // === MONOREPO SUPPORT ===
    transpilePackages: ["@repo/types", "@repo/database"],

    // === IMAGE OPTIMIZATION ===
    images: {
        // Disable optimization in development to bypass private IP checks
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: '**.cloudflare.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'plus.unsplash.com' },
            { protocol: 'https', hostname: 'cdn.brandfetch.io' },
            { protocol: 'https', hostname: 'cdn.simpleicons.org' },
            { protocol: 'https', hostname: 'upload.wikimedia.org' },
            { protocol: 'https', hostname: 'www.vectorlogo.zone' },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year cache for static images
    },

    // === PERFORMANCE OPTIMIZATIONS ===
    reactStrictMode: true,
    poweredByHeader: false, // Remove X-Powered-By header for security
    compress: true, // Enable gzip compression

    // === EXPERIMENTAL PERFORMANCE FLAGS ===
    experimental: {
        optimizePackageImports: [
            'framer-motion',
            'lucide-react',
            '@supabase/supabase-js',
        ],
    },

    // === SECURITY HEADERS ===
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                ],
            },
            {
                // Cache static assets aggressively
                source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ]
    },
}

module.exports = withNextIntl(nextConfig)
