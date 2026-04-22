import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely with Stripe.",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-bark mb-8">Checkout</h1>
      <div className="bg-white rounded-2xl p-8 border border-cream-dark text-center">
        <p className="text-bark-light mb-4">
          You will be redirected to Stripe&apos;s secure checkout to complete your payment.
        </p>
        <button className="bg-terracotta hover:bg-terracotta-dark text-cream font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-lg">
          Pay with Stripe
        </button>
      </div>
    </div>
  );
}
