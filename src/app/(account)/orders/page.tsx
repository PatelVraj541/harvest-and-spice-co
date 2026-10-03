import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Pending", color: "bg-gold/20 text-gold-dark", icon: "⏳" },
  confirmed: { label: "Confirmed", color: "bg-forest/10 text-forest", icon: "✅" },
  processing: { label: "Processing", color: "bg-sage/20 text-bark", icon: "📦" },
  shipped: { label: "Shipped", color: "bg-terracotta/10 text-terracotta", icon: "🚚" },
  delivered: { label: "Delivered", color: "bg-forest/20 text-forest-dark", icon: "🎉" },
  cancelled: { label: "Cancelled", color: "bg-spice-red/10 text-spice-red", icon: "❌" },
};

function formatPrice(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function getOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total_cents, payment_method,
      shipping_address, created_at,
      order_items(id, product_name, variant_label, quantity, unit_price_cents, total_cents)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-bold text-bark mb-6">Order History</h1>
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="p-12 text-center">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="font-heading text-lg font-semibold text-bark mb-2">No orders yet</h3>
            <p className="text-bark-light text-sm mb-6">
              Start shopping to see your order history here.
            </p>
            <a
              href="/spices"
              className="inline-block bg-terracotta hover:bg-terracotta-dark text-cream text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Browse Spices
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-bark mb-6">
        Order History <span className="text-bark-light font-normal text-base">({orders.length})</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const address = order.shipping_address as { fullName?: string; city?: string; state?: string } | null;

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-cream/50 border-b border-cream-dark">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-bark-light">Order</p>
                    <p className="font-heading font-bold text-bark">{order.order_number}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-bark-light">{formatDate(order.created_at)}</p>
                  <p className="font-heading font-bold text-forest">{formatPrice(order.total_cents)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  {order.order_items?.map((item: {
                    id: string;
                    product_name: string;
                    variant_label: string;
                    quantity: number;
                    unit_price_cents: number;
                    total_cents: number;
                  }) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-bark">{item.product_name}</span>
                        <span className="text-bark-light ml-2">({item.variant_label} × {item.quantity})</span>
                      </div>
                      <span className="text-bark font-medium">{formatPrice(item.total_cents)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-3 bg-cream/30 border-t border-cream-dark flex flex-wrap items-center justify-between gap-2 text-xs text-bark-light">
                <span>
                  💵 Cash on Delivery
                  {address?.city && ` • 📍 ${address.city}, ${address.state}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
