import type { Metadata } from "next";
import { Bebas_Neue, Geist } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"], display: "swap" });
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BasketFit — AI Basketball Size Recommender",
  description:
    "Stop guessing your basketball size. Get a personalised recommendation based on your age, height, hand span, and playing style.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
