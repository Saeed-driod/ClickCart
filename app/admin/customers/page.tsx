"use client";

import * as React from "react";
import { Users, Search, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatMoney } from "@/lib/currency";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState([
    {
      id: "cust-1",
      name: "Ayesha Khan",
      email: "ayesha.khan@example.com",
      phone: "+92 301 5551234",
      city: "Islamabad",
      totalOrders: 4,
      totalSpend: 48500,
      isActive: true,
      registeredAt: "Oct 14, 2026",
    },
    {
      id: "cust-2",
      name: "Bilal Tariq",
      email: "bilal.t@example.com",
      phone: "+92 321 4448899",
      city: "Lahore",
      totalOrders: 6,
      totalSpend: 82000,
      isActive: true,
      registeredAt: "Sep 28, 2026",
    },
    {
      id: "cust-3",
      name: "Zainab Malik",
      email: "zainab.m@example.com",
      phone: "+92 333 1122334",
      city: "Karachi",
      totalOrders: 2,
      totalSpend: 19500,
      isActive: true,
      registeredAt: "Nov 02, 2026",
    },
    {
      id: "cust-4",
      name: "Hamza Siddiqui",
      email: "hamza.s@example.com",
      phone: "+92 345 9988776",
      city: "Rawalpindi",
      totalOrders: 1,
      totalSpend: 9500,
      isActive: false,
      registeredAt: "Nov 15, 2026",
    },
  ]);

  const [search, setSearch] = React.useState("");

  const handleToggleStatus = (id: string) => {
    setCustomers(
      customers.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.info("Customer account status updated.");
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Customer Accounts</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View registered customer activity, order history, and account moderation.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by customer name, email or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone & City</th>
                <th className="p-3">Orders Placed</th>
                <th className="p-3">Total Spend</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.email}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-foreground block">{c.phone}</span>
                    <span className="text-[10px] text-muted-foreground">{c.city}, Pakistan</span>
                  </td>
                  <td className="p-3 font-semibold text-foreground">{c.totalOrders} Orders</td>
                  <td className="p-3 font-bold text-foreground">{formatMoney(c.totalSpend)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {c.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
