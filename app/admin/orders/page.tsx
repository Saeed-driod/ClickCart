"use client";

import * as React from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  ChevronDown,
} from "lucide-react";
import { OrderType, OrderStatus } from "@/types";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<OrderType[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType | null>(null);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        if (data.length > 0 && !selectedOrder) {
          setSelectedOrder(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      toast.success(`Order marked as ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string, notes: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber, trackingNotes: notes }),
      });

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, trackingNumber, trackingNotes: notes } : o
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, trackingNumber, trackingNotes: notes });
      }
      toast.success("Tracking details updated!");
    } catch (e) {
      toast.error("Failed to update tracking");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Orders Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process, dispatch, and track customer shipments across Pakistan.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search by order #, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-xs font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Main Layout: Orders List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((o) => {
                  const isSelected = selectedOrder?.id === o.id;

                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/40" : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-foreground">
                        {o.orderNumber}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          {formatDate(o.createdAt)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-foreground block truncate max-w-[120px]">
                          {o.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate max-w-[120px]">
                          {o.customerPhone}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        {formatMoney(o.totalAmount)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(o);
                          }}
                          className="text-xs h-7"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detail Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {selectedOrder ? (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-foreground font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground"
                  title="Print Invoice"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>

              {/* Status Updater */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Update Order Status
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as OrderStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                        className={`p-2 rounded-lg font-bold text-xs transition-colors border ${
                          selectedOrder.orderStatus === st
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "border-border hover:bg-muted text-foreground"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Courier Tracking Updater */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-muted-foreground uppercase tracking-wider">
                  Courier Tracking (TCS / Leopard / CallCourier)
                </label>
                <Input
                  placeholder="Tracking Number (e.g. TCS-998822)"
                  defaultValue={selectedOrder.trackingNumber || ""}
                  onBlur={(e) =>
                    handleUpdateTracking(
                      selectedOrder.id,
                      e.target.value,
                      selectedOrder.trackingNotes || "Package in transit"
                    )
                  }
                  className="text-xs"
                />
                <Input
                  placeholder="Dispatch Notes (e.g. Dispatched from Lahore Hub)"
                  defaultValue={selectedOrder.trackingNotes || ""}
                  onBlur={(e) =>
                    handleUpdateTracking(
                      selectedOrder.id,
                      selectedOrder.trackingNumber || "TCS-12345",
                      e.target.value
                    )
                  }
                  className="text-xs"
                />
              </div>

              {/* Customer & Address */}
              <div className="p-4 rounded-xl bg-muted/40 text-xs space-y-1">
                <p className="font-bold text-foreground">{selectedOrder.customerName}</p>
                <p className="text-muted-foreground">{selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
                <p className="text-muted-foreground pt-1">{selectedOrder.shippingAddress}</p>
                <p className="font-semibold text-indigo-600 pt-1">Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-foreground block">Purchased Items</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-b border-border/40">
                      <div>
                        <span className="font-semibold text-foreground block truncate max-w-xs">{item.productName}</span>
                        <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-foreground">{formatMoney(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t border-border text-xs space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>{formatMoney(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatMoney(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-foreground pt-1">
                  <span>Total Due:</span>
                  <span className="text-indigo-600">{formatMoney(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
              Select an order from the list to view full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
