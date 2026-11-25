import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProducts } from "@/lib/db";
import { prisma } from "@/lib/prisma";

const productCreateSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  price: z.number().positive("Price must be a positive number"),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  region: z.enum(["USA", "UK"]).default("USA"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  images: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const region = searchParams.get("region") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const sort = (searchParams.get("sort") as any) || "newest";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 16;

    const result = await getProducts({
      search,
      category,
      brand,
      region,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validated = productCreateSchema.parse(json);

    const slug =
      validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") +
      `-${Date.now()}`;

    let createdProduct;
    try {
      const dbUrl = process.env.DATABASE_URL || "";
      if (dbUrl.length > 0 && !dbUrl.includes("placeholder") && !dbUrl.includes("localhost:5432")) {
        // Resolve categoryId if a slug or seed id was sent instead of ObjectId
        let resolvedCategoryId = validated.categoryId;
        if (!/^[0-9a-fA-F]{24}$/.test(resolvedCategoryId)) {
          const slugGuess = resolvedCategoryId.replace("cat-", "");
          const cat =
            (await prisma.category.findFirst({ where: { slug: slugGuess } })) ||
            (await prisma.category.findFirst());
          if (cat) resolvedCategoryId = cat.id;
        }

        createdProduct = await prisma.product.create({
          data: {
            ...validated,
            categoryId: resolvedCategoryId,
            slug,
            rating: 5.0,
            reviewCount: 0,
            isActive: true,
          },
          include: {
            category: true,
            brand: true,
          },
        });
      }
    } catch (dbErr: any) {
      console.error("DB create product error:", dbErr);
      return NextResponse.json(
        { error: dbErr.message || "Database error while creating product" },
        { status: 500 }
      );
    }

    if (!createdProduct) {
      createdProduct = {
        id: `prod-${Date.now()}`,
        ...validated,
        slug,
        rating: 5.0,
        reviewCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}
