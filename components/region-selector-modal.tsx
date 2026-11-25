"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, CheckCircle2, ArrowRight, Globe } from "lucide-react";
import { useRegionStore, RegionCode } from "@/stores/region-store";

export function RegionSelectorModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { region, hasHydrated, setRegion } = useRegionStore();

  // Do not block admin or auth pages
  const isExcludedRoute = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  if (!hasHydrated || region !== null || isExcludedRoute) {
    return null;
  }

  const handleSelect = (selected: RegionCode) => {
    setRegion(selected);
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Welcome to ClickCart
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Please choose your region to see products and prices tailored for you.
          </p>
        </div>

        {/* Two Big Clear Options: USA vs UK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("USA")}
            className="group relative flex flex-col items-center text-center p-6 rounded-2xl border-2 border-border bg-background hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all active:scale-[0.98]"
          >
            <span className="text-5xl mb-3" role="img" aria-label="USA Flag">
              🇺🇸
            </span>
            <h3 className="text-lg font-black text-foreground group-hover:text-indigo-600">
              United States (USA)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Shop USA Store • Prices in USD ($)
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
              View USA Products <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleSelect("UK")}
            className="group relative flex flex-col items-center text-center p-6 rounded-2xl border-2 border-border bg-background hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all active:scale-[0.98]"
          >
            <span className="text-5xl mb-3" role="img" aria-label="UK Flag">
              🇬🇧
            </span>
            <h3 className="text-lg font-black text-foreground group-hover:text-indigo-600">
              United Kingdom (UK)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Shop UK Store • Prices in GBP (£)
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
              View UK Products <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>You can switch between USA and UK anytime from the top bar.</span>
        </p>
      </div>
    </div>
  );
}

export function RegionSwitcher() {
  const router = useRouter();
  const { region, hasHydrated, setRegion, clearRegion } = useRegionStore();

  if (!hasHydrated) {
    return <div className="h-9 w-24 rounded-lg border border-border animate-pulse bg-muted/40" />;
  }

  const activeRegion = region || "USA";

  const toggleRegion = () => {
    const next: RegionCode = activeRegion === "USA" ? "UK" : "USA";
    setRegion(next);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
      <button
        onClick={() => {
          if (activeRegion !== "USA") {
            setRegion("USA");
            router.refresh();
          }
        }}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
          activeRegion === "USA"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Switch to USA Store"
      >
        <span>🇺🇸</span>
        <span>USA</span>
      </button>
      <button
        onClick={() => {
          if (activeRegion !== "UK") {
            setRegion("UK");
            router.refresh();
          }
        }}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
          activeRegion === "UK"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Switch to UK Store"
      >
        <span>🇬🇧</span>
        <span>UK</span>
      </button>
    </div>
  );
}
