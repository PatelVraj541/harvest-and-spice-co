import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Seasonal Fruits",
  description:
    "Order farm-fresh seasonal fruits online. Alphonso mangoes, Nagpur oranges, Shimla apples, and more — available only during their peak season for maximum freshness.",
  keywords: ["seasonal fruits", "fresh fruit delivery", "Alphonso mango online", "organic fruits India"],
};

export default function FruitsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-bark-light mb-8">
        <a href="/" className="hover:text-forest transition-colors">Home</a>
        <span className="mx-2">›</span>
        <span className="text-bark font-medium">Seasonal Fruits</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-bark mb-4">
          Seasonal Fruits
        </h1>
        <p className="text-bark-light max-w-2xl text-lg">
          We believe in selling fruits at their peak — when they're naturally ripe,
          bursting with flavor, and at their nutritional best. Availability changes
          with the season.
        </p>
      </div>

      {/* Season Indicator */}
      <div className="bg-sage/10 border border-sage/30 rounded-2xl p-6 mb-10 flex items-center gap-4">
        <span className="text-3xl">📅</span>
        <div>
          <p className="font-heading font-semibold text-bark">Currently in Season — March</p>
          <p className="text-bark-light text-sm">Strawberries, sweet limes, and pomegranates are at their peak right now.</p>
        </div>
      </div>

      {/* Product Grid — placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Sample seasonal product card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="relative aspect-square bg-cream-dark flex items-center justify-center">
            <span className="text-6xl">🍓</span>
            {/* Seasonal Badge */}
            <span className="absolute top-3 right-3 bg-forest text-cream text-xs font-semibold px-3 py-1 rounded-full">
              In Season
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs text-terracotta font-medium mb-1 uppercase tracking-wide">
              Mar – Apr
            </p>
            <h3 className="font-heading text-lg font-semibold text-bark mb-2 group-hover:text-forest transition-colors">
              Mahabaleshwar Strawberries
            </h3>
            <p className="text-bark-light text-sm mb-3">Sweet, juicy strawberries fresh from the hills</p>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">250g</span>
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">500g</span>
              <span className="px-2 py-1 text-xs rounded-full bg-cream-dark text-bark">1 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-forest">₹199</span>
              <button className="bg-terracotta hover:bg-terracotta-dark text-cream text-sm px-4 py-2 rounded-full transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Coming soon card example */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark opacity-75 group">
          <div className="relative aspect-square bg-cream-dark flex items-center justify-center">
            <span className="text-6xl">🥭</span>
            <span className="absolute top-3 right-3 bg-gold text-bark text-xs font-semibold px-3 py-1 rounded-full">
              Coming in April
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs text-gold-dark font-medium mb-1 uppercase tracking-wide">
              Apr – Jul
            </p>
            <h3 className="font-heading text-lg font-semibold text-bark mb-2">
              Alphonso Mangoes
            </h3>
            <p className="text-bark-light text-sm mb-3">The king of mangoes — Ratnagiri Alphonso</p>
            <button className="w-full bg-cream-dark text-bark-light text-sm py-2 rounded-full font-medium cursor-not-allowed">
              Notify Me When Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
