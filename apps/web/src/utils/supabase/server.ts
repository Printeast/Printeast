import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
            global: {
                fetch: async (url, options) => {
                    let retries = 3;
                    while (retries > 0) {
                        try {
                            const res = await fetch(url, { ...options, next: { revalidate: 0 } });
                            return res;
                        } catch (err: any) {
                            if (err?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' && retries > 1) {
                                retries--;
                                await new Promise((r) => setTimeout(r, 500));
                                continue;
                            }
                            throw err;
                        }
                    }
                    return fetch(url, options); // Should not reach here
                },
            },
        }
    );
}

export async function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return []; },
                setAll() { },
            },
        }
    );
}
