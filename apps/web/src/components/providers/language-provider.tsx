"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export interface Language {
    code: string
    currency: string
    label: string
    flag: string
}

export const LANGUAGES: Language[] = [
    { code: "EN", currency: "USD", label: "English (US)", flag: "🇺🇸" },
    { code: "EN", currency: "INR", label: "English (IN)", flag: "🇮🇳" },
    { code: "EN", currency: "EUR", label: "English (EU)", flag: "🇪🇺" },
    { code: "HI", currency: "INR", label: "Hindi", flag: "🇮🇳" },
    { code: "FR", currency: "EUR", label: "French", flag: "🇫🇷" },
]

interface LanguageContextType {
    selectedLang: Language
    setSelectedLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Default to English (IN) as per user's preference for EN/INR
    const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[1]!)
    const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

    useEffect(() => {
        async function loadMessages() {
            try {
                // Dynamically load the locale based on the language code (case-insensitive)
                const locale = selectedLang.code.toLowerCase();
                const msgs = (await import(`../../messages/${locale}.json`)).default;
                setMessages(msgs);
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        }
        loadMessages();
    }, [selectedLang.code]);

    if (!messages) {
        return <div className="min-h-screen bg-white" />; // Prevent flash of untranslated content
    }

    return (
        <LanguageContext.Provider value={{ selectedLang, setSelectedLang }}>
            <NextIntlClientProvider locale={selectedLang.code} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
