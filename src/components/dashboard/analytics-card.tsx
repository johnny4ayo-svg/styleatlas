import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function AnalyticsCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
  href,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "gold" | "emerald" | "burgundy" | "charcoal";
  href?: string;
}) {
  const accentClasses: Record<string, string> = {
    gold: "bg-gold-50 text-gold-600",
    emerald: "bg-emerald-50 text-emerald-600",
    burgundy: "bg-burgundy-500/10 text-burgundy-500",
    charcoal: "bg-charcoal-100 text-charcoal-700",
  };

  const content = (
    <Card className="transition hover:shadow-elevated">
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold text-charcoal-900">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  return content;
}
