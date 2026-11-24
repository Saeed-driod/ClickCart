"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check, Star } from "lucide-react";
import { CategoryItem, BrandItem } from "@/types";
import { Button } from "@/components/ui/button";

interface ProductsFilterProps {
  categories: CategoryItem[];
  brands: BrandItem[];
}

export function ProductsFilter({ categories, brands }: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rating = searchParams.get("rating") || "";
  const inStock = searchParams.get("inStock") === "true";

  const [localMinPrice, setLocalMinPrice] = React.useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = React.useState(maxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (localMinPrice) params.set("minPrice", localMinPrice);
    else params.delete("minPrice");
    if (localMaxPrice) params.set("maxPrice", localMaxPrice);
    else params.delete("maxPrice");
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    router.push("/products");
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(rating) ||
    inStock;

  const FilterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-bold text-base flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
          <span>Filters</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("category", null)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
              !selectedCategory
                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((c) => {
            const isSelected = selectedCategory.toLowerCase() === c.slug.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => updateParam("category", isSelected ? null : c.slug)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{c.name}</span>
                {c._count && (
                  <span className="text-[10px] text-muted-foreground">
                    ({c._count.products})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Price (PKR ₨)
        </h4>
        <form onSubmit={applyPriceFilter} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs"
            />
            <span className="text-xs text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="w-full text-xs h-7">
            Apply Price
          </Button>
        </form>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Brands
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => {
            const isSelected = selectedBrand.toLowerCase() === b.slug.toLowerCase();
            return (
              <button
                key={b.id}
                onClick={() => updateParam("brand", isSelected ? null : b.slug)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{b.name}</span>
                {isSelected && <Check className="h-3 w-3 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => {
            const isSelected = rating === String(stars);
            return (
              <button
                key={stars}
                onClick={() => updateParam("rating", isSelected ? null : String(stars))}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < stars ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span>{stars}★ & above</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="rounded border-border text-indigo-600 focus:ring-indigo-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 rounded-2xl border border-border bg-card p-5 h-fit sticky top-24">
        {FilterContent}
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters {hasActiveFilters && "•"}</span>
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-background p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <span className="font-bold text-lg">Filter Products</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterContent}
            <div className="mt-8">
              <Button
                className="w-full"
                onClick={() => setMobileFilterOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
