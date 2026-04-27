import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MedBridge — Transparent Cash-Pay Healthcare in DFW",
    template: "%s | MedBridge",
  },
  description:
    "See transparent cash prices for aesthetics, Botox, fillers, and more from verified DFW providers. Compare against your insurance — often cash is cheaper.",
  keywords: [
    "cash pay healthcare",
    "DFW",
    "Dallas",
    "Fort Worth",
    "Botox",
    "aesthetics",
    "transparent pricing",
    "MedBridge",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
