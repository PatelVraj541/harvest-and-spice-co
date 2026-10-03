"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "N/A";

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Success animation */}
      <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-3">
        Order Confirmed! 🎉
      </h1>
      <p className="text-bark-light text-lg mb-2">
        Thank you for your order. We&apos;re preparing your items!
      </p>

      {/* Order Number */}
      <div className="inline-block bg-cream-dark rounded-xl px-6 py-3 mb-8">
        <p className="text-sm text-bark-light">Order Number</p>
        <p className="font-heading text-xl font-bold text-forest">{orderNumber}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl p-4 border border-cream-dark">
          <span className="text-2xl mb-2 block">💵</span>
          <p className="font-medium text-bark text-sm">Cash on Delivery</p>
          <p className="text-xs text-bark-light">Pay when delivered</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream-dark">
          <span className="text-2xl mb-2 block">📦</span>
          <p className="font-medium text-bark text-sm">Processing</p>
          <p className="text-xs text-bark-light">Ships within 24-48 hrs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream-dark">
          <span className="text-2xl mb-2 block">🚚</span>
          <p className="font-medium text-bark text-sm">Free Shipping</p>
          <p className="text-xs text-bark-light">Delivery in 3-5 days</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/orders"
          className="bg-forest hover:bg-forest-dark text-cream font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg"
        >
          View My Orders
        </a>
        <a
          href="/spices"
          className="bg-white border border-cream-dark text-bark font-semibold py-3 px-8 rounded-xl hover:border-forest transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <OrderSuccess />
    </Suspense>
  );
}
