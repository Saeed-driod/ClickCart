import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  Zap,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featuredResult, flashDealsResult, newArrivalsResult] =
    await Promise.all([
      getCategories(),
      getProducts({ featured: true, limit: 8 }),
      getProducts({ isFlashDeal: true, limit: 4 }),
      getProducts({ sort: "newest", limit: 8 }),
    ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Pakistan's Fastest Growing E-Commerce Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Everything You Need, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Delivered To Your Door.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-indigo-100/90 max-w-xl mx-auto lg:mx-0">
                Explore 200+ authentic products across Electronics, Fashion, Home, Beauty, and Groceries. Pay with Cash on Delivery anywhere in Pakistan.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shop Catalog (200+)</span>
                </Link>
                <Link
                  href="/products?deals=true"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold border border-white/20 backdrop-blur-sm transition-all"
                >
                  <Zap className="h-5 w-5 text-amber-300 fill-amber-300" />
                  <span>Flash Deals (20% Off)</span>
                </Link>
              </div>

              {/* Promo Banner Ticker */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-indigo-200">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Use Coupon: <strong className="text-white bg-white/20 px-2 py-0.5 rounded font-mono">WELCOME10</strong> for 10% off</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  alt="Featured Electronics"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-300">Trending Now</span>
                  <h3 className="text-xl font-bold text-white">Premium Wireless Audio & Tech</h3>
                  <p className="text-xs text-slate-300 mt-1">Starting from ₨ 3,500 with official warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Explore Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Shop by Category</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-lg hover:border-indigo-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted mb-3">
                <Image
                  src={cat.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {cat.description}
              </p>
              <span className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                Browse collection <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 fill-white" />
                <span>Limited Time Flash Sale</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Up to 20% Off Mega Deals</h2>
              <p className="text-xs sm:text-sm text-white/90">Exclusive discounts on high-demand gadgets and essentials</p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-2xl p-3 text-center border border-white/20 self-start md:self-auto">
              <div className="px-2">
                <span className="block text-xl font-black font-mono">48</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-200">Hours</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="px-2">
                <span className="block text-xl font-black font-mono">24</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-200">Mins</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="px-2">
                <span className="block text-xl font-black font-mono">15</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-200">Secs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDealsResult.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Handpicked Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Featured Products</h2>
          </div>
          <Link
            href="/products?featured=true"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredResult.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Fresh Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">New Arrivals</h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            <span>Explore Latest</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivalsResult.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Why Shop at ClickCart?
            </h2>
            <p className="text-sm text-muted-foreground">
              We are dedicated to bringing Pakistan the best e-commerce experience with transparent pricing, zero hidden charges, genuine products, and verified doorstep Cash on Delivery.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md transition-colors"
              >
                Start Shopping Now
              </Link>
              <Link
                href="/order-tracking"
                className="px-6 py-3 rounded-xl border border-input bg-background font-bold hover:bg-muted transition-colors"
              >
                Track An Existing Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
