"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from "lucide-react";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories & Brands", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Reviews Moderation", href: "/admin/reviews", icon: Star },
  { name: "Store Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Role-based protection
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Verifying Admin Privileges...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card text-center space-y-4 shadow-xl">
          <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Admin Access Required</h1>
          <p className="text-xs text-muted-foreground">
            You must be signed in as an authorized Store Administrator to view the ClickCart Management Portal.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/signin?callbackUrl=/admin"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md"
            >
              Sign In as Admin (admin@clickcart.com)
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl border border-input text-xs font-semibold hover:bg-muted"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-card border-r border-border shrink-0 flex flex-col">
        {/* Brand bar */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <span className="font-black text-base text-foreground block leading-tight">ClickCart</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Admin Portal</span>
            </div>
          </Link>
          <Link
            href="/"
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs"
            title="View Live Storefront"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0">
                A
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">ClickCart Admin</span>
                <span className="text-[10px] text-muted-foreground block truncate">admin@clickcart.com</span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
