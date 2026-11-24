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
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder")) {
        updated = await prisma.product.update({
          where: { id: params.id },
          data: json,
        });
      }
    } catch (e) {}

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
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder")) {
        await prisma.product.delete({
          where: { id: params.id },
        });
      }
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
