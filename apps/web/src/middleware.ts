import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware for localization
    const intlResponse = intlMiddleware(request);

    // If next-intl wants to redirect (e.g., from / to /en), return it immediately
    if (intlResponse.status === 307 || intlResponse.status === 308) {
        return intlResponse;
    }

    const path = request.nextUrl.pathname;

    if (process.env.FAST_DEV === "true") {
        console.log("[FAST_DEV] middleware bypass");
        return intlResponse;
    }

    // Local-only bypass for creator/seller routes (do not commit)
    if (path.includes('/creator') || path.includes('/seller')) {
        return intlResponse;
    }

    // 2. Run Supabase session update
    const { supabaseResponse, user } = await updateSession(request);

    // Check if it's an auth or protected route
    // We check for inclusions since they might be prefixed with /[locale]
    const isAuthRoute = path.includes('/login') || path.includes('/signup');
    const isProtectedRoute =
        path.includes('/dashboard') ||
        path.includes('/onboarding') ||
        path.includes('/seller') ||
        path.includes('/creator') ||
        path.includes('/settings') ||
        path.includes('/affiliate');

    if (isProtectedRoute && !user) {
        const url = new URL("/login", request.url);
        const redirectResponse = NextResponse.redirect(url);
        // Ensure cookies are preserved for the login redirect
        supabaseResponse.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    if (isAuthRoute && user) {
        const url = new URL("/dashboard", request.url);
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    // Combine responses: 
    // We want the headers/locale logic from intlResponse 
    // but the session/cookies from supabaseResponse.

    // Note: intlResponse is usually a NextResponse.next() with some headers.
    // We can copy headers from intlResponse to supabaseResponse.
    intlResponse.headers.forEach((value, key) => {
        supabaseResponse.headers.set(key, value);
    });

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - API routes (/api)
         * - static assets (.svg, .png, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
