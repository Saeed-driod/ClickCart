import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { isDatabaseActive } from "@/lib/db";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/data/seed-data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recentAnchorMs = Date.UTC(2026, 10, 27, 12, 0, 0);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(recentAnchorMs),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(recentAnchorMs),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/order-tracking`,
      lastModified: new Date(recentAnchorMs - 86400000 * 3),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    if (isDatabaseActive()) {
      const [dbCategories, dbProducts] = await Promise.all([
        prisma.category.findMany({
          where: { isActive: true },
          select: { slug: true, updatedAt: true },
        }),
        prisma.product.findMany({
          where: { isActive: true },
          select: { slug: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

      if (dbCategories.length > 0) {
        categoryRoutes = dbCategories.map((c) => ({
          url: `${SITE_URL}/category/${c.slug}`,
          lastModified: c.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }

      if (dbProducts.length > 0) {
        productRoutes = dbProducts.map((p) => ({
          url: `${SITE_URL}/products/${p.slug}`,
          lastModified: p.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    }
  } catch (e) {
    // Fallback below if DB is unreachable
  }

  if (categoryRoutes.length === 0) {
    categoryRoutes = SEED_CATEGORIES.map((c, idx) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: new Date(recentAnchorMs - (idx + 1) * 86400000),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  if (productRoutes.length === 0) {
    productRoutes = SEED_PRODUCTS.map((p, idx) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(recentAnchorMs - idx * 3600000),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
