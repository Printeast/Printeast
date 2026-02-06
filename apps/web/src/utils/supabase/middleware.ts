import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options: _options }) => {
                        request.cookies.set(name, value);
                    });
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // This will refresh the session if it's expired
    try {
        // Use a Promise.race to enforce a 1.5s timeout on the auth call
        const authPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 3000)
        );

        const { data: { user } } = await Promise.race([authPromise, timeoutPromise]) as any;
        return { supabaseResponse, user };
    } catch (error: any) {
        if (error.message === 'TIMEOUT' || error?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error?.message?.includes('fetch failed')) {
            console.warn("Middleware Session Update: Supabase too slow or down. Proceeding as guest.");
        } else {
            console.error("Middleware Session Update Error:", error);
        }
        return { supabaseResponse, user: null };
    }
}
