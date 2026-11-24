import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrders, createOrder } from "@/lib/db";

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productImage: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
});

const createOrderSchema = z.object({
  userId: z.string().nullable().optional(),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(8, "Phone number is required"),
  shippingAddress: z.string().min(5, "Shipping address is required"),
  paymentMethod: z.string().default("COD"),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).default("PENDING"),
  subtotal: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().default(0),
  shippingFee: z.number().nonnegative().default(0),
  totalAmount: z.number().nonnegative(),
  couponCode: z.string().nullable().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required in the order"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const orders = await getOrders(userId);
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const order = await createOrder(validated as any);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
