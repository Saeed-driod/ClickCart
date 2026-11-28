export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_FEE = 5;

export function calculateShippingFee(subtotal: number, hasItems = true): number {
  if (!hasItems || subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}
