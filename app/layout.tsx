import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriReg – Rådgivarportal (demo)",
  description:
    "AgriReg ger rådgivare kontroll över miljöplaner, tillsynsunderlag och CAP-optimering.",
  icons: { icon: "/favicon.ico" },
  themeColor: "#065f46",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        {/* Plausible Analytics – privacy-friendly */}
        <Script
          strategy="beforeInteractive"
          src="https://plausible.io/js/pa-IzQjx6KX3qZV--5nNCSsd.js"
          data-domain="demo.agrireg.se"  // <-- Extra för verifiering
          defer                    // <-- Hjälper crawlers se scriptet
          async
        />
        <Script strategy="beforeInteractive" id="plausible-init">
          {`
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
            window.plausible.init = window.plausible.init || function(i) { window.plausible.o = i || {} };
            window.plausible.init();
          `}
        </Script>
      </head>
      <body className={inter.className + " bg-gray-50 text-gray-900"}>
        <Header />
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}