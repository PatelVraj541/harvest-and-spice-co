"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

interface Variant {
  id: string;
  label: string;
  price_cents: number;
  stock_quantity: number;
  sort_order: number;
}

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin: string | null;
  categoryName: string;
  isSeasonal: boolean;
  seasonalBadge?: string;
  variants: Variant[];
  emoji: string;
}

const EMOJI_MAP: Record<string, string> = {
  "malabar-black-pepper": "🌿",
  "kashmiri-saffron": "🌸",
  "organic-turmeric": "🟡",
  "kerala-cardamom": "💚",
  "garam-masala": "🫙",
  "alphonso-mangoes": "🥭",
  "nagpur-oranges": "🍊",
  "mahabaleshwar-strawberries": "🍓",
};

export function getProductEmoji(slug: string): string {
  return EMOJI_MAP[slug] || "🌿";
}

function formatPrice(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN")}`;
}

export default function ProductCard({
  id,
  name,
  slug,
  description,
  origin,
  categoryName,
  isSeasonal,
  seasonalBadge,
  variants,
  emoji,
}: ProductCardProps) {
  const sortedVariants = [...variants].sort((a, b) => a.sort_order - b.sort_order);
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    addItem({
      variantId: selectedVariant.id,
      productId: id,
      productName: name,
      variantLabel: selectedVariant.label,
      unitPriceCents: selectedVariant.price_cents,
      imageUrl: null,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const isOutOfStock = selectedVariant.stock_quantity <= 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col">
      {/* Image area */}
      <div className="relative aspect-square bg-cream-dark flex items-center justify-center">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>

        {/* Seasonal badge */}
        {isSeasonal && seasonalBadge && (
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
              seasonalBadge === "In Season"
                ? "bg-forest text-cream"
                : "bg-gold text-bark"
            }`}
          >
            {seasonalBadge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-forest font-medium mb-1 uppercase tracking-wide">
          {origin || categoryName}
        </p>
        <h3 className="font-heading text-lg font-semibold text-bark mb-1.5 group-hover:text-forest transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-bark-light text-sm mb-3 line-clamp-2">{description}</p>
        )}

        {/* Variant selector */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {sortedVariants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all duration-200 ${
                selectedVariant.id === v.id
                  ? "bg-forest text-cream shadow-sm"
                  : "bg-cream-dark text-bark hover:bg-forest/10"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-forest">
            {formatPrice(selectedVariant.price_cents)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 ${
              added
                ? "bg-forest text-cream"
                : isOutOfStock
                  ? "bg-cream-dark text-bark-light cursor-not-allowed"
                  : "bg-terracotta hover:bg-terracotta-dark text-cream hover:shadow-md active:scale-95"
            }`}
          >
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added!
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
