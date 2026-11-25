import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegionSelectorModal } from "@/components/region-selector-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClickCart - Simple & Fast Online Shopping (USA & UK)",
  description:
    "Shop electronics, fashion, home essentials, beauty, sports, toys, books, and groceries in the USA and UK.",
  keywords: "ecommerce, online shopping, clickcart, usa, uk, electronics, fashion",
  openGraph: {
    title: "ClickCart - USA & UK Online Store",
    description: "Select your region (USA or UK) and shop curated products.",
    type: "website",
    siteName: "ClickCart",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <RegionSelectorModal />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
