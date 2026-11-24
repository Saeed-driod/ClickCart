import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_PRODUCTS,
  SEED_COUPONS,
} from "../data/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ClickCart Database Seed...");

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:5432")) {
    console.log("ℹ️  Note: Neon Postgres DATABASE_URL not yet configured in .env.");
    console.log("ℹ️  To seed your live database, provide your free Neon Postgres connection string in .env and run 'npm run prisma:seed'");
    console.log("✅ The ClickCart storefront and admin portal will run in high-performance in-memory mode with 200+ seeded products loaded automatically!");
    return;
  }

  // 1. Seed Store Settings
  console.log("-> Seeding Store Settings...");
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "ClickCart",
      storeEmail: "support@clickcart.com",
      storePhone: "+92 300 1234567",
      address: "ClickCart HQ, Blue Area, Islamabad, Pakistan",
      currency: "PKR",
      shippingFee: 200,
      freeShippingThreshold: 3000,
    },
  });

  // 2. Seed Admin & Customer Users
  console.log("-> Seeding Users...");
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@clickcart.com" },
    update: {
      password: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      name: "ClickCart Admin",
      email: "admin@clickcart.com",
      password: adminPasswordHash,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      phone: "+92 300 1112233",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@clickcart.com" },
    update: {
      password: customerPasswordHash,
      role: "CUSTOMER",
    },
    create: {
      name: "Demo Customer",
      email: "customer@clickcart.com",
      password: customerPasswordHash,
      role: "CUSTOMER",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      phone: "+92 321 9988776",
    },
  });

  // 3. Seed Categories
  console.log("-> Seeding Categories...");
  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      },
    });
  }

  // 4. Seed Brands
  console.log("-> Seeding Brands...");
  for (const brand of SEED_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
      },
      create: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
      },
    });
  }

  // 5. Seed 200+ Products
  console.log(`-> Seeding ${SEED_PRODUCTS.length} Products...`);
  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        sku: p.sku,
        stock: p.stock,
        images: p.images,
        featured: p.featured || false,
        isFlashDeal: p.isFlashDeal || false,
        flashDealEnd: p.flashDealEnd ? new Date(p.flashDealEnd) : null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: p.categoryId,
        brandId: p.brandId,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        sku: p.sku,
        stock: p.stock,
        images: p.images,
        featured: p.featured || false,
        isFlashDeal: p.isFlashDeal || false,
        flashDealEnd: p.flashDealEnd ? new Date(p.flashDealEnd) : null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: p.categoryId,
        brandId: p.brandId,
      },
    });
  }

  // 6. Seed Coupons
  console.log("-> Seeding Coupons...");
  for (const c of SEED_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        expiryDate: c.expiryDate,
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
      },
      create: {
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        expiryDate: c.expiryDate,
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
        isActive: true,
      },
    });
  }

  // 7. Seed Demo Orders
  console.log("-> Seeding Demo Orders...");
  const sampleProduct = SEED_PRODUCTS[0];
  const sampleProduct2 = SEED_PRODUCTS[30];

  const orderNumber1 = "ORD-781923";
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: orderNumber1 },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        orderNumber: orderNumber1,
        userId: customer.id,
        customerName: "Demo Customer",
        customerEmail: "customer@clickcart.com",
        customerPhone: "+92 321 9988776",
        shippingAddress: "House 24, Street 5, Sector F-8/2, Islamabad, Pakistan",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PROCESSING",
        subtotal: sampleProduct.price + sampleProduct2.price,
        discountAmount: 500,
        shippingFee: 0,
        totalAmount: sampleProduct.price + sampleProduct2.price - 500,
        couponCode: "WELCOME10",
        trackingNumber: "TCS-9018274",
        trackingNotes: "Package processed at sorting hub.",
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productName: sampleProduct.name,
              productImage: sampleProduct.images[0],
              price: sampleProduct.price,
              quantity: 1,
              subtotal: sampleProduct.price,
            },
            {
              productId: sampleProduct2.id,
              productName: sampleProduct2.name,
              productImage: sampleProduct2.images[0],
              price: sampleProduct2.price,
              quantity: 1,
              subtotal: sampleProduct2.price,
            },
          ],
        },
      },
    });
  }

  console.log("✅ ClickCart Database seeded successfully!");
  console.log("Admin credentials: admin@clickcart.com / Admin@123");
  console.log("Customer credentials: customer@clickcart.com / Customer@123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
