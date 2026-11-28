import { prisma } from "./prisma";
import {
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_PRODUCTS,
  SEED_COUPONS,
} from "@/data/seed-data";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "./shipping";
import { ProductItem, CategoryItem, BrandItem, OrderType, CouponItem } from "@/types";

// In-memory runtime state for smooth fallback when database connection is pending
let memoryProducts: ProductItem[] = SEED_PRODUCTS.map((p) => ({
  ...p,
  isActive: true,
  category: {
    id: p.categoryId,
    name: SEED_CATEGORIES.find((c) => c.id === p.categoryId)?.name || "General",
    slug: SEED_CATEGORIES.find((c) => c.id === p.categoryId)?.slug || "general",
  },
  brand: p.brandId
    ? {
        id: p.brandId,
        name: SEED_BRANDS.find((b) => b.id === p.brandId)?.name || "",
        slug: SEED_BRANDS.find((b) => b.id === p.brandId)?.slug || "",
      }
    : null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

let memoryCategories: CategoryItem[] = SEED_CATEGORIES.map((c) => ({
  ...c,
  isActive: true,
  _count: {
    products: memoryProducts.filter((p) => p.categoryId === c.id).length,
  },
}));

let memoryBrands: BrandItem[] = SEED_BRANDS.map((b) => ({
  ...b,
  isActive: true,
  _count: {
    products: memoryProducts.filter((p) => p.brandId === b.id).length,
  },
}));

let memoryCoupons: CouponItem[] = [...SEED_COUPONS];

let memoryOrders: OrderType[] = [
  {
    id: "ord-1001",
    orderNumber: "ORD-98241",
    userId: "cust-demo",
    customerName: "Emily Carter",
    customerEmail: "emily.carter@example.com",
    customerPhone: "+1 555 234 5678",
    shippingAddress: "742 Evergreen Terrace, New York, NY 10001, United States",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PROCESSING",
    subtotal: 129.99,
    discountAmount: 13.0,
    shippingFee: 0,
    totalAmount: 116.99,
    couponCode: "WELCOME10",
    trackingNumber: "USPS-9921448",
    trackingNotes: "Dispatched from New York Fulfillment Center.",
    items: [
      {
        id: "item-1",
        productId: "prod-usa-1",
        productName: "Studio ANC Wireless Headphones (US Edition)",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        price: 129.99,
        quantity: 1,
        subtotal: 129.99,
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-98242",
    userId: "cust-demo-2",
    customerName: "Oliver Bennett",
    customerEmail: "oliver.b@example.com",
    customerPhone: "+44 7700 900123",
    shippingAddress: "221B Baker Street, London NW1 6XE, United Kingdom",
    paymentMethod: "COD",
    paymentStatus: "PAID",
    orderStatus: "DELIVERED",
    subtotal: 149.99,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 149.99,
    couponCode: null,
    trackingNumber: "DPD-9921449",
    trackingNotes: "Delivered and signed by recipient.",
    items: [
      {
        id: "item-2",
        productId: "prod-uk-15",
        productName: "British Hi-Fi Wireless Noise-Cancelling Headphones",
        productImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
        price: 149.99,
        quantity: 1,
        subtotal: 149.99,
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

let memorySettings = {
  id: "default",
  storeName: "ClickCart",
  storeEmail: "support@clickcart.com",
  storePhone: "+1 (800) 555-0199",
  address: "350 Fifth Avenue, New York, NY 10118, USA",
  currency: "USD",
  shippingFee: STANDARD_SHIPPING_FEE,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  logoUrl: null,
};

// Centralized check for whether a live external database is configured
export function isDatabaseActive(): boolean {
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url || url.includes("placeholder")) return false;
  try {
    const normalized = url
      .replace(/^mongodb(\+srv)?:\/\//i, "http://")
      .replace(/^postgres(ql)?:\/\//i, "http://");
    const parsed = new URL(normalized);
    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1"
    ) {
      return false;
    }
  } catch {
    if (/\blocalhost\b|127\.0\.0\.1/i.test(url)) return false;
  }
  return true;
}

// Database Access Helpers with safe fallback
export async function getProducts(options?: {
  search?: string;
  category?: string;
  brand?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  isFlashDeal?: boolean;
  sort?: "price-asc" | "price-desc" | "newest" | "rating" | "popular";
  page?: number;
  limit?: number;
}) {
  try {
    if (isDatabaseActive()) {
      const where: any = { isActive: true };
      if (options?.region && (options.region === "USA" || options.region === "UK")) {
        where.region = options.region;
      }
      if (options?.category) {
        where.category = { slug: options.category };
      }
      if (options?.brand) {
        where.brand = { slug: options.brand };
      }
      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: "insensitive" } },
          { description: { contains: options.search, mode: "insensitive" } },
        ];
      }
      if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
        where.price = {};
        if (options?.minPrice !== undefined) where.price.gte = options.minPrice;
        if (options?.maxPrice !== undefined) where.price.lte = options.maxPrice;
      }
      if (options?.rating) {
        where.rating = { gte: options.rating };
      }
      if (options?.inStock) {
        where.stock = { gt: 0 };
      }
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }
      if (options?.isFlashDeal !== undefined) {
        where.isFlashDeal = options.isFlashDeal;
      }

      let orderBy: any = { createdAt: "desc" };
      if (options?.sort === "price-asc") orderBy = { price: "asc" };
      if (options?.sort === "price-desc") orderBy = { price: "desc" };
      if (options?.sort === "rating") orderBy = { rating: "desc" };
      if (options?.sort === "popular") orderBy = { reviewCount: "desc" };

      const page = options?.page || 1;
      const limit = options?.limit || 16;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { category: true, brand: true },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      if (products.length > 0 || total > 0) {
        return { products, total, totalPages: Math.ceil(total / limit), currentPage: page };
      }
    }
  } catch (error) {
    // Fallback to memory store
  }

  // Memory fallback query logic
  let filtered = [...memoryProducts].filter((p) => p.isActive);

  if (options?.region && (options.region === "USA" || options.region === "UK")) {
    filtered = filtered.filter((p) => p.region === options.region);
  }
  if (options?.category) {
    filtered = filtered.filter(
      (p) => p.category?.slug.toLowerCase() === options.category?.toLowerCase() || p.categoryId === options.category
    );
  }
  if (options?.brand) {
    filtered = filtered.filter(
      (p) => p.brand?.slug.toLowerCase() === options.brand?.toLowerCase() || p.brandId === options.brand
    );
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (options?.minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice || p.price) >= (options.minPrice || 0));
  }
  if (options?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice || p.price) <= (options.maxPrice || Infinity));
  }
  if (options?.rating) {
    filtered = filtered.filter((p) => p.rating >= (options.rating || 0));
  }
  if (options?.inStock) {
    filtered = filtered.filter((p) => p.stock > 0);
  }
  if (options?.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === options.featured);
  }
  if (options?.isFlashDeal !== undefined) {
    filtered = filtered.filter((p) => p.isFlashDeal === options.isFlashDeal);
  }

  // Sorting
  if (options?.sort === "price-asc") {
    filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (options?.sort === "price-desc") {
    filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (options?.sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (options?.sort === "popular") {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    // Newest
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const page = options?.page || 1;
  const limit = options?.limit || 16;
  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    if (isDatabaseActive()) {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
      const prod = await prisma.product.findFirst({
        where: isMongoId ? { OR: [{ id: slug }, { slug }] } : { slug },
        include: {
          category: true,
          brand: true,
          reviews: {
            where: { isApproved: true },
            include: { user: { select: { id: true, name: true, image: true, email: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (prod) return prod as unknown as ProductItem;
    }
  } catch (e) {}

  const item = memoryProducts.find((p) => p.slug === slug || p.id === slug);
  return item || null;
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    if (isDatabaseActive()) {
      const cats = await prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
      });
      if (cats.length > 0) return cats as CategoryItem[];
    }
  } catch (e) {}
  return memoryCategories;
}

export async function getBrands(): Promise<BrandItem[]> {
  try {
    if (isDatabaseActive()) {
      const brands = await prisma.brand.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
      });
      if (brands.length > 0) return brands as BrandItem[];
    }
  } catch (e) {}
  return memoryBrands;
}

export async function getOrders(userId?: string): Promise<OrderType[]> {
  try {
    if (isDatabaseActive()) {
      const where = userId ? { userId } : {};
      const orders = await prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      if (orders.length > 0) return orders as unknown as OrderType[];
    }
  } catch (e) {}

  if (userId) {
    return memoryOrders.filter((o) => o.userId === userId);
  }
  return memoryOrders;
}

export async function getOrderById(idOrNumber: string): Promise<OrderType | null> {
  try {
    if (isDatabaseActive()) {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrNumber);
      const order = await prisma.order.findFirst({
        where: isMongoId
          ? { OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }] }
          : { orderNumber: idOrNumber },
        include: { items: true },
      });
      if (order) return order as unknown as OrderType;
    }
  } catch (e) {}

  return memoryOrders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber) || null;
}

