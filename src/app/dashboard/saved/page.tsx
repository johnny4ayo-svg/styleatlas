import Link from "next/link";
import Image from "next/image";
import { requireAuth } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/directory/listing-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfessionalAccount, OutfitInspiration } from "@/types";

export default async function DashboardSavedPage() {
  const profile = await requireAuth();
  const supabase = createClient();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("entity_type, entity_id")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const rows = (favorites ?? []) as { entity_type: string; entity_id: string }[];
  const professionalIds = rows.filter((r) => r.entity_type === "professional_account").map((r) => r.entity_id);
  const outfitIds = rows.filter((r) => r.entity_type === "outfit_inspiration").map((r) => r.entity_id);

  const [{ data: professionals }, { data: outfits }] = await Promise.all([
    professionalIds.length > 0
      ? supabase.from("professional_accounts").select("*, category:categories(*), plan:subscription_plans(*)").in("id", professionalIds)
      : Promise.resolve({ data: [] }),
    outfitIds.length > 0
      ? supabase.from("outfit_inspirations").select("*, category:categories(*)").in("id", outfitIds)
      : Promise.resolve({ data: [] }),
  ]);

  const savedProfessionals = (professionals ?? []) as unknown as ProfessionalAccount[];
  const savedOutfits = (outfits ?? []) as unknown as OutfitInspiration[];

  if (savedProfessionals.length === 0 && savedOutfits.length === 0) {
    return <EmptyState title="Nothing saved yet" description="Save designers, brands, and outfit inspiration to find them here later." actionLabel="Browse the directory" actionHref="/directory" />;
  }

  return (
    <Tabs defaultValue="professionals">
      <TabsList>
        <TabsTrigger value="professionals">Professionals ({savedProfessionals.length})</TabsTrigger>
        <TabsTrigger value="outfits">Outfit Inspiration ({savedOutfits.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="professionals">
        {savedProfessionals.length === 0 ? (
          <EmptyState title="No saved professionals" description="Browse the directory and tap the heart icon to save a listing." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedProfessionals.map((p) => (
              <ListingCard key={p.id} listing={p} saved />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="outfits">
        {savedOutfits.length === 0 ? (
          <EmptyState title="No saved inspiration" description="Save outfit looks you love to revisit them here." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {savedOutfits.map((outfit) => (
              <Link key={outfit.id} href={`/inspiration/item/${outfit.slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-charcoal-100">
                <Image src={outfit.image_url} alt={outfit.alt_text || outfit.title} fill sizes="25vw" className="object-cover" />
              </Link>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
