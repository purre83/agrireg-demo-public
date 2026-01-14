import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    viewportFit: "cover", // <-- MAGISKA RADEN
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
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
