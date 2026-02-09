import { NextResponse } from 'next/server';
// The client you created in Step 1
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect address
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Determine the correct redirect origin
            const isLocalEnv = process.env.NODE_ENV === 'development';
            const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
            const forwardedHost = request.headers.get('x-forwarded-host');

            // Force localhost redirect in development to prevent production URL redirects
            if (isLocalEnv || isLocalhost) {
                // Always redirect to localhost in dev mode
                const devOrigin = origin.includes('localhost') || origin.includes('127.0.0.1')
                    ? origin
                    : 'http://localhost:3000';
                return NextResponse.redirect(`${devOrigin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
