import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { StoreShell } from "@/components/store-shell";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
    template: "%s",
  },
  description:
    "Shop curated electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart with fast USA and UK delivery.",
  keywords: [
    "ClickCart",
    "online shopping",
    "ecommerce USA",
    "ecommerce UK",
    "electronics",
    "fashion",
    "home and kitchen",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
    description:
      "Shop curated electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ClickCart – USA & UK Online Shopping Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
    description:
      "Shop curated electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart.",
    images: [`${SITE_URL}/og-image.png`],
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
          <StoreShell>{children}</StoreShell>
        </Providers>
      </body>
    </html>
  );
}
