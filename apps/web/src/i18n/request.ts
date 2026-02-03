import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

// Using type coercion for simpler integration with current next-intl version
export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        locale = 'en'; // Default fallback
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
