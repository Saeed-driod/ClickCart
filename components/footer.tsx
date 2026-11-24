import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-20">
      {/* Value Proposition Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-muted-foreground">On all orders above ₨ 3,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">100% Genuine Products</h4>
              <p className="text-xs text-muted-foreground">Direct from authorized suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">7-Day Easy Returns</h4>
              <p className="text-xs text-muted-foreground">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-muted-foreground">Call or chat with our experts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ClickCart
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Pakistan's premier multi-category e-commerce platform offering 200+ curated products across electronics, fashion, beauty, home essentials, and groceries with fast Cash on Delivery.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>ClickCart HQ, Blue Area, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>+92 300 1234567 / 051-8899000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>support@clickcart.com</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-bold text-sm mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/products?category=electronics" className="hover:text-indigo-600 transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-indigo-600 transition-colors">Fashion Apparel</Link></li>
              <li><Link href="/products?category=home-kitchen" className="hover:text-indigo-600 transition-colors">Home & Kitchen</Link></li>
              <li><Link href="/products?category=beauty" className="hover:text-indigo-600 transition-colors">Beauty & Care</Link></li>
              <li><Link href="/products?category=sports" className="hover:text-indigo-600 transition-colors">Sports & Fitness</Link></li>
              <li><Link href="/products?category=groceries" className="hover:text-indigo-600 transition-colors">Gourmet Groceries</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="font-bold text-sm mb-3">Customer Care</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/order-tracking" className="hover:text-indigo-600 transition-colors">Track Your Order</Link></li>
              <li><Link href="/account#orders" className="hover:text-indigo-600 transition-colors">Order History</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-600 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-indigo-600 transition-colors">My Wishlist</Link></li>
              <li><Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h5 className="font-bold text-sm mb-3">Payment Methods</h5>
            <div className="space-y-2 text-xs text-muted-foreground">
              <span className="inline-block px-2.5 py-1 rounded bg-muted font-semibold text-foreground">
                💵 Cash on Delivery (COD)
              </span>
              <p className="text-[11px] text-muted-foreground">
                Pay in cash when your package arrives at your doorstep anywhere in Pakistan.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                <span className="px-2 py-0.5 rounded border border-border">Visa</span>
                <span className="px-2 py-0.5 rounded border border-border">Mastercard</span>
                <span className="px-2 py-0.5 rounded border border-border">JazzCash</span>
                <span className="px-2 py-0.5 rounded border border-border">EasyPaisa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} ClickCart Pakistan. All rights reserved. Built with Next.js 14, Tailwind CSS & Prisma.</p>
      </div>
    </footer>
  );
}
