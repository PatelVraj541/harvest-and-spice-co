import type { Metadata } from "next";

interface FruitDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FruitDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} — Fresh Seasonal Fruit`,
    description: `Order fresh ${name} online. Farm-fresh, naturally ripened, and delivered during peak season for maximum flavor and nutrition.`,
  };
}

export default async function FruitDetailPage({ params }: FruitDetailPageProps) {
  const { slug } = await params;
  const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-bark-light mb-8">
        <a href="/" className="hover:text-forest transition-colors">Home</a>
        <span className="mx-2">›</span>
        <a href="/fruits" className="hover:text-forest transition-colors">Seasonal Fruits</a>
        <span className="mx-2">›</span>
        <span className="text-bark font-medium">{displayName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square bg-cream-dark rounded-2xl flex items-center justify-center">
            <span className="text-8xl">🍓</span>
            <span className="absolute top-4 right-4 bg-forest text-cream text-sm font-semibold px-4 py-1.5 rounded-full">
              In Season
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-sage/20 text-forest text-xs font-semibold px-3 py-1 rounded-full">
              🌿 Seasonal • Mar–Apr
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-4">
            {displayName}
          </h1>
          <p className="text-bark-light mb-6">
            Fresh, farm-picked {displayName.toLowerCase()}. Naturally ripened and
            delivered at peak freshness during their season.
          </p>

          <div className="mb-6">
            <p className="text-sm font-medium text-bark mb-3">Select Size</p>
            <div className="flex gap-3">
              {[
                { label: "250g", price: "₹199" },
                { label: "500g", price: "₹349" },
                { label: "1 kg", price: "₹599" },
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

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-3xl font-bold text-forest">₹199</span>
          </div>

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
        </div>
      </div>
    </div>
  );
}
