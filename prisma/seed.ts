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
  console.log("🌱 Starting ClickCart Database Seed on MongoDB Atlas...");

  // 1. Seed Store Settings
  console.log("-> Seeding Store Settings...");
  const existingSettings = await prisma.storeSettings.findFirst();
  if (existingSettings) {
    await prisma.storeSettings.update({
      where: { id: existingSettings.id },
      data: {
        storeName: "ClickCart",
        storeEmail: "support@clickcart.com",
        storePhone: "+92 300 1234567",
        address: "ClickCart HQ, Blue Area, Islamabad, Pakistan",
        currency: "PKR",
        shippingFee: 200,
        freeShippingThreshold: 3000,
      },
    });
  } else {
    await prisma.storeSettings.create({
      data: {
        storeName: "ClickCart",
        storeEmail: "support@clickcart.com",
        storePhone: "+92 300 1234567",
        address: "ClickCart HQ, Blue Area, Islamabad, Pakistan",
        currency: "PKR",
        shippingFee: 200,
        freeShippingThreshold: 3000,
      },
    });
  }

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

  // 3. Seed Categories & build lookup map
  console.log("-> Seeding Categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of SEED_CATEGORIES) {
    const dbCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      },
    });
    categoryMap[cat.id] = dbCat.id;
    categoryMap[cat.slug] = dbCat.id;
  }

  // 4. Seed Brands & build lookup map
  console.log("-> Seeding Brands...");
  const brandMap: Record<string, string> = {};
  for (const brand of SEED_BRANDS) {
    const dbBrand = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
      },
    });
    brandMap[brand.id] = dbBrand.id;
    brandMap[brand.slug] = dbBrand.id;
  }

  // 5. Seed 200+ Products
  console.log(`-> Seeding ${SEED_PRODUCTS.length} Products into MongoDB...`);
  const seededProducts = [];
  for (const p of SEED_PRODUCTS) {
    const targetCategoryId = categoryMap[p.categoryId] || Object.values(categoryMap)[0];
    const targetBrandId = p.brandId ? brandMap[p.brandId] || null : null;

    const dbProd = await prisma.product.upsert({
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
        categoryId: targetCategoryId,
        brandId: targetBrandId,
      },
      create: {
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
        categoryId: targetCategoryId,
        brandId: targetBrandId,
      },
    });
    seededProducts.push(dbProd);
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

  // 7. Seed Demo Order
  console.log("-> Seeding Demo Orders...");
  const sampleProduct1 = seededProducts[0];
  const sampleProduct2 = seededProducts[30];

  const orderNumber1 = "ORD-781923";
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: orderNumber1 },
  });

  if (!existingOrder && sampleProduct1 && sampleProduct2) {
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
        subtotal: sampleProduct1.price + sampleProduct2.price,
        discountAmount: 500,
        shippingFee: 0,
        totalAmount: sampleProduct1.price + sampleProduct2.price - 500,
        couponCode: "WELCOME10",
        trackingNumber: "TCS-9018274",
        trackingNotes: "Package processed at sorting hub.",
        items: {
          create: [
            {
              productId: sampleProduct1.id,
              productName: sampleProduct1.name,
              productImage: sampleProduct1.images[0],
              price: sampleProduct1.price,
              quantity: 1,
              subtotal: sampleProduct1.price,
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

  const finalProductCount = await prisma.product.count();
  const finalCategoryCount = await prisma.category.count();
  const finalBrandCount = await prisma.brand.count();

  console.log(`✅ MongoDB Atlas successfully seeded!`);
  console.log(`📊 Statistics:`);
  console.log(`   - Products Count: ${finalProductCount}`);
  console.log(`   - Categories Count: ${finalCategoryCount}`);
  console.log(`   - Brands Count: ${finalBrandCount}`);
  console.log(`🔑 Credentials:`);
  console.log(`   - Admin: admin@clickcart.com / Admin@123`);
  console.log(`   - Customer: customer@clickcart.com / Customer@123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
