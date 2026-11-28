import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getOrders,
  createOrder,
  getProductBySlug,
  validateCoupon,
} from "@/lib/db";
import { calculateShippingFee } from "@/lib/shipping";

const orderItemSchema = z.object({
  productId: z.string().min(1),
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

    // Re-fetch every product from DB/seed and recompute pricing server-side
    const verifiedItems = [];
    for (const item of validated.items) {
      const product = await getProductBySlug(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product unavailable or not found: ${item.productName}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const authoritativePrice = Number((product.salePrice ?? product.price).toFixed(2));
      if (Math.abs(item.price - authoritativePrice) > 0.01) {
        return NextResponse.json(
          { error: `Price mismatch for ${product.name}. Please refresh your cart.` },
          { status: 400 }
        );
      }

      const authoritativeSubtotal = Number((authoritativePrice * item.quantity).toFixed(2));
      if (Math.abs(item.subtotal - authoritativeSubtotal) > 0.02) {
        return NextResponse.json(
          { error: `Item subtotal mismatch for ${product.name}` },
          { status: 400 }
        );
      }

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || item.productImage,
        price: authoritativePrice,
        quantity: item.quantity,
        subtotal: authoritativeSubtotal,
      });
    }

    const serverSubtotal = Number(
      verifiedItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
    );

    if (Math.abs(validated.subtotal - serverSubtotal) > 0.05) {
      return NextResponse.json(
        { error: "Order subtotal mismatch. Please review your cart." },
        { status: 400 }
      );
    }

    // Validate coupon server-side
    let serverDiscount = 0;
    let verifiedCouponCode: string | null = null;
    if (validated.couponCode && validated.couponCode.trim().length > 0) {
      const couponResult = await validateCoupon(validated.couponCode, serverSubtotal);
      if (!couponResult.valid) {
        return NextResponse.json(
          { error: couponResult.message || "Invalid coupon code" },
          { status: 400 }
        );
      }
      serverDiscount = Number(couponResult.discount.toFixed(2));
      verifiedCouponCode = couponResult.coupon?.code || validated.couponCode.trim().toUpperCase();
    }

    if (Math.abs(validated.discountAmount - serverDiscount) > 0.05) {
      return NextResponse.json(
        { error: "Discount mismatch detected. Please re-apply your coupon." },
        { status: 400 }
      );
    }

    const serverShippingFee = calculateShippingFee(serverSubtotal, verifiedItems.length > 0);
    if (Math.abs(validated.shippingFee - serverShippingFee) > 0.01) {
      return NextResponse.json(
        { error: "Shipping fee mismatch detected. Please refresh checkout." },
        { status: 400 }
      );
    }

    const serverTotalAmount = Number(
      Math.max(0, serverSubtotal - serverDiscount + serverShippingFee).toFixed(2)
    );
    if (Math.abs(validated.totalAmount - serverTotalAmount) > 0.05) {
      return NextResponse.json(
        { error: "Order total mismatch detected. Please refresh checkout." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      ...validated,
      subtotal: serverSubtotal,
      discountAmount: serverDiscount,
      shippingFee: serverShippingFee,
      totalAmount: serverTotalAmount,
      couponCode: verifiedCouponCode,
      items: verifiedItems as any,
    });

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
