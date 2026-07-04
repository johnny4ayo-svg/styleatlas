import { Search, MessageCircle, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    description: "Search verified designers, brands, stylists, and schools by city, category, or budget.",
  },
  {
    icon: MessageCircle,
    title: "Connect",
    description: "Message on WhatsApp, request a quote, or submit a fashion request and let professionals come to you.",
  },
  {
    icon: CheckCircle2,
    title: "Book with confidence",
    description: "Compare verified reviews, portfolios, and pricing before you commit — no surprises.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">How It Works</p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            From discovery to booking, in three steps
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-charcoal-100 bg-white p-8 text-center shadow-card transition-shadow duration-300 hover:shadow-elevated"
            >
              <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal-900 text-sm font-semibold text-gold-400">
                {i + 1}
              </span>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
