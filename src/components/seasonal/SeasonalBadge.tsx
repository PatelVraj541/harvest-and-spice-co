import { cn } from "@/lib/utils/format";
import type { SeasonalStatus } from "@/lib/utils/seasonal";

interface SeasonalBadgeProps {
  status: SeasonalStatus;
  seasonLabel?: string | null;
  className?: string;
}

const badgeConfig: Record<
  NonNullable<SeasonalStatus>,
  { bg: string; text: string; label: string; icon: string }
> = {
  "in-season": {
    bg: "bg-forest",
    text: "text-cream",
    label: "In Season",
    icon: "🌿",
  },
  "last-days": {
    bg: "bg-terracotta",
    text: "text-cream",
    label: "Last Days",
    icon: "⏳",
  },
  "coming-soon": {
    bg: "bg-gold",
    text: "text-bark",
    label: "Coming Soon",
    icon: "📅",
  },
};

export function SeasonalBadge({ status, seasonLabel, className }: SeasonalBadgeProps) {
  if (!status) return null;

  const config = badgeConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
      {seasonLabel && (
        <span className="opacity-75 ml-1">• {seasonLabel}</span>
      )}
    </span>
  );
}
