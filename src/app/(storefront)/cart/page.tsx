import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-8">
        Your Cart
      </h1>

      {/* Cart Items — will be connected to Zustand cart store */}
      <div className="space-y-4 mb-8">
        {/* Sample cart item */}
        <div className="flex items-center gap-6 bg-white rounded-xl p-4 border border-cream-dark">
          <div className="w-20 h-20 bg-cream-dark rounded-lg flex items-center justify-center shrink-0">
            <span className="text-3xl">🌿</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-bark">Organic Black Pepper</h3>
            <p className="text-bark-light text-sm">100g pack</p>
          </div>
          <div className="flex items-center border border-cream-dark rounded-lg">
            <button className="px-3 py-1 text-bark hover:text-forest transition-colors">−</button>
            <span className="px-3 py-1 font-medium text-sm">2</span>
            <button className="px-3 py-1 text-bark hover:text-forest transition-colors">+</button>
          </div>
          <span className="font-heading font-bold text-forest w-24 text-right">₹558</span>
          <button className="text-bark-light hover:text-spice-red transition-colors text-sm">
            Remove
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl p-6 border border-cream-dark">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-bark-light">
            <span>Subtotal</span>
            <span>₹558</span>
          </div>
          <div className="flex justify-between text-bark-light">
            <span>Shipping</span>
            <span className="text-forest font-medium">Free</span>
          </div>
          <hr className="border-cream-dark" />
          <div className="flex justify-between font-heading text-lg font-bold text-bark">
            <span>Total</span>
            <span>₹558</span>
          </div>
        </div>
        <a
          href="/checkout"
          className="block w-full bg-terracotta hover:bg-terracotta-dark text-cream text-center font-semibold py-3 rounded-xl transition-all hover:shadow-lg"
        >
          Proceed to Checkout
        </a>
        <a
          href="/spices"
          className="block text-center text-bark-light hover:text-forest text-sm mt-4 transition-colors"
        >
          ← Continue Shopping
        </a>
      </div>
    </div>
  );
}
