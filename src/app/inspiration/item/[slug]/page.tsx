import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getOutfitBySlug, getOutfitsByCategory } from "@/lib/data/outfits";
import { getCurrentProfile } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SaveButton } from "@/components/shared/save-button";
import { ShareButton } from "@/components/shared/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const outfit = await getOutfitBySlug(params.slug);
  if (!outfit) return {};
  return buildMetadata({
    title: outfit.seo_title ?? `${outfit.title} | STYLEATLAS Inspiration`,
    description: outfit.seo_description ?? outfit.description ?? `${outfit.title} — premium Nigerian fashion inspiration on STYLEATLAS.`,
    path: `/inspiration/item/${outfit.slug}`,
    image: outfit.image_url,
  });
}

export default async function OutfitDetailPage({ params }: Props) {
  const outfit = await getOutfitBySlug(params.slug);
  if (!outfit) notFound();

  const currentProfile = await getCurrentProfile();
  const supabase = createClient();

  let saved = false;
  if (currentProfile) {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", currentProfile.id)
      .eq("entity_type", "outfit_inspiration")
      .eq("entity_id", outfit.id)
      .maybeSingle();
    saved = !!data;
  }

  const { data: similar } = await getOutfitsByCategory(outfit.category?.slug ?? "", 1, 5);
  const similarOutfits = similar.filter((o) => o.id !== outfit.id).slice(0, 4);

  return (
    <div className="section-container py-10">
      <Breadcrumbs
        items={[
          { label: "Inspiration", href: "/inspiration" },
          { label: outfit.category?.name ?? "Gallery", href: `/inspiration/${outfit.category?.slug}` },
          { label: outfit.title },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-charcoal-100">
          <Image src={outfit.image_url} alt={outfit.alt_text || outfit.title} fill priority className="object-cover" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900">{outfit.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {outfit.category && <Badge variant="gold">{outfit.category.name}</Badge>}
            {outfit.occasion && <Badge variant="outline">{outfit.occasion}</Badge>}
            {outfit.color && <Badge variant="outline">{outfit.color}</Badge>}
          </div>

          {outfit.description && <p className="mt-5 text-charcoal-700">{outfit.description}</p>}

          {outfit.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {outfit.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-charcoal-50 px-2.5 py-1 text-xs text-charcoal-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2">
            <SaveButton entityType="outfit_inspiration" entityId={outfit.id} initialSaved={saved} variant="full" />
            <ShareButton title={outfit.title} path={`/inspiration/item/${outfit.slug}`} />
          </div>

          {outfit.designer && (
            <div className="mt-8 rounded-lg border border-charcoal-100 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Designer</p>
              <Link href={`/designers/${outfit.designer.slug}`} className="font-serif text-lg font-semibold text-charcoal-900 hover:text-gold-600">
                {outfit.designer.business_name}
              </Link>
              <Button asChild className="mt-4 w-full">
                <Link href={`/designers/${outfit.designer.slug}#inquiry`}>Request a Similar Style</Link>
              </Button>
            </div>
          )}

          {!outfit.designer && (
            <div className="mt-8 rounded-lg border border-dashed border-gold-300 bg-gold-50 p-5">
              <p className="text-sm text-charcoal-700">Love this look? Tell us what you need and we&apos;ll match you with a designer.</p>
              <Button asChild className="mt-4 w-full">
                <Link href="/marketplace">Request a Similar Style</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {similarOutfits.length > 0 && (
        <section className="mt-16 border-t border-charcoal-100 pt-10">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Similar Looks</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similarOutfits.map((item) => (
              <Link key={item.id} href={`/inspiration/item/${item.slug}`} className="group relative block overflow-hidden rounded-lg">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal-100">
                  <Image src={item.image_url} alt={item.alt_text || item.title} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
