export interface SeasonalRule {
  id: string;
  product_id: string;
  available_from_month: number;
  available_to_month: number;
  available_from_day?: number | null;
  available_to_day?: number | null;
  label: string;
  is_active: boolean;
}

export type SeasonalStatus = "in-season" | "coming-soon" | "last-days" | null;

/**
 * Check if a product is available based on its seasonal rules.
 * If a product has no rules, it's always available.
 * Client-side mirror of the PostgreSQL is_product_available() function.
 */
export function isProductAvailable(
  rules: SeasonalRule[],
  checkDate: Date = new Date()
): boolean {
  const activeRules = rules.filter((r) => r.is_active);

  // No rules = always available
  if (activeRules.length === 0) return true;

  const month = checkDate.getMonth() + 1; // JS months are 0-indexed
  const day = checkDate.getDate();

  return activeRules.some((rule) => {
    const matchesMonth =
      rule.available_from_month <= rule.available_to_month
        ? // Same-year range (e.g., Mar-Jun)
          month >= rule.available_from_month &&
          month <= rule.available_to_month
        : // Cross-year range (e.g., Nov-Feb)
          month >= rule.available_from_month ||
          month <= rule.available_to_month;

    if (!matchesMonth) return false;

    // Optional day-level checks
    if (rule.available_from_day && day < rule.available_from_day) return false;
    if (rule.available_to_day && day > rule.available_to_day) return false;

    return true;
  });
}

/**
 * Get the seasonal status for display badging.
 */
export function getSeasonalStatus(
  rules: SeasonalRule[],
  checkDate: Date = new Date()
): SeasonalStatus {
  const activeRules = rules.filter((r) => r.is_active);

  // Non-seasonal products don't get a badge
  if (activeRules.length === 0) return null;

  const month = checkDate.getMonth() + 1;
  const day = checkDate.getDate();

  for (const rule of activeRules) {
    const isAvailable = isProductAvailable([rule], checkDate);

    if (isAvailable) {
      // Check if we're in the last 15 days of the season
      if (
        month === rule.available_to_month &&
        (!rule.available_to_day || rule.available_to_day - day <= 15)
      ) {
        return "last-days";
      }
      return "in-season";
    }

    // Check if coming soon (within 30 days of start)
    const nextMonth = month === 12 ? 1 : month + 1;
    if (
      rule.available_from_month === nextMonth ||
      (rule.available_from_month === month &&
        rule.available_from_day &&
        rule.available_from_day > day &&
        rule.available_from_day - day <= 30)
    ) {
      return "coming-soon";
    }
  }

  return null;
}

/**
 * Get a human-readable label for the seasonal window.
 */
export function getSeasonLabel(rule: SeasonalRule): string {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const from = monthNames[rule.available_from_month - 1];
  const to = monthNames[rule.available_to_month - 1];

  if (rule.available_from_month === rule.available_to_month) {
    return from;
  }

  return `${from}–${to}`;
}
