import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartProduct, CouponItem } from "@/types";
import {
  STANDARD_SHIPPING_FEE,
  calculateShippingFee,
} from "@/lib/shipping";

interface CartStore {
  items: CartItem[];
  appliedCoupon: CouponItem | null;
  discountAmount: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CouponItem, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTotal: (shippingFee?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      discountAmount: 0,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((item) => item.product.id === product.id);

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, product.stock);
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity: Math.min(quantity, product.stock) }],
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((item) => item.product.id !== productId) });
          return;
        }

        set({
          items: items.map((item) => {
            if (item.product.id === productId) {
              const safeQty = Math.min(quantity, item.product.stock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, discountAmount: 0 });
      },

      applyCoupon: (coupon, discount) => {
        set({ appliedCoupon: coupon, discountAmount: discount });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, discountAmount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.product.salePrice || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotal: (shippingFee = STANDARD_SHIPPING_FEE) => {
        const { items, discountAmount, getSubtotal } = get();
        const subtotal = getSubtotal();
        const fee =
          shippingFee === STANDARD_SHIPPING_FEE
            ? calculateShippingFee(subtotal, items.length > 0)
            : shippingFee;
        return Number(Math.max(0, subtotal - discountAmount + fee).toFixed(2));
      },
    }),
    {
      name: "clickcart-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
