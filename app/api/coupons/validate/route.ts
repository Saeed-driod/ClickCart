import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Please provide a coupon code." },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: "Coupon validation failed.", error: error.message },
      { status: 500 }
    );
  }
}
