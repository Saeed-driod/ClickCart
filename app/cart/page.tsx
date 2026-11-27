"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTotal,
    clearCart,
  } = useCartStore();

  const { currency } = useCurrencyStore();
  const [couponInput, setCouponInput] = React.useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 50 || items.length === 0 ? 0 : 5;
  const grandTotal = getTotal(shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        applyCoupon(data.coupon, data.discount);
        toast.success(`Coupon applied! You saved ${formatMoney(data.discount, currency)}`);
        setCouponInput("");
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (e) {
      const code = couponInput.trim().toUpperCase();
      if (code === "WELCOME10") {
        if (subtotal < 20) {
          toast.error(`Minimum order for WELCOME10 is ${formatMoney(20, currency)}`);
        } else {
          const disc = Math.min(Number((subtotal * 0.1).toFixed(2)), 50);
          applyCoupon({ id: "1", code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 20, expiryDate: new Date(), usedCount: 0, isActive: true }, disc);
          toast.success("Coupon WELCOME10 applied (10% off)!");
        }
      } else if (code === "CLICK20") {
        if (subtotal < 60) {
          toast.error(`Minimum order for CLICK20 is ${formatMoney(60, currency)}`);
        } else {
          const disc = Math.min(Number((subtotal * 0.2).toFixed(2)), 100);
          applyCoupon({ id: "2", code: "CLICK20", discountType: "PERCENTAGE", discountValue: 20, minOrderAmount: 60, expiryDate: new Date(), usedCount: 0, isActive: true }, disc);
          toast.success("Coupon CLICK20 applied (20% off)!");
        }
      } else if (code === "FLAT10") {
        if (subtotal < 40) {
          toast.error(`Minimum order for FLAT10 is ${formatMoney(40, currency)}`);
        } else {
          applyCoupon({ id: "3", code: "FLAT10", discountType: "FIXED", discountValue: 10, minOrderAmount: 40, expiryDate: new Date(), usedCount: 0, isActive: true }, 10);
          toast.success(`Coupon FLAT10 applied (${formatMoney(10, currency)} off)!`);
        }
      } else {
        toast.error("Invalid coupon code. Try WELCOME10 or CLICK20");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 mx-auto">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Your Shopping Cart is Empty</h1>
          <p className="text-xs text-muted-foreground">
            Looks like you haven't added any products to your cart yet. Discover 200+ amazing items waiting for you!
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Shopping Cart</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review your items and proceed to fast Cash on Delivery checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const price = item.product.salePrice || item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card transition-all hover:border-indigo-200"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted/30 shrink-0 border border-border">
                    <Image
                      src={item.product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-foreground hover:text-indigo-600 line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span>{formatMoney(price, currency)} each</span>
                      {item.product.stock <= 5 && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          (Only {item.product.stock} left)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-border">
                  {/* Quantity controls */}
                  <div className="flex items-center rounded-lg border border-border bg-background">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted text-muted-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1.5 hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-black text-foreground">
                      {formatMoney(itemTotal, currency)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => {
                      removeItem(item.product.id);
                      toast.info("Item removed from cart");
                    }}
                    className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Delivery Note */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              {subtotal >= 50 ? (
                <strong className="text-emerald-600 dark:text-emerald-400">
                  🎉 Your order qualifies for FREE Express Delivery!
                </strong>
              ) : (
                <span>
                  Add <strong>{formatMoney(50 - subtotal, currency)}</strong> more to your cart to get <strong>FREE Delivery</strong>!
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-600" />
              <span>Promo / Coupon Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="block text-[10px]">Saved {formatMoney(discountAmount, currency)}</span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 hover:bg-emerald-100 rounded text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="uppercase text-xs"
                />
                <Button type="submit" size="sm" isLoading={isApplyingCoupon}>
                  Apply
                </Button>
              </form>
            )}
            <div className="text-[11px] text-muted-foreground">
              Try: <span className="font-mono font-bold text-foreground">WELCOME10</span> (10% off) or <span className="font-mono font-bold text-foreground">CLICK20</span> (20% off)
            </div>
          </div>

          {/* Financial Totals */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-base text-foreground pb-2 border-b border-border">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatMoney(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatMoney(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">FREE</span>
                  ) : (
                    formatMoney(shippingFee, currency)
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-foreground">Total Amount</span>
                <span className="block text-[10px] text-muted-foreground">Including all applicable taxes</span>
              </div>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatMoney(grandTotal, currency)}
              </span>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              size="lg"
              className="w-full gap-2 font-bold shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-[11px] text-center text-muted-foreground">
              💵 Payment: Cash on Delivery available at doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
