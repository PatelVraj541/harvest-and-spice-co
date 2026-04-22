import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Spices Collection",
  description:
    "Browse our curated collection of premium, hand-ground spices. Organic turmeric, Kashmiri saffron, Kerala black pepper, and more — available in 50g, 100g & 500g packs.",
  keywords: ["buy spices online", "organic spices", "Indian spices", "premium turmeric", "Kashmiri saffron"],
};

export default function SpicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-bark-light mb-8">
        <a href="/" className="hover:text-forest transition-colors">Home</a>
        <span className="mx-2">›</span>
        <span className="text-bark font-medium">Spices</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-bark mb-4">
          Premium Spices
        </h1>
        <p className="text-bark-light max-w-2xl text-lg">
          Hand-picked from the finest farms across India. Each spice is carefully
          sourced, sun-dried, and ground to preserve its natural aroma and potency.
        </p>
      </div>

      {/* Filters Bar — placeholder for Phase 4 */}
      <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-cream-dark">
        <button className="px-4 py-2 rounded-full bg-forest text-cream text-sm font-medium">
          All Spices
        </button>
        <button className="px-4 py-2 rounded-full bg-white border border-cream-dark text-bark text-sm font-medium hover:border-forest transition-colors">
          Whole Spices
        </button>
        <button className="px-4 py-2 rounded-full bg-white border border-cream-dark text-bark text-sm font-medium hover:border-forest transition-colors">
          Ground Spices
        </button>
        <button className="px-4 py-2 rounded-full bg-white border border-cream-dark text-bark text-sm font-medium hover:border-forest transition-colors">
          Spice Blends
        </button>
      </div>

      {/* Product Grid — placeholder for Phase 4 dynamic rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Product cards will be dynamically populated from Supabase */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="aspect-square bg-cream-dark flex items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
          <div className="p-5">
            <p className="text-xs text-forest font-medium mb-1 uppercase tracking-wide">Kerala</p>
            <h3 className="font-heading text-lg font-semibold text-bark mb-2 group-hover:text-forest transition-colors">
              Organic Black Pepper
            </h3>
            <p className="text-bark-light text-sm mb-3">Bold, aromatic whole peppercorns from Wayanad</p>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">50g</span>
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">100g</span>
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">500g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-forest">₹149</span>
              <button className="bg-terracotta hover:bg-terracotta-dark text-cream text-sm px-4 py-2 rounded-full transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
