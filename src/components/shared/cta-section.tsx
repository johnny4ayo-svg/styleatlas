import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "dark" | "gold";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12",
        variant === "dark" ? "bg-charcoal-900 text-white" : "bg-gradient-to-br from-gold-400 to-gold-500 text-charcoal-900",
        className
      )}
    >
      <div className="relative mx-auto max-w-2xl">
        {eyebrow && (
          <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[0.2em]", variant === "dark" ? "text-gold-400" : "text-charcoal-700")}>
            {eyebrow}
          </p>
        )}
        <h2 className="text-balance font-serif text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className={cn("mt-4 text-balance", variant === "dark" ? "text-charcoal-200" : "text-charcoal-800")}>
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant={variant === "dark" ? "default" : "secondary"}>
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button asChild size="lg" variant="outline" className={variant === "gold" ? "border-charcoal-900/20 text-charcoal-900" : "border-white/20 text-white hover:bg-white/10"}>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
