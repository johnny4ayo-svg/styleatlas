import { ShieldCheck, BadgeCheck, Star, MessageCircle, MapPinned, Gem } from "lucide-react";

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Verified fashion professionals" },
  { icon: Star, label: "Real portfolios" },
  { icon: ShieldCheck, label: "Customer reviews" },
  { icon: MessageCircle, label: "Direct contact" },
  { icon: MapPinned, label: "Nationwide discovery" },
  { icon: Gem, label: "Bridal and event fashion specialists" },
];

export function TrustSection() {
  return (
    <section className="section-container py-16 sm:py-20">
      <div className="rounded-2xl bg-charcoal-900 px-6 py-12 text-white sm:px-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Why STYLEATLAS</p>
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Trusted by Nigeria&apos;s Growing Fashion Community
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-300">
            Every professional on STYLEATLAS goes through a moderation and verification process — so you can book
            with confidence, not guesswork.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-4">
              <item.icon className="h-5 w-5 shrink-0 text-gold-500" />
              <p className="text-sm font-medium text-charcoal-100">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
