import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import FruitsGrid from "./FruitsGrid";

export const metadata: Metadata = {
  title: "Fresh Seasonal Fruits",
  description:
    "Order farm-fresh seasonal fruits online. Alphonso mangoes, Nagpur oranges, strawberries, and more — available only during their peak season.",
  keywords: ["seasonal fruits", "fresh fruit delivery", "Alphonso mango online", "organic fruits India"],
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface SeasonalRule {
  available_from_month: number;
  available_to_month: number;
  label: string;
}

function isInSeason(rules: SeasonalRule[]): boolean {
  if (!rules || rules.length === 0) return true; // No rules = always available
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return rules.some((rule) => {
    const from = rule.available_from_month;
    const to = rule.available_to_month;

    if (from <= to) {
      // Same-year range (e.g., Apr–Jul)
      return currentMonth >= from && currentMonth <= to;
    } else {
      // Cross-year range (e.g., Nov–Feb)
      return currentMonth >= from || currentMonth <= to;
    }
  });
}

function getSeasonalBadge(rules: SeasonalRule[]): string {
  if (!rules || rules.length === 0) return "Available";
  if (isInSeason(rules)) return "In Season";

  // Find next upcoming season
  const currentMonth = new Date().getMonth() + 1;

  let nearestStart = Infinity;
  let nearestLabel = "";
  for (const rule of rules) {
    const from = rule.available_from_month;
    const monthsAway = from > currentMonth ? from - currentMonth : 12 - currentMonth + from;
    if (monthsAway < nearestStart) {
      nearestStart = monthsAway;
      nearestLabel = MONTH_NAMES[from - 1];
    }
  }

  if (nearestStart <= 2) return `Coming in ${nearestLabel}`;
  return "Out of Season";
}

function getSeasonLabel(rules: SeasonalRule[]): string {
  if (!rules || rules.length === 0) return "";
  const rule = rules[0];
  return `${MONTH_NAMES[rule.available_from_month - 1]} – ${MONTH_NAMES[rule.available_to_month - 1]}`;
}

async function getFruits() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, name, slug, description, origin, primary_image_url, is_seasonal,
       categories!inner(name, slug, type),
       product_variants(id, label, weight_grams, price_cents, stock_quantity, sort_order),
       product_seasonal_rules(available_from_month, available_to_month, label)`
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

export default async function FruitsPage() {
  const fruits = await getFruits();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const fruitsWithBadges = fruits.map((f) => {
    const rules = (f.product_seasonal_rules || []) as SeasonalRule[];
    return {
      ...f,
      seasonalBadge: getSeasonalBadge(rules),
      seasonLabel: getSeasonLabel(rules),
      available: isInSeason(rules),
    };
  });

  const inSeason = fruitsWithBadges.filter((f) => f.available);
  const others = fruitsWithBadges.filter((f) => !f.available);

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
              : "No fruits are in season right now. Check back soon!"}
          </p>
        </div>
      </div>

      <FruitsGrid inSeason={inSeason} others={others} />
    </div>
  );
}
