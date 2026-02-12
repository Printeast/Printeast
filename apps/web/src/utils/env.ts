/**
 * Get the correct site URL based on environment
 * In development: always use localhost
 * In production: use the configured NEXT_PUBLIC_SITE_URL or current origin
 */
export function getSiteUrl(): string {
    // If we're in the browser
    if (typeof window !== 'undefined') {
        // In development, always use localhost if available
        if (process.env.NODE_ENV === 'development') {
            // Check if we're already on localhost
            if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
                return window.location.origin;
            }
            // Default to localhost:3000 for dev
            return 'http://localhost:3000';
        }
        // In production, use current origin
        return window.location.origin;
    }

    // Server-side
    if (process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    }

    // Production
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://printeast.com';
}

/**
 * Get the auth callback URL
 */
export function getAuthCallbackUrl(): string {
    return `${getSiteUrl()}/auth/callback`;
}

/**
 * Get the password reset redirect URL
 */
export function getPasswordResetUrl(): string {
    return `${getSiteUrl()}/auth/reset-password`;
}
