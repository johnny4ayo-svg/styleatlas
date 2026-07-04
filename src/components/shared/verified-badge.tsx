import { BadgeCheck, ShieldCheck, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VerificationLevel } from "@/types";
import { cn } from "@/lib/utils";

const LABELS: Record<VerificationLevel, string | null> = {
  unverified: null,
  identity_verified: "Identity Verified",
  business_verified: "Business Verified",
  address_verified: "Address Verified",
  premium_verified: "Premium Verified",
};

export function VerifiedBadge({ level, className }: { level: VerificationLevel; className?: string }) {
  const label = LABELS[level];
  if (!label) return null;

  const Icon = level === "premium_verified" ? Crown : level === "business_verified" ? ShieldCheck : BadgeCheck;

  return (
    <Badge variant="verified" className={cn("shadow-sm", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export function PlanBadge({ plan, className }: { plan: "free" | "standard" | "premium" | "elite"; className?: string }) {
  if (plan === "free") return null;
  const variant = plan === "elite" ? "premium" : plan === "premium" ? "gold" : "outline";
  const label = plan === "elite" ? "Elite" : plan === "premium" ? "Premium" : "Standard";
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
