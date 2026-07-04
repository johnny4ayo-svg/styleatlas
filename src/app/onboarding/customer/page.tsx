import { requireAuth } from "@/lib/auth/rbac";
import { CustomerOnboardingForm } from "@/components/onboarding/customer-onboarding-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Welcome to STYLEATLAS",
  description: "Tell us a bit about yourself to personalize your STYLEATLAS experience.",
  path: "/onboarding/customer",
  noindex: true,
});

export default async function CustomerOnboardingPage() {
  await requireAuth();

  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Welcome to STYLEATLAS</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Just a couple of details to personalize your experience.</p>
        <div className="mt-6">
          <CustomerOnboardingForm />
        </div>
      </div>
    </div>
  );
}
