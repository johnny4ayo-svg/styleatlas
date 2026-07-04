import { buildMetadata } from "@/lib/seo";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Review Guidelines",
  description: "How reviews work on STYLEATLAS, and what makes a review genuine and useful.",
  path: "/review-guidelines",
});

const DO = [
  "Only review professionals you've actually interacted with",
  "Be specific about the service, timeline, and outcome",
  "Upload real photos of the finished work, if available",
  "Rate communication, quality, delivery, and value honestly",
];

const DONT = [
  "Leave a review for a service you never received",
  "Accept payment or discounts in exchange for a review",
  "Use offensive language or make unverifiable legal claims",
  "Post the same review across multiple professionals",
];

export default function ReviewGuidelinesPage() {
  return (
    <div className="section-container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Review Guidelines</h1>
        <p className="mt-4 text-muted-foreground">
          Trust is the foundation of STYLEATLAS. Reviews can only be submitted by customers who completed an
          interaction with a professional, and every review is moderated before it becomes public. This keeps our
          directory honest and useful for everyone.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-emerald-700">
              <CheckCircle2 className="h-5 w-5" /> Do
            </h2>
            <ul className="space-y-2 text-sm text-charcoal-700">
              {DO.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-red-700">
              <XCircle className="h-5 w-5" /> Don&apos;t
            </h2>
            <ul className="space-y-2 text-sm text-charcoal-700">
              {DONT.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>

        <div className="prose-editorial mt-10">
          <h2>Moderation Process</h2>
          <p>
            Every submitted review starts in a &quot;pending&quot; state and is reviewed by our moderation team
            before publishing. Professionals may reply to published reviews, and can flag reviews they believe are
            unfair or fraudulent for investigation. Customers can edit their review within 48 hours of submission.
          </p>
          <h2>Reporting a Review</h2>
          <p>
            If you believe a review violates these guidelines, use the &quot;Report&quot; option on the review, or
            contact our support team with details.
          </p>
        </div>
      </div>
    </div>
  );
}
