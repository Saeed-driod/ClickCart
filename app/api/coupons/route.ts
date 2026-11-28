import { NextRequest, NextResponse } from "next/server";
import { SEED_COUPONS } from "@/data/seed-data";
import { prisma } from "@/lib/prisma";
import { isDatabaseActive } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    if (isDatabaseActive()) {
      const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (coupons.length > 0) return NextResponse.json(coupons);
    }
  } catch (e) {}

  return NextResponse.json(SEED_COUPONS);
}

export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
    }

    const json = await request.json();
    let coupon;

    try {
      if (isDatabaseActive()) {
        coupon = await prisma.coupon.create({
          data: {
            code: json.code.toUpperCase(),
            discountType: json.discountType,
            discountValue: Number(json.discountValue),
            minOrderAmount: Number(json.minOrderAmount) || 0,
            expiryDate: new Date(json.expiryDate || "2028-12-31"),
            usageLimit: json.usageLimit ? Number(json.usageLimit) : null,
          },
        });
      }
    } catch (e) {}

    return NextResponse.json(coupon || { id: `coupon-${Date.now()}`, ...json }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
