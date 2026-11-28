"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ProductItem, CategoryItem } from "@/types";
import { ProductCard } from "@/components/product-card";
import { useRegionStore } from "@/stores/region-store";

interface HomeRegionViewProps {
  initialRegion: "USA" | "UK";
  initialProducts: ProductItem[];
  initialTotal: number;
  categories: CategoryItem[];
}

export function HomeRegionView({
  initialRegion,
  initialProducts,
  initialTotal,
  categories,
}: HomeRegionViewProps) {
  const { region, hasHydrated } = useRegionStore();
  const activeRegion = hasHydrated && region ? region : initialRegion;

  const [products, setProducts] = React.useState<ProductItem[]>(initialProducts);
  const [total, setTotal] = React.useState<number>(initialTotal);
  const [loading, setLoading] = React.useState(false);

  // Immediately fetch region-specific products whenever the customer switches region
  React.useEffect(() => {
    if (!hasHydrated) return;
    if (activeRegion === initialRegion && products.every((p) => p.region === activeRegion)) {
      return;
    }

    let cancelled = false;
    async function loadRegionProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?region=${activeRegion}&limit=12`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setProducts(data.products || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch region products:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRegionProducts();
    return () => {
      cancelled = true;
    };
  }, [activeRegion, hasHydrated, initialRegion]);

  const isUK = activeRegion === "UK";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Clean & Simple Region Welcome Banner */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <span>{isUK ? "🇬🇧 United Kingdom Store" : "🇺🇸 United States Store"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {isUK ? "Shop ClickCart UK" : "Shop ClickCart USA"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Showing exclusive <strong>{isUK ? "UK" : "USA"}</strong> products ({total} items in{" "}
            {isUK ? "GBP £" : "USD $"}).
          </p>
        </div>

        <Link
          href={`/products?region=${activeRegion}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shrink-0"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Browse All {activeRegion} Products</span>
        </Link>
      </section>

      {/* Simple Category Pills */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/products?region=${activeRegion}`}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            All ({total})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-4 py-2 rounded-full border border-border bg-card text-xs font-semibold text-foreground hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Region Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {isUK ? "🇬🇧 UK Products" : "🇺🇸 USA Products"}
          </h2>
          <Link
            href={`/products?region=${activeRegion}`}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>See all {total} products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
