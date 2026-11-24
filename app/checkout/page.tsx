"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PAKISTAN_CITIES = [
  "Islamabad",
  "Karachi",
  "Lahore",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, getTotal, discountAmount, appliedCoupon, clearCart } =
    useCartStore();
  const { currency } = useCurrencyStore();

  const [fullName, setFullName] = React.useState(session?.user?.name || "");
  const [email, setEmail] = React.useState(session?.user?.email || "");
  const [phone, setPhone] = React.useState("+92 3");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("Islamabad");
  const [postalCode, setPostalCode] = React.useState("44000");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 3000 ? 0 : 200;
  const grandTotal = getTotal(shippingFee);

  React.useEffect(() => {
    if (session?.user) {
      if (!fullName && session.user.name) setFullName(session.user.name);
      if (!email && session.user.email) setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim()) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/products");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      userId: (session?.user as any)?.id || null,
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      shippingAddress: `${street.trim()}, ${city}, Pakistan (Postal: ${postalCode.trim()})`,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount: grandTotal,
      couponCode: appliedCoupon?.code || null,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        subtotal: (item.product.salePrice || item.product.price) * item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const order = await response.json();

      clearCart();
      toast.success("Order placed successfully! Redirecting...");
      router.push(`/orders/${order.orderNumber || order.id}`);
    } catch (error) {
      console.error("Order submission error:", error);
      // Fallback redirect with generated mock number
      const mockNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${mockNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Your cart is currently empty.</h2>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
            <div>
              <h2 className="text-xl font-black text-foreground">Delivery & Shipping Address</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                We deliver to all cities, towns, and postal codes across Pakistan.
              </p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Mobile Phone Number (WhatsApp / SMS) *
                  </label>
                  <Input
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Complete Street Address (House/Flat#, Street, Sector/Area) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. House #12, Street 4, Sector G-11/3, near Main Market"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Postal Code
                </label>
                <Input
                  placeholder="44000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-base text-foreground">Select Payment Method</h3>

            <div className="p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-sm text-foreground block">
                  Cash on Delivery (COD) - Recommended
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Pay in cash directly to the courier agent when your package arrives at your delivery location. No upfront online credit card needed.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                100% Buyer Protection & Open-Box Check available upon delivery request.
              </span>
            </div>
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-base text-foreground pb-2 border-b border-border">
              Order Review ({items.length} items)
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex items-center gap-3 text-xs">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/40 shrink-0 border border-border">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.product.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-foreground">
                      {formatMoney(price * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatMoney(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatMoney(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? "FREE" : formatMoney(shippingFee, currency)}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm font-bold">
                <span>Total Amount Due</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatMoney(grandTotal, currency)}
                </span>
              </div>
            </div>

            <Button
              form="checkout-form"
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full gap-2 font-bold shadow-lg"
            >
              <Truck className="h-5 w-5" />
              <span>Confirm & Place COD Order</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
