"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Zap, Check } from "lucide-react";
import { ProductItem } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { currency } = useCurrencyStore();
  const [isAdded, setIsAdded] = React.useState(false);

  const isFavorited = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      stock: product.stock,
    });

    setIsAdded(true);
    toast.success(`${product.name.slice(0, 28)}... added to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem(product);
    if (!isFavorited) {
      toast.success("Saved to your wishlist!");
    } else {
      toast.info("Removed from your wishlist.");
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900/50">
      {/* Thumbnail + Overlays */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"}
            alt={product.name || "ClickCart product"}
            fill
            unoptimized={(product.images[0] || "").startsWith("data:")}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={80}
            priority={priority}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge variant="destructive" className="font-bold text-[11px] shadow-sm">
              -{discountPercent}%
            </Badge>
          )}
          {product.isFlashDeal && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
              <Zap className="h-3 w-3 fill-white" /> FLASH
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-transform active:scale-90 hover:scale-110 ${
            isFavorited ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Stock Status Pill if low stock */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 z-10 rounded-md bg-amber-500/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-md bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Brand */}
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <Link
            href={product.category?.slug ? `/category/${product.category.slug}` : "/products"}
            className="hover:text-indigo-600 truncate max-w-[120px]"
          >
            {product.category?.name || "General"}
          </Link>
          {product.brand && (
            <span className="font-medium text-foreground/80 truncate max-w-[100px]">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-foreground hover:text-indigo-600 transition-colors mb-2 min-h-[2.5rem]">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2"
            title={product.name}
          >
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="ml-1 font-semibold text-foreground">{product.rating}</span>
          </div>
          <span className="text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/60">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {formatMoney(displayPrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatMoney(product.price, currency)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            title={product.stock === 0 ? "Out of stock" : "Add to Cart"}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
