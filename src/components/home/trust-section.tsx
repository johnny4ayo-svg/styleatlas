import { ShieldCheck, BadgeCheck, Star, Users2 } from "lucide-react";

const STATS = [
  { icon: Users2, value: "2,500+", label: "Verified Professionals" },
  { icon: Star, value: "18,000+", label: "Genuine Customer Reviews" },
  { icon: BadgeCheck, value: "36", label: "Nigerian States Covered" },
  { icon: ShieldCheck, value: "100%", label: "Moderated Listings" },
];

export function TrustSection() {
  return (
    <section className="section-container py-16 sm:py-20">
      <div className="rounded-2xl bg-charcoal-900 px-6 py-12 text-white sm:px-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Why STYLEATLAS</p>
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Built on trust and verification</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-300">
            Every professional on STYLEATLAS goes through a moderation and verification process — so you can book
            with confidence, not guesswork.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-gold-400" />
              <p className="font-serif text-2xl font-semibold sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-charcoal-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
