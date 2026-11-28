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
      name: "Emily Carter",
      email: "emily.carter@example.com",
      phone: "+1 555 234 5678",
      city: "New York, NY",
      region: "USA",
      totalOrders: 4,
      totalSpend: 285.0,
      isActive: true,
      registeredAt: "Oct 14, 2026",
    },
    {
      id: "cust-2",
      name: "James Whitfield",
      email: "james.w@example.com",
      phone: "+1 555 876 4321",
      city: "Los Angeles, CA",
      region: "USA",
      totalOrders: 6,
      totalSpend: 512.5,
      isActive: true,
      registeredAt: "Sep 28, 2026",
    },
    {
      id: "cust-3",
      name: "Sophie Greenwood",
      email: "sophie.g@example.com",
      phone: "+44 7700 900234",
      city: "London",
      region: "UK",
      totalOrders: 2,
      totalSpend: 139.98,
      isActive: true,
      registeredAt: "Nov 02, 2026",
    },
    {
      id: "cust-4",
      name: "Oliver Bennett",
      email: "oliver.b@example.com",
      phone: "+44 7911 123456",
      city: "Manchester",
      region: "UK",
      totalOrders: 1,
      totalSpend: 59.99,
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
                <th className="p-3">Phone &amp; City</th>
                <th className="p-3">Region</th>
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
                    <span className="text-[10px] text-muted-foreground">{c.city}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-foreground">
                      {c.region === "USA" ? "🇺🇸 USA" : "🇬🇧 UK"}
                    </span>
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
