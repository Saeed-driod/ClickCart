"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [orders, setOrders] = React.useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/account");
    }
  }, [status, router]);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xs text-muted-foreground">Loading account profile...</p>
      </div>
    );
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl uppercase shadow-md">
            {session.user?.name?.[0] || "U"}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-foreground">{session.user?.name}</h1>
            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Orders & Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order History */}
        <div id="orders" className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>Order History</span>
            </h3>
            <span className="text-xs text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-border bg-card text-center space-y-3">
              <Package className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <p className="text-xs text-muted-foreground">You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-indigo-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50 text-xs">
                    <div>
                      <span className="font-bold font-mono text-sm text-foreground">{ord.orderNumber}</span>
                      <span className="text-muted-foreground ml-2">• {formatDate(ord.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {ord.items?.length || 1} item(s) • Total: <strong className="text-foreground">{formatMoney(ord.totalAmount)}</strong> ({ord.paymentMethod})
                    </span>
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:gap-1.5 transition-all"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address Book & Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Saved Shipping Address</span>
            </h3>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Primary Address</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Default
                </span>
              </div>
              <p className="text-muted-foreground pt-1">{session.user?.name}</p>
              <p className="text-muted-foreground">House 24, Street 5, Sector F-8/2, Islamabad</p>
              <p className="text-muted-foreground">Pakistan (Postal: 44000)</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 text-xs">
            <h3 className="font-bold text-sm text-foreground">Customer Support</h3>
            <p className="text-muted-foreground">
              Have questions about your order or need an address change?
            </p>
            <div className="pt-1 space-y-1 font-medium">
              <p>Email: support@clickcart.com</p>
              <p>Phone: +92 300 1234567</p>
              <p>Hours: Mon - Sat (9am - 8pm PKT)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
