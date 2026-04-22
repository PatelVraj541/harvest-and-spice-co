import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed!",
  description: "Your order has been placed successfully.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-bark-light text-lg mb-8">
        Your order has been confirmed and is being prepared with care.
        We&apos;ll send you a shipping update soon.
      </p>
      <div className="bg-white rounded-2xl p-6 border border-cream-dark mb-8">
        <p className="text-sm text-bark-light mb-1">Order Number</p>
        <p className="font-heading text-xl font-bold text-forest">ORD-XXXXXXXX</p>
      </div>
      <div className="flex gap-4 justify-center">
        <a
          href="/account/orders"
          className="bg-forest hover:bg-forest-dark text-cream px-6 py-3 rounded-xl font-medium transition-colors"
        >
          View Orders
        </a>
        <a
          href="/"
          className="border border-cream-dark hover:border-forest text-bark px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
