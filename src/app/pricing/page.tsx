import { getActivePlans } from "@/lib/data/plans";
import { buildMetadata } from "@/lib/seo";
import { PricingSection } from "@/components/pricing/pricing-section";
import { FaqSection } from "@/components/shared/faq-section";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata = buildMetadata({
  title: "Pricing Plans for Fashion Professionals | STYLEATLAS",
  description:
    "Compare STYLEATLAS plans for fashion designers, brands, and stylists — Free, Standard, Premium, and Elite. List your business and grow with leads, verification, and analytics.",
  path: "/pricing",
});

const FAQS = [
  {
    question: "Can I start on the Free plan and upgrade later?",
    answer: "Yes. Every professional starts with a free listing. You can upgrade, downgrade, or cancel anytime from your dashboard.",
  },
  {
    question: "Do you support monthly and yearly billing?",
    answer: "Yes — yearly billing is discounted compared to paying monthly, and you can switch billing cycles at renewal.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support Paystack and Flutterwave, covering cards, bank transfers, and USSD for Nigerian customers.",
  },
  {
    question: "What happens if my payment fails?",
    answer: "Your subscription enters a past-due state and you'll be notified by email to update your payment method before any features are restricted.",
  },
];

export default async function PricingPage() {
  const plans = await getActivePlans();

  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Grow Your Fashion Business</h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal-300">
            Choose the plan that fits where you are today — upgrade anytime as your business grows.
          </p>
        </div>
      </section>

      <section className="section-container py-16">
        {plans.length === 0 ? (
          <EmptyState title="Plans are being configured" description="Pricing plans will appear here once added by an administrator." />
        ) : (
          <PricingSection plans={plans} />
        )}
      </section>

      <section className="section-container pb-16">
        <FaqSection faqs={FAQS} title="Pricing FAQ" />
      </section>
    </div>
  );
}
