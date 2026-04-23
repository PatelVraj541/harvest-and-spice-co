import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import SpicesGrid from "./SpicesGrid";

export const metadata: Metadata = {
  title: "Premium Spices Collection",
  description:
    "Browse our curated collection of premium, hand-ground spices. Organic turmeric, Kashmiri saffron, Kerala black pepper, and more — available in multiple sizes.",
  keywords: ["buy spices online", "organic spices", "Indian spices", "premium turmeric", "Kashmiri saffron"],
};

async function getSpices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, name, slug, description, origin, primary_image_url, is_seasonal,
       categories!inner(name, slug, type),
       product_variants(id, label, weight_grams, price_cents, stock_quantity, sort_order)`
    )
    .eq("is_active", true)
    .eq("categories.type", "spice")
    .order("name");

  if (error) {
    console.error("Error fetching spices:", error);
    return [];
  }

  return data || [];
}

export default async function SpicesPage() {
  const spices = await getSpices();

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

      <SpicesGrid spices={spices} />
    </div>
  );
}
