"use client";

import * as React from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState([
    {
      id: "rev-1",
      customerName: "Emily Carter",
      productName: "Pro Wireless Noise-Cancelling Headphones",
      rating: 5,
      comment:
        "Outstanding build quality and exceeded my expectations! Arrived in New York within 2 days. Absolutely love ClickCart.",
      status: "APPROVED",
      date: "Nov 12, 2026",
    },
    {
      id: "rev-2",
      customerName: "Sophie Greenwood",
      productName: "Classic Slim-Fit Oxford Cotton Shirt",
      rating: 4,
      comment:
        "Very genuine product. Packaging was securely padded and delivery to London was fast. Will definitely buy again.",
      status: "APPROVED",
      date: "Nov 05, 2026",
    },
    {
      id: "rev-3",
      customerName: "James Whitfield",
      productName: "Digital Air Fryer XL 6L with Touch Preset",
      rating: 5,
      comment:
        "Amazing kitchen appliance! Reduced oil consumption by 90% and crispy food every time. Great value for money.",
      status: "PENDING",
      date: "Nov 20, 2026",
    },
  ]);

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r)));
    toast.success("Review approved and published to store!");
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r)));
    toast.info("Review rejected.");
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.info("Review deleted.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Reviews Moderation</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Moderate customer product reviews before they are displayed publicly.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50 text-xs">
              <div>
                <span className="font-bold text-foreground">{rev.customerName}</span>
                <span className="text-muted-foreground ml-2">reviewed</span>
                <span className="font-semibold text-indigo-600 ml-1">{rev.productName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rev.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : rev.status === "PENDING"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {rev.status}
                </span>
                <span className="text-muted-foreground">{rev.date}</span>
              </div>
            </div>

            <div className="flex items-center text-amber-500">
              {Array.from({ length: rev.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>

            <p className="text-xs text-foreground leading-relaxed">{rev.comment}</p>

            <div className="pt-2 border-t border-border flex items-center justify-end gap-2 text-xs">
              {rev.status !== "APPROVED" && (
                <Button size="sm" onClick={() => handleApprove(rev.id)} className="gap-1.5 h-8">
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </Button>
              )}
              {rev.status !== "REJECTED" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(rev.id)}
                  className="gap-1.5 h-8 text-amber-600"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </Button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 text-muted-foreground hover:text-red-600 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
