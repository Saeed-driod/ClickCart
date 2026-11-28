"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Package, Check, Clock, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/currency";

export default function OrderTrackingPage() {
  const [searchNumber, setSearchNumber] = React.useState("");
  const [order, setOrder] = React.useState<any | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;

    setIsLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchNumber.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        // Fallback demo lookup if order is one of the seed orders
        if (searchNumber.includes("98241")) {
          setOrder({
            orderNumber: "ORD-98241",
            customerName: "Ayesha Khan",
            orderStatus: "PROCESSING",
            totalAmount: 16650,
            trackingNumber: "TCS-9921448",
            trackingNotes: "Dispatched from Islamabad Fulfillment Center.",
            shippingAddress: "House 14, Street 9, Sector F-7/2, Islamabad",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          });
        } else if (searchNumber.includes("98242")) {
          setOrder({
            orderNumber: "ORD-98242",
            customerName: "Bilal Tariq",
            orderStatus: "DELIVERED",
            totalAmount: 34500,
            trackingNumber: "TCS-9921449",
            trackingNotes: "Delivered and signed by recipient.",
            shippingAddress: "Flat 402, Al-Latif Heights, Gulberg III, Lahore",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          });
        } else {
          setOrder(null);
        }
      }
    } catch (e) {
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-foreground">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Enter your Order Number (e.g. <strong>ORD-98241</strong>) or Tracking Number to check the live delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <Input
          placeholder="Enter Order ID (e.g. ORD-98241)"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          className="text-sm h-11"
        />
        <Button type="submit" size="lg" isLoading={isLoading} className="gap-2">
          <Search className="h-4 w-4" />
          <span>Track</span>
        </Button>
      </form>

      {/* Demo helper */}
      <div className="text-center text-xs text-muted-foreground">
        <span>Try demo order IDs: </span>
        <button
          type="button"
          onClick={() => setSearchNumber("ORD-98241")}
          className="font-mono text-indigo-600 hover:underline mx-1"
        >
          ORD-98241
        </button>
        <span> or </span>
        <button
          type="button"
          onClick={() => setSearchNumber("ORD-98242")}
          className="font-mono text-indigo-600 hover:underline mx-1"
        >
          ORD-98242
        </button>
      </div>

      {/* Tracking Result */}
      {searched && (
        <div className="pt-4">
          {order ? (
            <div className="p-6 rounded-2xl border border-border bg-card space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Order Found
                  </span>
                  <h3 className="text-xl font-bold font-mono text-foreground">{order.orderNumber}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 self-start sm:self-auto">
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <p className="font-semibold text-foreground">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total COD Amount:</span>
                  <p className="font-semibold text-indigo-600">{formatMoney(order.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <p className="font-semibold font-mono text-foreground">{order.trackingNumber || "Pending"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Latest Update:</span>
                  <p className="font-semibold text-foreground">{order.trackingNotes || "Package in transit"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:gap-2 transition-all"
                >
                  <span>View Full Order Details & Invoice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-base text-foreground">Order Not Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                We could not locate any order with ID &ldquo;{searchNumber}&rdquo;. Please verify the number and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
