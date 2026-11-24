"use client";

import * as React from "react";
import { Tag, Plus, Trash2, X } from "lucide-react";
import { SEED_COUPONS } from "@/data/seed-data";
import { CouponItem } from "@/types";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<any[]>(SEED_COUPONS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Form
  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = React.useState("10");
  const [minOrderAmount, setMinOrderAmount] = React.useState("2000");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon = {
      id: `coupon-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      expiryDate: new Date("2028-12-31"),
      usageLimit: 500,
      usedCount: 0,
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    toast.success(`Coupon ${newCoupon.code} created!`);
    setIsModalOpen(false);
    setCode("");
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast.info("Coupon deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Discount Coupons</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create promotional discount codes (percentage or flat PKR amount).
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Create New Coupon</span>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-sm text-foreground block">{c.code}</span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% Off` : formatMoney(c.discountValue)}
                  </td>
                  <td className="p-3 text-muted-foreground">{formatMoney(c.minOrderAmount)}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.usedCount} / {c.usageLimit || "∞"} used
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Coupon Code (Uppercase) *
                </label>
                <Input
                  required
                  placeholder="e.g. MEGA30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat PKR (₨)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Discount Value *
                  </label>
                  <Input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Minimum Order Amount (₨)
                </label>
                <Input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
