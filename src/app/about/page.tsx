import { buildMetadata } from "@/lib/seo";
import { CTASection } from "@/components/shared/cta-section";
import { ShieldCheck, Users, MapPin, Sparkles } from "lucide-react";

export const metadata = buildMetadata({
  title: "About STYLEATLAS — Nigeria's Trusted Fashion Directory",
  description: "Learn about STYLEATLAS's mission to connect Nigerians with trusted, verified fashion designers, brands, stylists, and schools.",
  path: "/about",
});

const VALUES = [
  { icon: ShieldCheck, title: "Trust First", description: "Every listing is moderated, and professionals can earn verification badges through real document review." },
  { icon: Users, title: "Community Driven", description: "Genuine customer reviews — never fake — shape what customers see." },
  { icon: MapPin, title: "Built for Nigeria", description: "Coverage across every major Nigerian city, from Lagos to Kano to Calabar." },
  { icon: Sparkles, title: "Premium Experience", description: "An editorial, magazine-quality experience for a serious fashion industry." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">About STYLEATLAS</h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal-300">
            STYLEATLAS is Nigeria&apos;s trusted online destination for discovering, comparing, reviewing, and
            contacting fashion designers, brands, stylists, schools, and fashion-related businesses — built as a
            luxury fashion magazine, business directory, and marketplace in one platform.
          </p>
        </div>
      </section>

      <section className="section-container py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-charcoal-700">
          <p>
            Nigeria&apos;s fashion industry is one of the most vibrant and fast-growing creative economies in Africa —
            yet finding a trustworthy designer, brand, or stylist has traditionally meant relying on word of mouth,
            unreliable social media DMs, or guesswork. STYLEATLAS was built to change that.
          </p>
          <p>
            We bring together verified fashion professionals across every category — designers, bridal houses,
            stylists, tailors, fashion schools, makeup artists, and more — into one searchable, reviewable, and
            bookable directory, so customers can make confident decisions and professionals can grow real businesses.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-xl border border-charcoal-100 bg-white p-6 shadow-card">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">{value.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <CTASection
          title="Join Nigeria's fastest-growing fashion directory"
          description="Whether you're a customer looking for a trusted designer or a professional ready to grow, STYLEATLAS is built for you."
          primaryLabel="List Your Business"
          primaryHref="/register?type=professional"
          secondaryLabel="Browse the Directory"
          secondaryHref="/directory"
        />
      </section>
    </div>
  );
}
