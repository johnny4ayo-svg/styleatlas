import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/rbac";
import { getCategories } from "@/lib/data/categories";
import { buildMetadata } from "@/lib/seo";
import { FashionRequestForm } from "@/components/marketplace/fashion-request-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/shared/faq-section";
import { MessageSquareText, Users, CheckCircle2 } from "lucide-react";

export const metadata = buildMetadata({
  title: "Submit a Fashion Request — Get Matched with Designers | STYLEATLAS",
  description:
    "Tell us what you need — a wedding gown designer, Aso Ebi sewing for a group, or a children's outfit — and get matched with relevant Nigerian fashion professionals.",
  path: "/marketplace",
});

const STEPS = [
  { icon: MessageSquareText, title: "Describe your request", description: "Tell us your style, city, and budget." },
  { icon: Users, title: "Get matched", description: "We notify relevant verified professionals instantly." },
  { icon: CheckCircle2, title: "Compare & choose", description: "Review responses and pick the best fit." },
];

export default async function MarketplacePage() {
  const [profile, categories] = await Promise.all([getCurrentProfile(), getCategories()]);

  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Submit a Fashion Request</h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal-300">
            Can&apos;t find exactly what you need in the directory? Tell us, and let matched professionals come to you.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="section-container py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-charcoal-100 bg-white p-6 text-center shadow-card">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <step.icon className="h-5 w-5" />
              </span>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Step {i + 1}</p>
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <div className="mx-auto max-w-2xl">
          {profile ? (
            <Card>
              <CardContent className="pt-6">
                <FashionRequestForm categories={categories} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
                <p className="font-serif text-xl font-semibold text-charcoal-900">Sign in to submit a request</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Creating a free account lets us match you with professionals and keep your responses in one place.
                </p>
                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link href="/login?redirect=/marketplace">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register?redirect=/marketplace">Create Free Account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="section-container pb-16">
        <FaqSection
          faqs={[
            { question: "Is there a fee to submit a request?", answer: "No, submitting a fashion request is completely free for customers." },
            { question: "How many professionals will respond?", answer: "This varies by category and city, but most requests receive multiple responses within 24-48 hours." },
            { question: "Can I submit more than one request?", answer: "Yes, though we limit submissions to prevent spam — up to 5 requests per day." },
          ]}
        />
      </section>
    </div>
  );
}
