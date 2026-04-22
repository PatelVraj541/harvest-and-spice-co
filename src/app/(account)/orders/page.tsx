import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-bark mb-6">Order History</h1>
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
        {/* Empty state */}
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
