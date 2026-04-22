import type { Metadata } from "next";

interface SpiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return []; // Will be populated with real slugs in Phase 4
}

export async function generateMetadata({ params }: SpiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} — Premium Spice`,
    description: `Buy ${name} online. Premium quality, organic, hand-picked — available in 50g, 100g & 500g packs. Shipped fresh from farm to doorstep.`,
  };
}

export default async function SpiceDetailPage({ params }: SpiceDetailPageProps) {
  const { slug } = await params;
  const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-bark-light mb-8">
        <a href="/" className="hover:text-forest transition-colors">Home</a>
        <span className="mx-2">›</span>
        <a href="/spices" className="hover:text-forest transition-colors">Spices</a>
        <span className="mx-2">›</span>
        <span className="text-bark font-medium">{displayName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery — placeholder */}
        <div className="space-y-4">
          <div className="aspect-square bg-cream-dark rounded-2xl flex items-center justify-center">
            <span className="text-8xl">🌿</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-cream-dark rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-forest text-sm font-medium uppercase tracking-wide mb-2">Premium Spice</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-4">
            {displayName}
          </h1>
          <p className="text-bark-light mb-6">
            Premium quality {displayName.toLowerCase()}, sourced directly from trusted farmers.
            Hand-picked and carefully processed to preserve natural aroma and flavor.
          </p>

          {/* Variant Selector — placeholder for VariantSelector component */}
          <div className="mb-6">
            <p className="text-sm font-medium text-bark mb-3">Select Weight</p>
            <div className="flex gap-3">
              {[
                { label: "50g", price: "₹149" },
                { label: "100g", price: "₹279" },
                { label: "500g", price: "₹1,199" },
              ].map((v) => (
                <button
                  key={v.label}
                  className="px-5 py-3 rounded-xl border-2 border-cream-dark hover:border-forest text-sm font-medium transition-colors flex flex-col items-center"
                >
                  <span className="text-bark font-semibold">{v.label}</span>
                  <span className="text-forest text-xs mt-0.5">{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-3xl font-bold text-forest">₹149</span>
            <span className="text-bark-light line-through text-lg">₹199</span>
            <span className="bg-terracotta/10 text-terracotta text-xs font-semibold px-2 py-1 rounded-full">
              25% OFF
            </span>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-cream-dark rounded-xl">
              <button className="px-4 py-3 text-bark hover:text-forest transition-colors">−</button>
              <span className="px-4 py-3 font-medium">1</span>
              <button className="px-4 py-3 text-bark hover:text-forest transition-colors">+</button>
            </div>
            <button className="flex-1 bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 rounded-xl transition-all hover:shadow-lg">
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-cream-dark">
            {[
              { icon: "🌱", label: "100% Organic" },
              { icon: "📦", label: "Fresh Packaging" },
              { icon: "🚚", label: "Free Delivery 500g+" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-bark-light">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
