export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type DiscountType = "PERCENTAGE" | "FIXED";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  images: string[];
  featured?: boolean;
  isFlashDeal?: boolean;
  flashDealEnd?: string | Date | null;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brandId?: string | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
  } | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface ReviewItem {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string | Date;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  expiryDate: string | Date;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}

export interface OrderItemType {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  trackingNotes?: string | null;
  items: OrderItemType[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface StoreSettingsType {
  id: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  address: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  logoUrl?: string | null;
}
