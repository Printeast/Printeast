import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export default async function proxy(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const path = request.nextUrl.pathname;
    const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup');
    const isProtectedRoute =
        path.startsWith('/dashboard') ||
        path.startsWith('/onboarding') ||
        path.startsWith('/seller') ||
        path.startsWith('/creator');

    if (isProtectedRoute && !user) {
        const url = new URL("/login", request.url);
        const redirectResponse = NextResponse.redirect(url);
        // Copy cookies from refreshed session response to the redirect response
        supabaseResponse.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    if (isAuthRoute && user) {
        const url = new URL("/dashboard", request.url);
        const redirectResponse = NextResponse.redirect(url);
        // Copy cookies from refreshed session response to the redirect response
        supabaseResponse.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/onboarding/:path*",
        "/seller/:path*",
        "/creator/:path*",
        "/login",
        "/signup",
        "/auth/callback"
    ],
};
