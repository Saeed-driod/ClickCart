"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-500 mx-auto">
            <Heart className="h-10 w-10 fill-red-500" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Your Wishlist is Empty</h1>
          <p className="text-xs text-muted-foreground">
            Save items that you like by clicking the heart icon on any product card while browsing our store.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
            >
              <span>Explore 200+ Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">My Wishlist</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            You have {items.length} item{items.length !== 1 ? "s" : ""} saved in your wishlist.
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
