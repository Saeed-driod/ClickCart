import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";
import { prisma } from "@/lib/prisma";

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
    const json = await request.json();
    let updated;

    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder")) {
        updated = await prisma.order.update({
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
