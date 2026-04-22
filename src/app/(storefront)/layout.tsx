import type { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Premium Spices & Fresh Seasonal Fruits",
  description:
    "Discover hand-picked premium spices and farm-fresh seasonal fruits. Curated spice subscription boxes, organic turmeric, saffron, seasonal mangoes, and more — delivered to your doorstep.",
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <footer className="bg-bark text-cream/80 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <p className="font-heading text-lg text-cream mb-2">Harvest & Spice Co.</p>
              <p className="text-sm text-cream/60">
                Premium spices & seasonal fruits — from farm to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-sm font-semibold text-cream mb-3">Shop</p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="/spices" className="hover:text-gold transition-colors">Spices</a>
                <a href="/fruits" className="hover:text-gold transition-colors">Seasonal Fruits</a>
                <a href="/subscriptions" className="hover:text-gold transition-colors">Subscriptions</a>
              </nav>
            </div>

            {/* Account */}
            <div>
              <p className="text-sm font-semibold text-cream mb-3">Account</p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="/login" className="hover:text-gold transition-colors">Sign In</a>
                <a href="/register" className="hover:text-gold transition-colors">Create Account</a>
                <a href="/account/orders" className="hover:text-gold transition-colors">My Orders</a>
              </nav>
            </div>
          </div>

          <div className="border-t border-cream/10 pt-6 text-center">
            <p className="text-xs text-cream/40">
              © {new Date().getFullYear()} Harvest & Spice Co. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

