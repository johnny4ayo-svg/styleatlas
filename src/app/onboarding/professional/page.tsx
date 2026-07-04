import { requireAuth } from "@/lib/auth/rbac";
import { getCategories } from "@/lib/data/categories";
import { ProfessionalOnboardingForm } from "@/components/onboarding/professional-onboarding-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Set Up Your Business Profile | STYLEATLAS",
  description: "Create your STYLEATLAS professional business profile.",
  path: "/onboarding/professional",
  noindex: true,
});

export default async function ProfessionalOnboardingPage() {
  await requireAuth();
  const categories = await getCategories();

  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Set up your business profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Just a few details to get your listing live. You can add photos, services, and more from your dashboard.
        </p>
        <div className="mt-6">
          <ProfessionalOnboardingForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
