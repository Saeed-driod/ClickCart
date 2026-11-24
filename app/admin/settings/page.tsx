"use client";

import * as React from "react";
import { Settings, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = React.useState("ClickCart");
  const [storeEmail, setStoreEmail] = React.useState("support@clickcart.com");
  const [storePhone, setStorePhone] = React.useState("+92 300 1234567");
  const [address, setAddress] = React.useState("ClickCart HQ, Blue Area, Islamabad, Pakistan");
  const [shippingFee, setShippingFee] = React.useState("200");
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState("3000");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Store configuration and shipping thresholds saved!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Store Configuration</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          General store parameters, contact numbers, and delivery policies.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-muted-foreground mb-1">
              Store Brand Name
            </label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Customer Support Email
              </label>
              <Input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Helpline Phone
              </label>
              <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">
              HQ Office Address
            </label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Standard Shipping Fee (₨)
              </label>
              <Input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Free Shipping Threshold (₨)
              </label>
              <Input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
