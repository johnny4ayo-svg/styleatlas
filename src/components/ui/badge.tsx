import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-charcoal-800 text-white",
        gold: "border-transparent bg-gold-400 text-charcoal-900",
        emerald: "border-transparent bg-emerald-50 text-emerald-600",
        burgundy: "border-transparent bg-burgundy-500/10 text-burgundy-500",
        outline: "border-charcoal-200 text-charcoal-600",
        success: "border-transparent bg-emerald-50 text-emerald-600",
        warning: "border-transparent bg-amber-50 text-amber-700",
        destructive: "border-transparent bg-red-50 text-red-600",
        verified: "border-transparent bg-emerald-500 text-white",
        premium: "border-transparent bg-gradient-to-r from-gold-400 to-gold-500 text-charcoal-900",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
