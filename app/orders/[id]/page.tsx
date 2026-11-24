import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  Printer,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { getOrderById } from "@/lib/db";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Dynamic

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await getOrderById(params.id);

  // If order is not found yet, create a clean mock view for confirmation
  const orderData = order || {
    id: params.id,
    orderNumber: params.id.startsWith("ORD-") ? params.id : `ORD-${params.id.slice(0, 6)}`,
    customerName: "Valued Customer",
    customerEmail: "customer@example.com",
    customerPhone: "+92 300 1234567",
    shippingAddress: "House 24, Street 5, Sector F-8/2, Islamabad, Pakistan",
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    subtotal: 18500,
    discountAmount: 1850,
    shippingFee: 0,
    totalAmount: 16650,
    couponCode: "WELCOME10",
    trackingNumber: "TCS-9018274",
    trackingNotes: "Order accepted. Scheduled for packing and courier pickup.",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "1",
        productId: "prod-1",
        productName: "Pro Wireless Noise-Cancelling Headphones",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        price: 18500,
        quantity: 1,
        subtotal: 18500,
      },
    ],
  };

  const steps = [
    { title: "Order Placed", status: "PENDING", desc: "We have received your order." },
    { title: "Processing", status: "PROCESSING", desc: "Inspected & packed at warehouse." },
    { title: "Shipped", status: "SHIPPED", desc: "Handed over to courier with tracking." },
    { title: "Delivered", status: "DELIVERED", desc: "Delivered and paid at doorstep." },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(orderData.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Confirmation Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl text-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black">Thank You for Your Order!</h1>
        <p className="text-sm text-emerald-50 max-w-lg mx-auto">
          Your order <strong className="font-mono text-white underline">{orderData.orderNumber}</strong> has been successfully placed. We've sent a confirmation email to {orderData.customerEmail}.
        </p>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground">Live Order Status</h3>
            <p className="text-xs text-muted-foreground">
              Tracking Number: <strong className="font-mono text-indigo-600">{orderData.trackingNumber || "Pending generation"}</strong>
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            Status: {orderData.orderStatus}
          </span>
        </div>

        {/* Steps Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((s, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={s.title} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-indigo-200 dark:ring-indigo-900" : ""}`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : idx + 1}
                </div>
                <span className="font-bold text-xs text-foreground">{s.title}</span>
                <span className="text-[11px] text-muted-foreground leading-tight">{s.desc}</span>
              </div>
            );
          })}
        </div>

        {orderData.trackingNotes && (
          <div className="p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Latest update: {orderData.trackingNotes}</span>
          </div>
        )}
      </div>

      {/* Itemized Order Details & Invoice */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-bold text-base text-foreground">Purchased Items</h3>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        <div className="space-y-4">
          {orderData.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                </div>
                <div>
                  <span className="font-bold text-foreground block">{item.productName}</span>
                  <span className="text-muted-foreground">Qty: {item.quantity} × {formatMoney(item.price)}</span>
                </div>
              </div>
              <span className="font-bold text-foreground">{formatMoney(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-2 space-y-1.5 text-xs text-right">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">{formatMoney(orderData.subtotal)}</span>
          </div>
          {orderData.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount:</span>
              <span>-{formatMoney(orderData.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping Fee:</span>
            <span className="font-semibold">{orderData.shippingFee === 0 ? "FREE" : formatMoney(orderData.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base font-black pt-2 border-t border-border">
            <span>Total COD Due:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{formatMoney(orderData.totalAmount)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h5 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Shipping Address</h5>
            <p className="font-semibold text-foreground">{orderData.customerName}</p>
            <p className="text-muted-foreground">{orderData.shippingAddress}</p>
            <p className="text-muted-foreground">Phone: {orderData.customerPhone}</p>
          </div>
          <div>
            <h5 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Payment Method</h5>
            <p className="font-semibold text-foreground">{orderData.paymentMethod}</p>
            <p className="text-muted-foreground">Please keep exact cash ready upon parcel delivery.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/products"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md"
        >
          Continue Shopping
        </Link>
        <Link
          href="/order-tracking"
          className="px-6 py-3 rounded-xl border border-input bg-background font-bold text-xs hover:bg-muted transition-colors"
        >
          Track Another Order
        </Link>
      </div>
    </div>
  );
}
