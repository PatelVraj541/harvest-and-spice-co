import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import FruitsGrid from "./FruitsGrid";

export const metadata: Metadata = {
  title: "Fresh Seasonal Fruits",
  description:
    "Order farm-fresh seasonal fruits online. Alphonso mangoes, Nagpur oranges, strawberries, and more — available only during their peak season.",
  keywords: ["seasonal fruits", "fresh fruit delivery", "Alphonso mango online", "organic fruits India"],
};

async function getFruits() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, name, slug, description, origin, primary_image_url, is_seasonal,
       categories!inner(name, slug, type),
       product_variants(id, label, weight_grams, price_cents, stock_quantity, sort_order),
       product_seasonal_rules(available_from, available_to)`
    )
    .eq("is_active", true)
    .eq("categories.type", "fruit")
    .order("name");

  if (error) {
    console.error("Error fetching fruits:", error);
    return [];
  }

  return data || [];
}

function getSeasonalBadge(rules: { available_from: string; available_to: string }[]): string | undefined {
  if (!rules || rules.length === 0) return undefined;

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12

  for (const rule of rules) {
    const fromMonth = new Date(rule.available_from).getMonth() + 1;
    const toMonth = new Date(rule.available_to).getMonth() + 1;

    if (currentMonth >= fromMonth && currentMonth <= toMonth) {
      return "In Season";
    }
  }

  // Find next upcoming season
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (const rule of rules) {
    const fromMonth = new Date(rule.available_from).getMonth();
    if (fromMonth > now.getMonth()) {
      return `Coming in ${months[fromMonth]}`;
    }
  }

  return "Out of Season";
}

export default async function FruitsPage() {
  const fruits = await getFruits();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Separate in-season and out-of-season
  const fruitsWithBadges = fruits.map((f) => ({
    ...f,
    seasonalBadge: getSeasonalBadge(f.product_seasonal_rules || []),
  }));

  const inSeason = fruitsWithBadges.filter((f) => f.seasonalBadge === "In Season");
  const others = fruitsWithBadges.filter((f) => f.seasonalBadge !== "In Season");

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
          We believe in selling fruits at their peak — when they&apos;re naturally ripe,
          bursting with flavor, and at their nutritional best.
        </p>
      </div>

      {/* Season Indicator */}
      <div className="bg-sage/10 border border-sage/30 rounded-2xl p-6 mb-10 flex items-center gap-4">
        <span className="text-3xl">📅</span>
        <div>
          <p className="font-heading font-semibold text-bark">
            Currently in Season — {currentMonth}
          </p>
          <p className="text-bark-light text-sm">
            {inSeason.length > 0
              ? `${inSeason.map((f) => f.name).join(", ")} ${inSeason.length === 1 ? "is" : "are"} at peak freshness right now.`
              : "Check back soon for seasonal availability updates."}
          </p>
        </div>
      </div>

      <FruitsGrid inSeason={inSeason} others={others} />
    </div>
  );
}
