"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { createClient } from "@/lib/supabase/client";

function formatPrice(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN")}`;
}

const EMOJI_MAP: Record<string, string> = {
  "Malabar Black Pepper": "🌿", "Organic Black Pepper": "🌿",
  "Kashmiri Saffron": "🌸", "Organic Turmeric Powder": "🟡",
  "Kerala Cardamom": "💚", "Garam Masala": "🫙",
  "Alphonso Mangoes": "🥭", "Nagpur Oranges": "🍊",
  "Mahabaleshwar Strawberries": "🍓",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotalCents = useCartStore((s) => s.subtotalCents);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping address
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Check auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    });
  }, []);

  const subtotal = subtotalCents();

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            productName: item.productName,
            variantLabel: item.variantLabel,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName,
            phone,
            line1,
            line2: line2 || null,
            city,
            state,
            postalCode,
            country: "IN",
          },
          notes: notes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Success — clear cart and redirect
      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  // Loading state
  if (isLoggedIn === null) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="font-heading text-3xl font-bold text-bark mb-3">Sign In to Checkout</h1>
        <p className="text-bark-light mb-8">You need an account to place an order.</p>
        <a
          href="/login"
          className="inline-block bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">🛒</div>
        <h1 className="font-heading text-3xl font-bold text-bark mb-3">Your Cart is Empty</h1>
        <p className="text-bark-light mb-8">Add some products before checking out.</p>
        <a
          href="/spices"
          className="inline-block bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg"
        >
          Browse Spices
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-spice-red/10 border border-spice-red/20 text-spice-red text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark">
              <h2 className="font-heading text-xl font-bold text-bark mb-5 flex items-center gap-2">
                📍 Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-bark mb-1.5">Full Name *</label>
                  <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-bark mb-1.5">Phone Number *</label>
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="line1" className="block text-sm font-medium text-bark mb-1.5">Address Line 1 *</label>
                  <input id="line1" type="text" value={line1} onChange={(e) => setLine1(e.target.value)} required placeholder="House/Flat No., Street"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="line2" className="block text-sm font-medium text-bark mb-1.5">Address Line 2</label>
                  <input id="line2" type="text" value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Landmark, Area (Optional)"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-bark mb-1.5">City *</label>
                  <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-bark mb-1.5">State *</label>
                  <input id="state" type="text" value={state} onChange={(e) => setState(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-bark mb-1.5">PIN Code *</label>
                  <input id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required pattern="[0-9]{6}" placeholder="400001"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark">
              <h2 className="font-heading text-xl font-bold text-bark mb-5 flex items-center gap-2">
                💵 Payment Method
              </h2>
              <div className="border-2 border-forest rounded-xl p-4 bg-forest/5 flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-forest flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-forest" />
                </div>
                <div>
                  <p className="font-medium text-bark">Cash on Delivery (COD)</p>
                  <p className="text-bark-light text-sm">Pay when your order is delivered</p>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark">
              <h2 className="font-heading text-xl font-bold text-bark mb-5 flex items-center gap-2">
                📝 Order Notes <span className="text-bark-light text-sm font-normal">(Optional)</span>
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50 resize-none"
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-cream-dark sticky top-24">
              <h2 className="font-heading text-xl font-bold text-bark mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{EMOJI_MAP[item.productName] || "📦"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bark truncate">{item.productName}</p>
                      <p className="text-xs text-bark-light">{item.variantLabel} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-bark shrink-0">
                      {formatPrice(item.unitPriceCents * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-cream-dark mb-4" />

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-bark-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-bark-light">
                  <span>Shipping</span>
                  <span className="text-forest font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm text-bark-light">
                  <span>Payment</span>
                  <span>Cash on Delivery</span>
                </div>
                <hr className="border-cream-dark" />
                <div className="flex justify-between font-heading text-lg font-bold text-bark pt-1">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order…
                  </>
                ) : (
                  `Place Order — ${formatPrice(subtotal)}`
                )}
              </button>

              <p className="text-xs text-bark-light text-center mt-3">
                By placing this order, you agree to pay {formatPrice(subtotal)} at the time of delivery.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
