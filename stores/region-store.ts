import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCurrencyStore } from "./currency-store";

export type RegionCode = "USA" | "UK";

interface RegionStore {
  region: RegionCode | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setRegion: (region: RegionCode) => void;
  clearRegion: () => void;
}

function syncRegionCookieAndCurrency(region: RegionCode) {
  if (typeof document !== "undefined") {
    document.cookie = `clickcart_region=${region}; path=/; max-age=31536000; SameSite=Lax`;
  }
  useCurrencyStore.getState().setCurrency(region === "USA" ? "USD" : "GBP");
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set) => ({
      region: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setRegion: (region) => {
        syncRegionCookieAndCurrency(region);
        set({ region });
      },
      clearRegion: () => {
        if (typeof document !== "undefined") {
          document.cookie = `clickcart_region=; path=/; max-age=0`;
        }
        set({ region: null });
      },
    }),
    {
      name: "clickcart-region-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.region) {
          syncRegionCookieAndCurrency(state.region);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
