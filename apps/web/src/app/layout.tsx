import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: {
    template: "%s | Printeast",
    default: "Printeast - The AI-Native POD Operating System",
  },
  description:
    "Collapse the journey from creative impulse to physical product. The future of creator commerce.",
  metadataBase: new URL("https://printeast.com"),
  keywords: ["Print on Demand", "AI", "Creator Economy", "Ecommerce"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>{children}</body>
    </html>
  );
}