export async function createOrder(orderData: Partial<OrderType>): Promise<OrderType> {
  const newOrder: OrderType = {
    id: `ord-${Date.now()}`,
    orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: orderData.userId || null,
    customerName: orderData.customerName || "Customer",
    customerEmail: orderData.customerEmail || "customer@example.com",
    customerPhone: orderData.customerPhone || "+1 (555) 000-0000",
    shippingAddress: orderData.shippingAddress || "",
    paymentMethod: orderData.paymentMethod || "COD",
    paymentStatus: orderData.paymentStatus || "PENDING",
    orderStatus: "PENDING",
    subtotal: orderData.subtotal || 0,
    discountAmount: orderData.discountAmount || 0,
    shippingFee: orderData.shippingFee || 0,
    totalAmount: orderData.totalAmount || 0,
    couponCode: orderData.couponCode || null,
    trackingNumber: `CC-${Math.floor(1000000 + Math.random() * 9000000)}`,
    trackingNotes: "Order placed successfully. Waiting for dispatch.",
    items: orderData.items || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    if (isDatabaseActive()) {
      const preparedItems = await Promise.all(
        newOrder.items.map(async (item) => {
          let pId = item.productId;
          if (!/^[0-9a-fA-F]{24}$/.test(pId)) {
            const found = await prisma.product.findFirst({
              where: { name: item.productName },
              select: { id: true },
            });
            if (found) pId = found.id;
          }
          return {
            productId: pId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          };
        })
      );

      const [dbOrder] = await prisma.$transaction([
        prisma.order.create({
          data: {
            orderNumber: newOrder.orderNumber,
            userId: newOrder.userId && /^[0-9a-fA-F]{24}$/.test(newOrder.userId) ? newOrder.userId : null,
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            customerPhone: newOrder.customerPhone,
            shippingAddress: newOrder.shippingAddress,
            paymentMethod: newOrder.paymentMethod,
            paymentStatus: newOrder.paymentStatus,
            orderStatus: newOrder.orderStatus,
            subtotal: newOrder.subtotal,
            discountAmount: newOrder.discountAmount,
            shippingFee: newOrder.shippingFee,
            totalAmount: newOrder.totalAmount,
            couponCode: newOrder.couponCode,
            trackingNumber: newOrder.trackingNumber,
            trackingNotes: newOrder.trackingNotes,
            items: {
              create: preparedItems,
            },
          },
          include: { items: true },
        }),
        ...preparedItems.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);
      return dbOrder as unknown as OrderType;
    }
  } catch (e) {
    console.error("Order save fallback:", e);
  }

  // Memory path: decrement stock only after successful order push
  memoryOrders.unshift(newOrder);
  for (const item of newOrder.items) {
    const mp = memoryProducts.find((p) => p.id === item.productId || p.name === item.productName);
    if (mp && typeof mp.stock === "number") {
      mp.stock = Math.max(0, mp.stock - item.quantity);
    }
  }
  return newOrder;
}

export async function validateCoupon(code: string, subtotal: number): Promise<{
  valid: boolean;
  coupon?: CouponItem;
  discount: number;
  message: string;
}> {
  const normalized = code.trim().toUpperCase();

  try {
    if (isDatabaseActive()) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: normalized },
      });
      if (coupon && coupon.isActive) {
        if (new Date(coupon.expiryDate) < new Date()) {
          return { valid: false, discount: 0, message: "Coupon has expired" };
        }
        if (subtotal < coupon.minOrderAmount) {
          return {
            valid: false,
            discount: 0,
            message: `Minimum order amount for this coupon is $${coupon.minOrderAmount.toFixed(2)}`,
          };
        }
        let discount = 0;
        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        return {
          valid: true,
          coupon: coupon as CouponItem,
          discount: Number(discount.toFixed(2)),
          message: "Coupon applied successfully!",
        };
      }
    }
  } catch (e) {}

  const coupon = memoryCoupons.find((c) => c.code.toUpperCase() === normalized && c.isActive);
  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }
  if (new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, discount: 0, message: "Coupon has expired" };
  }
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount for this coupon is $${coupon.minOrderAmount.toFixed(2)}`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return {
    valid: true,
    coupon,
    discount: Number(discount.toFixed(2)),
    message: "Coupon applied successfully!",
  };
}

export async function getStoreSettings() {
  try {
    if (isDatabaseActive()) {
      const settings = await prisma.storeSettings.findFirst();
      if (settings) return settings;
    }
  } catch (e) {}
  return memorySettings;
}

export function getMemoryStore() {
  return {
    products: memoryProducts,
    categories: memoryCategories,
    brands: memoryBrands,
    orders: memoryOrders,
    coupons: memoryCoupons,
    settings: memorySettings,
  };
}
