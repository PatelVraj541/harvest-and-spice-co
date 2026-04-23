"use client";

import { useCartStore } from "@/stores/cart-store";

function formatPrice(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN")}`;
}

const EMOJI_MAP: Record<string, string> = {
  "Malabar Black Pepper": "🌿",
  "Kashmiri Saffron": "🌸",
  "Organic Turmeric Powder": "🟡",
  "Kerala Cardamom": "💚",
  "Garam Masala": "🫙",
  "Alphonso Mangoes": "🥭",
  "Nagpur Oranges": "🍊",
  "Mahabaleshwar Strawberries": "🍓",
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const subtotalCents = useCartStore((s) => s.subtotalCents);

  const subtotal = subtotalCents();
  const total = subtotal; // Free shipping

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-heading text-3xl font-bold text-bark mb-3">Your Cart is Empty</h1>
        <p className="text-bark-light mb-8">
          Looks like you haven&apos;t added anything yet. Explore our collection!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/spices"
            className="bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg"
          >
            Browse Spices
          </a>
          <a
            href="/fruits"
            className="bg-white border border-cream-dark text-bark font-semibold py-3 px-8 rounded-xl hover:border-forest transition-colors"
          >
            Seasonal Fruits
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark">
          Your Cart <span className="text-bark-light font-normal text-lg">({totalItems()} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-bark-light hover:text-spice-red transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center gap-4 md:gap-6 bg-white rounded-xl p-4 border border-cream-dark hover:shadow-sm transition-shadow"
          >
            {/* Emoji / Image */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-cream-dark rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl md:text-3xl">
                {EMOJI_MAP[item.productName] || "📦"}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-bark text-sm md:text-base">{item.productName}</h3>
              <p className="text-bark-light text-xs md:text-sm">{item.variantLabel}</p>
              <p className="text-forest font-medium text-sm mt-0.5 md:hidden">
                {formatPrice(item.unitPriceCents * item.quantity)}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center border border-cream-dark rounded-lg">
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                className="px-2.5 py-1.5 text-bark hover:text-forest transition-colors text-sm"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-2.5 py-1.5 font-medium text-sm min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                className="px-2.5 py-1.5 text-bark hover:text-forest transition-colors text-sm"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Price (desktop) */}
            <span className="hidden md:block font-heading font-bold text-forest w-24 text-right">
              {formatPrice(item.unitPriceCents * item.quantity)}
            </span>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.variantId)}
              className="text-bark-light hover:text-spice-red transition-colors p-1"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl p-6 border border-cream-dark">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-bark-light">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-bark-light">
            <span>Shipping</span>
            <span className="text-forest font-medium">Free</span>
          </div>
          <hr className="border-cream-dark" />
          <div className="flex justify-between font-heading text-lg font-bold text-bark">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
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
