import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Printeast",
    default: "Printeast - The AI-Native POD Operating System",
  },
  description:
    "Collapse the journey from creative impulse to physical product. The future of creator commerce.",
  metadataBase: new URL("https://printeast.com"), // Replace with actual URL
  keywords: ["Print on Demand", "AI", "Creator Economy", "Ecommerce"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
