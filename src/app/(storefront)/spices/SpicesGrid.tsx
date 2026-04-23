"use client";

import { useState } from "react";
import ProductCard, { getProductEmoji } from "@/components/product/ProductCard";

interface SpiceProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin: string | null;
  primary_image_url: string | null;
  is_seasonal: boolean;
  categories: { name: string; slug: string; type: string } | { name: string; slug: string; type: string }[];
  product_variants: {
    id: string;
    label: string;
    price_cents: number;
    stock_quantity: number;
    sort_order: number;
  }[];
}

function getCatName(c: SpiceProduct["categories"]): string {
  return Array.isArray(c) ? c[0]?.name || "" : c.name;
}

export default function SpicesGrid({ spices }: { spices: SpiceProduct[] }) {
  const categories = ["all", ...new Set(spices.map((s) => getCatName(s.categories)))];
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? spices
      : spices.filter((s) => getCatName(s.categories) === activeFilter);

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-cream-dark">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === cat
                ? "bg-forest text-cream shadow-sm"
                : "bg-white border border-cream-dark text-bark hover:border-forest"
            }`}
          >
            {cat === "all" ? "All Spices" : cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-bark-light">
          <p className="text-lg">No spices found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              description={product.description}
              origin={product.origin}
              categoryName={getCatName(product.categories)}
              isSeasonal={product.is_seasonal}
              variants={product.product_variants}
              emoji={getProductEmoji(product.slug)}
            />
          ))}
        </div>
      )}
    </>
  );
}
