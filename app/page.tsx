import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getProducts, getCategories } from "@/lib/db";
import { HomeRegionView } from "@/components/home-region-view";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
  description:
    "Shop electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart with dedicated USA and UK stores.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
    description:
      "Shop electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ClickCart – USA & UK Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClickCart – Simple & Fast Online Shopping (USA & UK)",
    description:
      "Shop electronics, fashion, home & kitchen, beauty, sports, toys, books, and groceries online at ClickCart.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default async function HomePage() {
  const cookieStore = cookies();
  const regionCookie = cookieStore.get("clickcart_region")?.value;
  const activeRegion = regionCookie === "UK" ? "UK" : "USA";

  const [categories, productsResult] = await Promise.all([
    getCategories(),
    getProducts({ region: activeRegion, limit: 12 }),
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@clickcart.com",
      contactType: "customer service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeRegionView
        initialRegion={activeRegion}
        initialProducts={productsResult.products}
        initialTotal={productsResult.total}
        categories={categories}
      />
    </>
  );
}
