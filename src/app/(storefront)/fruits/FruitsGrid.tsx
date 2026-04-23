"use client";

import ProductCard, { getProductEmoji } from "@/components/product/ProductCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FruitProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin: string | null;
  is_seasonal: boolean;
  categories: { name: string; slug: string; type: string } | { name: string; slug: string; type: string }[];
  product_variants: {
    id: string;
    label: string;
    price_cents: number;
    stock_quantity: number;
    sort_order: number;
  }[];
  seasonalBadge?: string;
}

function getCategoryName(categories: FruitProduct["categories"]): string {
  if (Array.isArray(categories)) return categories[0]?.name || "";
  return categories.name;
}

export default function FruitsGrid({
  inSeason,
  others,
}: {
  inSeason: FruitProduct[];
  others: FruitProduct[];
}) {
  return (
    <>
      {/* In Season */}
      {inSeason.length > 0 && (
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-bark mb-6 flex items-center gap-2">
            🟢 Available Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inSeason.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                description={product.description}
                origin={product.origin}
                categoryName={getCategoryName(product.categories)}
                isSeasonal={product.is_seasonal}
                seasonalBadge={product.seasonalBadge}
                variants={product.product_variants}
                emoji={getProductEmoji(product.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon / Out of Season */}
      {others.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold text-bark mb-6 flex items-center gap-2">
            🕐 Coming Soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {others.map((product) => (
              <div key={product.id} className="opacity-75">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  description={product.description}
                  origin={product.origin}
                  categoryName={getCategoryName(product.categories)}
                  isSeasonal={product.is_seasonal}
                  seasonalBadge={product.seasonalBadge}
                  variants={product.product_variants}
                  emoji={getProductEmoji(product.slug)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
