"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRegionStore } from "@/stores/region-store";
import { RegionSwitcher } from "@/components/region-selector-modal";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_CATEGORIES = [
  { name: "All Products", href: "/products" },
  { name: "Electronics", href: "/products?category=electronics" },
  { name: "Fashion", href: "/products?category=fashion" },
  { name: "Home & Kitchen", href: "/products?category=home-kitchen" },
  { name: "Beauty", href: "/products?category=beauty" },
  { name: "Sports", href: "/products?category=sports" },
  { name: "Toys", href: "/products?category=toys" },
  { name: "Books", href: "/products?category=books" },
  { name: "Groceries", href: "/products?category=groceries" },
];

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const region = useRegionStore((state) => state.region);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("search");
      if (q) setSearchQuery(q);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-foreground">
                ClickCart
              </span>
              <span className="text-[10px] -mt-1 font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {region === "UK" ? "🇬🇧 UK Store" : "🇺🇸 USA Store"}
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-20 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-background transition-all"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <RegionSwitcher />
            <ThemeToggle />

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {session ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-muted transition-colors border border-border"
                >
                  <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                    {session.user?.name?.slice(0, 1) || "U"}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {userDropdownOpen && session && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-xl z-50 py-2 text-sm">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-semibold text-foreground truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/account#orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Order History</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left border-t border-border mt-1 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Simple Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 py-2 border-t border-border/50 text-xs font-medium text-muted-foreground overflow-x-auto">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="hover:text-indigo-600 whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu & Search */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
