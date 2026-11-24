"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Send,
  Zap,
} from "lucide-react";
import { ProductItem } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

interface ProductDetailViewProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { currency } = useCurrencyStore();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<"description" | "specs" | "reviews">("description");

  // Review submission state
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState("");
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [localReviews, setLocalReviews] = React.useState<any[]>([
    {
      id: "rev-1",
      userName: "Farhan Ahmed",
      rating: 5,
      comment: "Outstanding build quality and exceeded my expectations! Arrived in Karachi within 48 hours via COD.",
      date: "Nov 12, 2026",
    },
    {
      id: "rev-2",
      userName: "Zainab Malik",
      rating: 4,
      comment: "Very genuine product. Packaging was securely padded. Will definitely buy again from ClickCart.",
      date: "Nov 05, 2026",
    },
  ]);

  const isFavorited = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        stock: product.stock,
      },
      quantity
    );
    toast.success(`Added ${quantity} × ${product.name.slice(0, 30)} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to post a review.");
      router.push("/auth/signin");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a comment for your review.");
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      setLocalReviews([
        {
          id: `rev-${Date.now()}`,
          userName: session.user?.name || "Verified Customer",
          rating: reviewRating,
          comment: reviewComment.trim(),
          date: "Just now",
        },
        ...localReviews,
      ]);
      setReviewComment("");
      setIsSubmittingReview(false);
      toast.success("Review submitted! Thank you for your feedback.");
    }, 600);
  };

  return (
    <div className="space-y-16">
      {/* Top Product Hero: Gallery + Purchase Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Images Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-18 w-18 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? "border-indigo-600 ring-2 ring-indigo-600/30"
                    : "border-border hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main Selected Image */}
          <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-border bg-muted/30">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="destructive" className="text-xs font-bold px-3 py-1">
                  Save {discountPercent}%
                </Badge>
              </div>
            )}
            {product.isFlashDeal && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                  <Zap className="h-3 w-3 fill-white" /> FLASH DEAL
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {product.category?.name}
              </Link>
              <span className="font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-1.5 font-bold text-sm text-foreground">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount} customer reviews)</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Verified Authenticity
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {formatMoney(displayPrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">
                  {formatMoney(product.price, currency)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                You save {formatMoney(product.price - product.salePrice!, currency)} ({discountPercent}% off retail)
              </p>
            )}

            {/* Stock status */}
            <div className="pt-2">
              {product.stock > 5 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  In Stock ({product.stock} units ready to ship)
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  Hurry! Only {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Currently Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Quantity & CTA buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-muted-foreground">Quantity:</span>
              <div className="flex items-center rounded-lg border border-border bg-background">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-muted disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-muted disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                className="flex-1 gap-2 font-bold"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Add to Cart</span>
              </Button>

              <Button
                onClick={() => {
                  toggleItem(product);
                  toast(isFavorited ? "Removed from wishlist" : "Saved to wishlist");
                }}
                variant="outline"
                size="lg"
                className={`px-4 ${isFavorited ? "text-red-500 border-red-200" : ""}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              variant="secondary"
              size="lg"
              className="w-full font-bold bg-amber-500 hover:bg-amber-600 text-white"
            >
              Buy Now with Cash on Delivery
            </Button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-[11px] text-muted-foreground">
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40">
              <Truck className="h-4 w-4 text-indigo-600" />
              <span>Fast COD Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40">
              <RotateCcw className="h-4 w-4 text-indigo-600" />
              <span>7-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="border-t border-border pt-10">
        <div className="flex border-b border-border gap-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "description"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "specs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Specifications & Terms
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "reviews"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Customer Reviews ({localReviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground space-y-4">
              <p className="leading-relaxed text-foreground">{product.description}</p>
              <h4 className="text-base font-bold text-foreground mt-4">Key Highlights</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Original retail packaging with serial registration.</li>
                <li>Comprehensive quality assurance check before dispatch.</li>
                <li>Delivered safely with tamper-evident packaging seals.</li>
                <li>Eligible for ClickCart Express Delivery in Karachi, Lahore, and Islamabad within 24-48 hours.</li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">{product.category?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-semibold text-foreground">{product.brand?.name || "Official"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">SKU Code</span>
                <span className="font-semibold font-mono text-foreground">{product.sku}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Return Window</span>
                <span className="font-semibold text-foreground">7 Days from Delivery Date</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Standard Delivery</span>
                <span className="font-semibold text-foreground">2 - 4 Business Days</span>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Write Review Box */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h4 className="font-bold text-base text-foreground mb-1">Leave a Review</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Have you purchased this product? Share your experience with other shoppers.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Your Rating:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= reviewRating
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-foreground">
                        {reviewRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your honest review here..."
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <Button type="submit" size="sm" isLoading={isSubmittingReview} className="gap-2">
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Review</span>
                  </Button>
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-foreground block">{rev.userName}</span>
                          <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground">You May Also Like</h3>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              More in {product.category?.name}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
