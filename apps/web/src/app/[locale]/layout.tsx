import type { Metadata, Viewport } from "next";
import { Wix_Madefor_Display, Wix_Madefor_Text } from "next/font/google"; // Corrected import
import "@/app/globals.css"; // Fixed path using alias
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

const wixDisplay = Wix_Madefor_Display({
  subsets: ["latin"],
  variable: "--font-wix-display",
  display: "swap",
  preload: true,
});

const wixText = Wix_Madefor_Text({
  subsets: ["latin"],
  variable: "--font-wix-text",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: {
    template: "%s | Printeast",
    default: "Printeast - The AI-Native POD Operating System",
  },
  description:
    "Collapse the journey from creative impulse to physical product. India's smartest AI-powered Print-on-Demand platform with zero inventory and global shipping.",
  metadataBase: new URL("https://printeast.com"),
  keywords: [
    "Print on Demand",
    "POD",
    "AI Design",
    "Creator Economy",
    "Ecommerce",
    "T-shirt Printing",
    "Custom Merchandise",
    "Dropshipping India",
    "Global Fulfillment",
  ],
  authors: [{ name: "Printeast Technologies" }],
  creator: "Printeast",
  publisher: "Printeast Technologies",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://printeast.com",
    siteName: "Printeast",
    title: "Printeast - The AI-Native POD Operating System",
    description:
      "India's smartest AI-powered Print-on-Demand platform. Zero inventory, global shipping, quality you can trust.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Printeast - AI-Powered Print on Demand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Printeast - The AI-Native POD Operating System",
    description:
      "India's smartest AI-powered Print-on-Demand platform. Create, customize, print, and sell globally.",
    images: ["/og-image.png"],
    creator: "@printeast",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
  },
};

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PreconnectOptimizer } from "@/components/providers/preconnect-optimizer";

import { ThemeProvider } from "@/components/providers/theme-provider";

// ... existing imports

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body className={`${wixDisplay.variable} ${wixText.variable} font-sans antialiased relative`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <SmoothScrollProvider>
              <PreconnectOptimizer />
              {children}
            </SmoothScrollProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
