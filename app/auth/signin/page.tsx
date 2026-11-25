"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag, User, Lock, Mail, ArrowRight } from "lucide-react";
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

  const handleDemoCustomerLogin = async () => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      email: "customer@clickcart.com",
      password: "Customer@123",
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in as Customer!");
      router.push(callbackUrl);
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
            <span className="text-2xl font-black text-foreground">ClickCart</span>
          </Link>
          <h1 className="text-2xl font-black text-foreground">Customer Sign In</h1>
          <p className="text-xs text-muted-foreground">
            Access your orders, wishlist, and saved addresses
          </p>
        </div>

        {/* Demo Customer Login */}
        <button
          type="button"
          onClick={handleDemoCustomerLogin}
          disabled={isLoading}
          className="w-full p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 transition-all flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-indigo-600" />
            <div className="text-left">
              <span className="font-bold text-foreground block">Quick Demo Customer Login</span>
              <span className="text-[11px] text-muted-foreground">customer@clickcart.com</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-600" />
        </button>

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
                  placeholder="you@example.com"
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

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full font-bold">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
        </div>
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
