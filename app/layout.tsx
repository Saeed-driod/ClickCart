import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClickCart - Pakistan's Premier Online Shopping Destination",
  description:
    "Shop 200+ top electronics, fashion, home appliances, beauty products, sports gear, toys, books, and groceries with express Cash on Delivery across Pakistan.",
  keywords: "ecommerce, online shopping pakistan, clickcart, electronics, fashion, cash on delivery",
  openGraph: {
    title: "ClickCart - Premier E-Commerce Store",
    description: "Shop 200+ curated products with fast Cash on Delivery across Pakistan.",
    type: "website",
    locale: "en_PK",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
