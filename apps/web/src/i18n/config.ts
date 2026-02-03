export const locales = ['en', 'fr', 'hi'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const LOCALE_DETAILS: Record<Locale, { label: string; flag: string; currency: string }> = {
    en: { label: "English (US)", flag: "🇺🇸", currency: "USD" },
    fr: { label: "French", flag: "🇫🇷", currency: "EUR" },
    hi: { label: "Hindi", flag: "🇮🇳", currency: "INR" }
};
