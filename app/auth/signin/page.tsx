"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, User, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error || "Invalid login credentials.");
    } else {
      toast.success("Welcome back to ClickCart!");
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleQuickLogin = async (role: "admin" | "customer") => {
    setIsLoading(true);
    const credentials =
      role === "admin"
        ? { email: "admin@clickcart.com", password: "Admin@123" }
        : { email: "customer@clickcart.com", password: "Customer@123" };

    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
      callbackUrl: role === "admin" ? "/admin" : callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Logged in as ${role === "admin" ? "Administrator" : "Customer"}!`);
      router.push(role === "admin" ? "/admin" : callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ClickCart
            </span>
          </Link>
          <h1 className="text-2xl font-black text-foreground">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Access your orders, wishlist, and exclusive store discounts
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Instant Demo Access (Single Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-background hover:bg-indigo-50 dark:hover:bg-indigo-950 text-left transition-all text-xs"
            >
              <span className="font-bold text-foreground block">Admin Portal</span>
              <span className="text-[10px] text-muted-foreground block truncate">admin@clickcart.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("customer")}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-background hover:bg-indigo-50 dark:hover:bg-indigo-950 text-left transition-all text-xs"
            >
              <span className="font-bold text-foreground block">Customer Demo</span>
              <span className="text-[10px] text-muted-foreground block truncate">customer@clickcart.com</span>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Email Address
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <span className="text-[11px] text-muted-foreground">Demo: Admin@123</span>
              </div>
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

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full font-bold">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to ClickCart's Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs text-muted-foreground">Loading...</div>}>
      <SignInContent />
    </React.Suspense>
  );
}
