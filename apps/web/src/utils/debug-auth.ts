/**
 * Debug utility to check auth redirect configuration
 * Run this in your browser console on any page to verify settings
 */

export function debugAuthRedirects() {
    console.group('🔍 Auth Redirect Debug Info');

    console.log('📍 Current Location:');
    console.log('  - Origin:', window.location.origin);
    console.log('  - Href:', window.location.href);

    console.log('\n🌍 Environment:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - Is Development:', process.env.NODE_ENV === 'development');

    console.log('\n🔗 Expected Redirect URLs:');
    const isLocalhost = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1');
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev || isLocalhost) {
        const devOrigin = isLocalhost ? window.location.origin : 'http://localhost:3000';
        console.log('  - Auth Callback:', `${devOrigin}/api/auth/callback`);
        console.log('  - Password Reset:', `${devOrigin}/auth/reset-password`);
        console.log('  ✅ Should use LOCALHOST');
    } else {
        console.log('  - Auth Callback:', `${window.location.origin}/api/auth/callback`);
        console.log('  - Password Reset:', `${window.location.origin}/auth/reset-password`);
        console.log('  ⚠️ Should use PRODUCTION URLs');
    }

    console.log('\n⚙️ Supabase Config:');
    console.log('  - URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
    console.log('  - Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');

    console.log('\n📋 Action Required:');
    if (isDev || isLocalhost) {
        console.log('  1. Add to Supabase Dashboard → Authentication → URL Configuration:');
        console.log(`     ${isLocalhost ? window.location.origin : 'http://localhost:3000'}/api/auth/callback`);
        console.log('  2. Save changes in Supabase');
        console.log('  3. Clear browser cookies');
        console.log('  4. Try logging in again');
    } else {
        console.log('  ✅ Production mode - should work with existing config');
    }

    console.groupEnd();
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Make it globally available in dev mode
    (window as any).debugAuthRedirects = debugAuthRedirects;
    console.info('💡 Run debugAuthRedirects() in console to check auth redirect config');
}
