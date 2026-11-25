"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  ShieldCheck,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setIsLoggingIn(false);

    if (result?.error) {
      toast.error("Invalid admin credentials.");
    } else {
      toast.success("Signed in to Admin Portal");
      router.refresh();
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs text-muted-foreground animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  // Standalone Admin Login Screen (completely separate from customer storefront)
  if (status === "unauthenticated" || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-foreground">ClickCart Admin</h1>
            <p className="text-xs text-muted-foreground">
              Standalone Management Portal. Sign in with your administrator account.
            </p>
          </div>

          {status === "authenticated" && !isAdmin && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 text-center">
              Signed in as <strong>{session?.user?.email}</strong> (Customer). Please sign in with an Admin account.
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  placeholder="admin@clickcart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button type="submit" size="lg" isLoading={isLoggingIn} className="w-full font-bold">
              Sign In to Admin
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-card border-r border-border shrink-0 flex flex-col">
        <div className="p-5 border-b border-border flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="font-black text-base text-foreground block leading-tight">ClickCart</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Admin Portal</span>
          </div>
        </div>

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
                <span className="text-xs font-bold text-foreground block truncate">
                  {session?.user?.name || "ClickCart Admin"}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
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
