import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { BadgeCheck, ShieldCheck, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Verification Explained",
  description: "Understand STYLEATLAS's verification levels and how professionals earn trust badges.",
  path: "/verification",
});

const LEVELS = [
  { icon: BadgeCheck, title: "Identity Verified", description: "The business owner's government-issued ID has been reviewed and confirmed." },
  { icon: ShieldCheck, title: "Business Verified", description: "Business registration documents have been submitted and confirmed." },
  { icon: MapPin, title: "Address Verified", description: "The physical business address has been confirmed via proof of address." },
  { icon: Crown, title: "Premium Verified", description: "The highest tier — full identity, business, and address verification, plus concierge review by our team." },
];

export default function VerificationPage() {
  return (
    <div className="section-container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Verification Explained</h1>
        <p className="mt-4 text-muted-foreground">
          Verification badges help customers quickly identify trustworthy professionals. Verification is optional
          but strongly encouraged — verified professionals typically see higher response rates and better search
          visibility.
        </p>

        <div className="mt-10 space-y-4">
          {LEVELS.map((level) => (
            <div key={level.title} className="flex items-start gap-4 rounded-xl border border-charcoal-100 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <level.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">{level.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="prose-editorial mt-10">
          <h2>How verification works</h2>
          <p>
            Professionals submit supporting documents (government ID, business registration, address proof, social
            media or website proof) from their dashboard. Documents are stored securely in a private storage bucket
            accessible only to the professional and authorized STYLEATLAS administrators — never made public.
          </p>
          <p>
            Our team reviews submissions, usually within 2-5 business days, and either approves the requested level,
            requests more information, or provides a rejection reason. Professionals can track their verification
            status and resubmit at any time from their dashboard.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/register?type=professional">Get Verified — List Your Business</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
