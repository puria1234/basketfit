import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BasketFit - AI Basketball Size Recommender",
  description:
    "Stop guessing your basketball size. Get a personalised recommendation based on your age, height, hand span, and playing style.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
