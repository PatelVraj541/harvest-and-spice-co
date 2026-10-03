"use client";

import { useState } from "react";
import ProductCard, { getProductEmoji } from "@/components/product/ProductCard";

interface FruitProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin: string | null;
  is_seasonal: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any;
  product_variants: {
    id: string;
    label: string;
    price_cents: number;
    stock_quantity: number;
    sort_order: number;
  }[];
  seasonalBadge?: string;
  seasonLabel?: string;
  available: boolean;
}

function getCategoryName(categories: FruitProduct["categories"]): string {
  if (Array.isArray(categories)) return categories[0]?.name || "";
  return categories?.name || "";
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
            <span className="w-3 h-3 rounded-full bg-forest inline-block animate-pulse" />
            Available Now
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
            <span className="text-xl">🕐</span>
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {others.map((product) => (
              <OutOfSeasonCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function OutOfSeasonCard({ product }: { product: FruitProduct }) {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire to Supabase notifications table in Phase 4
    setNotified(true);
    setShowForm(false);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark group flex flex-col opacity-80 hover:opacity-100 transition-opacity duration-300">
      {/* Image area */}
      <div className="relative aspect-square bg-cream-dark flex items-center justify-center">
        <span className="text-6xl grayscale group-hover:grayscale-0 transition-all duration-300">
          {getProductEmoji(product.slug)}
        </span>

        {/* Badge */}
        {product.seasonalBadge && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
            product.seasonalBadge.startsWith("Coming")
              ? "bg-gold text-bark"
              : "bg-bark-light/20 text-bark"
          }`}>
            {product.seasonalBadge}
          </span>
        )}

        {/* Season label */}
        {product.seasonLabel && (
          <span className="absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-bark-light backdrop-blur-sm">
            📆 {product.seasonLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-terracotta font-medium mb-1 uppercase tracking-wide">
          {product.seasonLabel || getCategoryName(product.categories)}
        </p>
        <h3 className="font-heading text-lg font-semibold text-bark mb-1.5">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-bark-light text-sm mb-4 line-clamp-2">{product.description}</p>
        )}

        {/* Notify Me */}
        <div className="mt-auto">
          {notified ? (
            <div className="flex items-center gap-2 text-forest text-sm font-medium py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              We&apos;ll notify you!
            </div>
          ) : showForm ? (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none bg-cream/50"
              />
              <button
                type="submit"
                className="bg-forest text-cream text-sm px-3 py-2 rounded-lg font-medium hover:bg-forest-dark transition-colors shrink-0"
              >
                Notify
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-cream-dark hover:bg-sage/20 text-bark text-sm py-2.5 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              Notify Me When Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
