import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductBySlug(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    let updated;

    try {
      const dbUrl = process.env.DATABASE_URL || "";
      if (dbUrl.length > 0 && !dbUrl.includes("placeholder") && !dbUrl.includes("localhost:5432")) {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(params.id);
        const where = isMongoId ? { id: params.id } : { slug: params.id };

        // Resolve categoryId if needed
        if (json.categoryId && !/^[0-9a-fA-F]{24}$/.test(json.categoryId)) {
          const slugGuess = json.categoryId.replace("cat-", "");
          const cat = await prisma.category.findFirst({ where: { slug: slugGuess } });
          if (cat) json.categoryId = cat.id;
        }

        updated = await prisma.product.update({
          where,
          data: json,
          include: { category: true, brand: true },
        });
      }
    } catch (e: any) {
      console.error("Update product error:", e);
    }

    return NextResponse.json(updated || { id: params.id, ...json });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      const dbUrl = process.env.DATABASE_URL || "";
      if (dbUrl.length > 0 && !dbUrl.includes("placeholder") && !dbUrl.includes("localhost:5432")) {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(params.id);
        const where = isMongoId ? { id: params.id } : { slug: params.id };
        await prisma.product.delete({ where });
      }
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
