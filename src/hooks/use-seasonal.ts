"use client";

import { useMemo } from "react";
import {
  isProductAvailable,
  getSeasonalStatus,
  getSeasonLabel,
  type SeasonalRule,
} from "@/lib/utils/seasonal";

export function useSeasonal(rules: SeasonalRule[]) {
  const now = useMemo(() => new Date(), []);

  const available = useMemo(
    () => isProductAvailable(rules, now),
    [rules, now]
  );

  const status = useMemo(
    () => getSeasonalStatus(rules, now),
    [rules, now]
  );

  const seasonLabel = useMemo(() => {
    const activeRule = rules.find((r) => r.is_active);
    return activeRule ? getSeasonLabel(activeRule) : null;
  }, [rules]);

  return {
    isAvailable: available,
    status,
    seasonLabel,
    isSeasonal: rules.length > 0,
  };
}
