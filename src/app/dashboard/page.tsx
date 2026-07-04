import Link from "next/link";
import { Building2, ShoppingBag, Star, Heart, ArrowRight, AlertCircle } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const isProfessional = profile.role === "professional" || profile.role === "professional_staff";

  if (isProfessional) {
    const account = await getManagedProfessionalAccount(profile.id);
    if (!account) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Building2 className="h-10 w-10 text-gold-500" />
            <p className="font-serif text-xl font-semibold text-charcoal-900">Set up your business profile</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create your STYLEATLAS listing to start receiving leads from customers across Nigeria.
            </p>
            <Button asChild>
              <Link href="/onboarding/professional">Create Business Profile</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    const supabase = createClient();
    const [{ count: newLeads }, { count: portfolioCount }] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("professional_account_id", account.id).eq("status", "new"),
      supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("professional_account_id", account.id).eq("status", "active"),
    ]);

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{account.business_name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground capitalize">{account.status} listing · {account.subscription_status}</p>
            </div>
            <div className="flex gap-2">
              <VerifiedBadge level={account.verification_status} />
              {account.plan?.slug && <Badge variant="gold" className="capitalize">{account.plan.slug} Plan</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-charcoal-700">Profile completion</p>
              <p className="text-sm font-semibold text-gold-600">{account.profile_completion_score}%</p>
            </div>
            <Progress value={account.profile_completion_score} className="mt-2" />
            {account.profile_completion_score < 80 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                Complete your profile to appear higher in search results.{" "}
                <Link href="/dashboard/profile" className="font-medium text-gold-600 hover:underline">Finish now →</Link>
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AnalyticsCard label="New Leads" value={newLeads ?? 0} icon={ShoppingBag} href="/dashboard/leads" />
          <AnalyticsCard label="Portfolio Items" value={portfolioCount ?? 0} icon={Building2} accent="emerald" href="/dashboard/portfolio" />
          <AnalyticsCard label="Average Rating" value={(account.rating_average ?? 0).toFixed(1)} icon={Star} accent="gold" href="/dashboard/reviews" />
        </div>

        {account.subscription_status !== "active" && account.plan?.slug !== "free" && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="flex items-center justify-between py-4">
              <p className="text-sm text-amber-800">Your subscription needs attention ({account.subscription_status}).</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/billing">
                  Manage Billing <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Customer overview
  const supabase = createClient();
  const [{ count: savedCount }, { count: openRequests }] = await Promise.all([
    supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
    supabase.from("customer_requests").select("id", { count: "exact", head: true }).eq("customer_id", profile.id).eq("status", "open"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal-900">Welcome back, {profile.full_name.split(" ")[0] || "there"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your STYLEATLAS account.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnalyticsCard label="Saved Items" value={savedCount ?? 0} icon={Heart} href="/dashboard/saved" />
        <AnalyticsCard label="Open Fashion Requests" value={openRequests ?? 0} icon={ShoppingBag} accent="emerald" href="/dashboard/requests" />
      </div>
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-6">
          <p className="text-sm text-charcoal-700">Looking for a designer or stylist? Submit a fashion request and get matched.</p>
          <Button asChild>
            <Link href="/marketplace">Submit a Request</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
