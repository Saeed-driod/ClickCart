"use client";

import * as React from "react";
import { useCurrencyStore } from "@/stores/currency-store";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { Globe } from "lucide-react";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border"
        title="Change Currency"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{currency} ({CURRENCIES[currency]?.symbol})</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-44 rounded-lg border border-border bg-popover shadow-xl z-50 py-1 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              Select Currency
            </div>
            {Object.values(CURRENCIES).map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code as CurrencyCode);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted transition-colors ${
                  currency === c.code ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold" : ""
                }`}
              >
                <span>{c.name}</span>
                <span className="font-mono font-medium">{c.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
