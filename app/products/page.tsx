import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getProducts, getCategories, getBrands } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { ProductsFilter } from "@/components/products-filter";
import { ChevronLeft, ChevronRight, PackageX } from "lucide-react";

interface ProductsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    brand?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    featured?: string;
    deals?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "rating" | "popular";
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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

  const [categories, brands, result] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({
      search: searchParams.search,
      category: searchParams.category,
      brand: searchParams.brand,
      region: activeRegion,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      rating: searchParams.rating ? Number(searchParams.rating) : undefined,
      inStock: searchParams.inStock === "true",
      featured: searchParams.featured === "true" ? true : undefined,
      isFlashDeal: searchParams.deals === "true" ? true : undefined,
      sort: searchParams.sort || "newest",
      page,
      limit,
    }),
  ]);

  const { products, total, totalPages, currentPage } = result;

  const currentCategory = categories.find((c) => c.slug === searchParams.category);

  // Helper to build URL with new sort or page
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(newPage));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumb */}
      <div className="mb-6">
        <nav className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Products</span>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-indigo-600 font-semibold">{currentCategory.name}</span>
            </>
          )}
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {searchParams.search
                ? `Search: "${searchParams.search}"`
                : currentCategory
                ? `${activeRegion === "UK" ? "🇬🇧" : "🇺🇸"} ${currentCategory.name}`
                : `${activeRegion === "UK" ? "🇬🇧 UK" : "🇺🇸 USA"} Products`}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Showing {products.length} of {total} products in {activeRegion}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
            <form action="/products" method="GET" className="inline-block">
              {/* Preserve existing query params */}
              {Object.entries(searchParams).map(([k, v]) => {
                if (k === "sort") return null;
                return <input key={k} type="hidden" name={k} value={v} />;
              })}
              <select
                name="sort"
                defaultValue={searchParams.sort || "newest"}
                // Note: Native form submission on change
                className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </form>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <React.Suspense fallback={<div className="hidden lg:block w-64 h-96 bg-muted/40 animate-pulse rounded-2xl shrink-0" />}>
          <ProductsFilter categories={categories} brands={brands} />
        </React.Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <PackageX className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No products found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
                We couldn't find any items matching your selected criteria. Try adjusting or clearing your filters.
              </p>
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Link
                    href={createPageUrl(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage <= 1}
                    className={`h-9 px-3 rounded-lg border border-border flex items-center gap-1 text-xs font-medium ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-40 bg-muted"
                        : "hover:bg-muted"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <React.Fragment key={p}>
                            {prev && p - prev > 1 && (
                              <span className="px-2 text-xs text-muted-foreground">...</span>
                            )}
                            <Link
                              href={createPageUrl(p)}
                              className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                                p === currentPage
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "border border-border hover:bg-muted text-foreground"
                              }`}
                            >
                              {p}
                            </Link>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <Link
                    href={createPageUrl(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage >= totalPages}
                    className={`h-9 px-3 rounded-lg border border-border flex items-center gap-1 text-xs font-medium ${
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-40 bg-muted"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
