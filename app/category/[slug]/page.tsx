import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { SITE_URL, SITE_NAME, formatMetaDescription, getSeoImageUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string; region?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: `Category Not Found | ${SITE_NAME}`,
    };
  }

  const title = `Buy ${category.name} Online | ${SITE_NAME}`;
  const description = formatMetaDescription(
    `Buy ${category.name} online at ${SITE_NAME}. ${category.description || ""} Fast shipping across the USA and UK.`,
    160
  );
  const canonicalUrl = `${SITE_URL}/category/${category.slug}`;
  const imageUrl = getSeoImageUrl(category.image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${category.name} at ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const page = Number(searchParams.page) || 1;
  const limit = 16;

  const cookieStore = cookies();
  const regionCookie = cookieStore.get("clickcart_region")?.value;
  const activeRegion =
    searchParams.region === "UK" || searchParams.region === "USA"
      ? searchParams.region
      : regionCookie === "UK"
      ? "UK"
      : "USA";

  const { products, total, totalPages, currentPage } = await getProducts({
    category: category.slug,
    region: activeRegion,
    page,
    limit,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{category.name}</span>
        </nav>

        {/* Category Header */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-muted-foreground">{category.description}</p>
            )}
            <p className="text-xs text-muted-foreground pt-1">
              Showing {products.length} of {total} {activeRegion} products
            </p>
          </div>

          {category.image && (
            <div className="relative w-full md:w-56 aspect-[16/9] rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
              <Image
                src={category.image}
                alt={`${category.name} products collection at ClickCart`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-cover"
              />
            </div>
          )}
        </section>

        {/* Products Grid */}
        <section aria-labelledby="category-products-heading" className="space-y-6">
          <h2 id="category-products-heading" className="text-lg font-bold text-foreground">
            {activeRegion === "UK" ? "🇬🇧 UK" : "🇺🇸 USA"} {category.name} Catalog
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <Link
                href={`/category/${category.slug}?page=${Math.max(1, currentPage - 1)}`}
                aria-disabled={currentPage <= 1}
                className={`h-9 px-3 rounded-lg border border-border flex items-center gap-1 text-xs font-medium ${
                  currentPage <= 1 ? "pointer-events-none opacity-40 bg-muted" : "hover:bg-muted"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Link>
              <span className="text-xs text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Link
                href={`/category/${category.slug}?page=${Math.min(totalPages, currentPage + 1)}`}
                aria-disabled={currentPage >= totalPages}
                className={`h-9 px-3 rounded-lg border border-border flex items-center gap-1 text-xs font-medium ${
                  currentPage >= totalPages ? "pointer-events-none opacity-40 bg-muted" : "hover:bg-muted"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
