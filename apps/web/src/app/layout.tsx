import { ReactNode } from "react";
import { Wix_Madefor_Display, Wix_Madefor_Text } from "next/font/google";
import "@/app/globals.css";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${wixDisplay.variable} ${wixText.variable} font-sans antialiased relative`}>
        {children}
      </body>
    </html>
  );
}
