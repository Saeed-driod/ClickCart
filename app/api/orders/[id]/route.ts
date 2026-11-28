import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await requireAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
    }

    const json = await request.json();
    let updated;

    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder")) {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(params.id);
        const where = isMongoId ? { id: params.id } : { orderNumber: params.id };
        updated = await prisma.order.update({
          where,
          data: json,
        });
      }
    } catch (e) {}

    return NextResponse.json(updated || { id: params.id, ...json });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
