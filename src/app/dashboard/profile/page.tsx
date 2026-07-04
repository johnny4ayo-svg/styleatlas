import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { ProfessionalProfileForm } from "@/components/dashboard/professional-profile-form";

export default async function DashboardProfilePage() {
  const profile = await requireAuth();
  const account = await getManagedProfessionalAccount(profile.id);
  if (!account) redirect("/onboarding/professional");

  return (
    <div className="max-w-3xl">
      <ProfessionalProfileForm
        accountId={account.id}
        defaultValues={{
          businessName: account.business_name,
          description: account.description ?? "",
          brandStory: account.brand_story ?? "",
          phone: account.phone ?? "",
          whatsapp: account.whatsapp ?? "",
          email: account.email ?? "",
          website: account.website ?? "",
          instagram: account.instagram ?? "",
          facebook: account.facebook ?? "",
          tiktok: account.tiktok ?? "",
          youtube: account.youtube ?? "",
          address: account.address ?? "",
          city: account.city,
          state: account.state,
          priceRange: account.price_range ?? undefined,
          availabilityStatus: account.availability_status,
          logoUrl: account.logo_url ?? "",
          coverImageUrl: account.cover_image_url ?? "",
        }}
      />
    </div>
  );
}
