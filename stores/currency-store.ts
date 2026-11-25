import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CurrencyCode } from "@/lib/currency";

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (code) => set({ currency: code }),
    }),
    {
      name: "clickcart-currency-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
