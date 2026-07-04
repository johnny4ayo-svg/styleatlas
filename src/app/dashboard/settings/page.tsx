import { requireAuth } from "@/lib/auth/rbac";
import { AccountSettingsForm } from "@/components/dashboard/account-settings-form";

export default async function DashboardSettingsPage() {
  const profile = await requireAuth();
  const prefs = profile.notification_preferences;

  return (
    <AccountSettingsForm
      defaultValues={{
        fullName: profile.full_name,
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        emailNotifications: prefs?.email ?? true,
        smsNotifications: prefs?.sms ?? false,
      }}
    />
  );
}
