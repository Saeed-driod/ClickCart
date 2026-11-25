import Link from "next/link";
import { ShoppingBag, Mail, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-foreground">ClickCart</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Simple, fast online shopping across the USA and UK. Choose your region from the top bar anytime.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-indigo-600" /> Fast Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Genuine Items</span>
              <span className="flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5 text-indigo-600" /> Easy Returns</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Shop</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/products" className="hover:text-indigo-600">All Products</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-indigo-600">Electronics</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-indigo-600">Fashion</Link></li>
              <li><Link href="/products?category=home-kitchen" className="hover:text-indigo-600">Home & Kitchen</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Support</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/cart" className="hover:text-indigo-600">Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-indigo-600">Wishlist</Link></li>
              <li><Link href="/order-tracking" className="hover:text-indigo-600">Track Order</Link></li>
              <li className="flex items-center gap-1 pt-1"><Mail className="h-3.5 w-3.5" /> support@clickcart.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} ClickCart (USA & UK). All rights reserved.</p>
      </div>
    </footer>
  );
}
