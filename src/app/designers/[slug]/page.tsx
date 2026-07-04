import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Globe, Phone, MapPin, Clock } from "lucide-react";
import { getProfessionalBySlug } from "@/lib/data/professionals";
import {
  getPortfolioItems,
  getServices,
  getPublishedReviews,
  getSimilarProfessionals,
  getRelatedOutfits,
  isFavorited,
} from "@/lib/data/profile-detail";
import { getCurrentProfile } from "@/lib/auth/rbac";
import { buildMetadata, localBusinessSchema, jsonLdScript } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { VerifiedBadge, PlanBadge } from "@/components/shared/verified-badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SaveButton } from "@/components/shared/save-button";
import { ShareButton } from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import { PortfolioGallery } from "@/components/directory/portfolio-gallery";
import { ServicesList } from "@/components/directory/services-list";
import { ReviewsSection } from "@/components/directory/reviews-section";
import { LeadInquiryForm } from "@/components/directory/lead-inquiry-form";
import { ListingCard } from "@/components/directory/listing-card";
import { FaqSection } from "@/components/shared/faq-section";
import { OutfitGalleryPreview } from "@/components/home/outfit-gallery-preview";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const professional = await getProfessionalBySlug(params.slug);
  if (!professional) return {};

  const title = `${professional.business_name} — ${professional.category?.name ?? "Fashion Professional"} in ${professional.city} | STYLEATLAS`;
  const description =
    professional.description?.slice(0, 155) ??
    `${professional.business_name} is a verified ${professional.category?.name?.toLowerCase()} based in ${professional.city}, Nigeria. View portfolio, reviews, and contact details on STYLEATLAS.`;

  return buildMetadata({
    title,
    description,
    path: `/designers/${professional.slug}`,
    image: professional.cover_image_url ?? undefined,
  });
}

export default async function DesignerProfilePage({ params }: Props) {
  const professional = await getProfessionalBySlug(params.slug);
  if (!professional) notFound();

  const currentProfile = await getCurrentProfile();

  const [portfolioItems, services, reviews, similarProfessionals, relatedOutfits, saved] = await Promise.all([
    getPortfolioItems(professional.id),
    getServices(professional.id),
    getPublishedReviews(professional.id),
    getSimilarProfessionals(professional.category_id, professional.city, professional.id),
    getRelatedOutfits(professional.id),
    isFavorited(currentProfile?.id ?? null, professional.id),
  ]);

  const sourcePage = `/designers/${professional.slug}`;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          localBusinessSchema({
            name: professional.business_name,
            description: professional.description,
            url: sourcePage,
            image: professional.cover_image_url,
            telephone: professional.phone,
            address: { streetAddress: professional.address, city: professional.city, state: professional.state, country: professional.country },
            ratingValue: professional.rating_average,
            reviewCount: professional.review_count,
            priceRange: professional.price_range ?? undefined,
          })
        )}
      />

      <div className="relative h-56 w-full overflow-hidden bg-charcoal-100 sm:h-72 lg:h-80">
        {professional.cover_image_url && (
          <Image src={professional.cover_image_url} alt={professional.business_name} fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="section-container">
        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white shadow-elevated">
              {professional.logo_url && <Image src={professional.logo_url} alt={professional.business_name} fill className="object-cover" />}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl font-semibold text-charcoal-900 sm:text-3xl">{professional.business_name}</h1>
                <VerifiedBadge level={professional.verification_status} />
                {professional.plan?.slug && <PlanBadge plan={professional.plan.slug} />}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{professional.city}, {professional.state}</span>
                <RatingStars rating={professional.rating_average ?? 0} reviewCount={professional.review_count ?? 0} showValue size={14} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <SaveButton entityType="professional_account" entityId={professional.id} initialSaved={saved} variant="full" />
            <ShareButton title={professional.business_name} path={sourcePage} />
          </div>
        </div>

        <Breadcrumbs
          items={[
            { label: "Directory", href: "/directory" },
            { label: professional.category?.name ?? "Professionals", href: `/directory/${professional.category?.slug}` },
            { label: professional.business_name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {professional.description && (
              <section className="pb-10">
                <h2 className="mb-3 font-serif text-2xl font-semibold text-charcoal-900">About</h2>
                <p className="whitespace-pre-line text-charcoal-700">{professional.description}</p>
                {professional.brand_story && (
                  <div className="mt-4 rounded-lg bg-ivory p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold-600">Brand Story</p>
                    <p className="whitespace-pre-line text-sm text-charcoal-700">{professional.brand_story}</p>
                  </div>
                )}
              </section>
            )}

            <section className="border-t border-charcoal-100 py-10">
              <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Portfolio</h2>
              <PortfolioGallery items={portfolioItems} />
            </section>

            <ServicesList services={services} />

            <ReviewsSection
              reviews={reviews}
              ratingAverage={professional.rating_average ?? 0}
              reviewCount={professional.review_count ?? 0}
              professionalAccountId={professional.id}
              professionalSlug={professional.slug}
            />

            <FaqSection
              title="Frequently Asked Questions"
              faqs={[
                {
                  question: `Is ${professional.business_name} verified?`,
                  answer:
                    professional.verification_status === "unverified"
                      ? "This professional has not completed verification yet. Proceed with the usual care for any online transaction."
                      : `Yes — ${professional.business_name} has completed ${professional.verification_status.replace("_", " ")} on STYLEATLAS.`,
                },
                {
                  question: "How do I book or get a quote?",
                  answer: "Use the inquiry form on this page, or contact the business directly via WhatsApp for a faster response.",
                },
              ]}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {professional.whatsapp && (
              <WhatsAppButton
                phone={professional.whatsapp}
                professionalAccountId={professional.id}
                sourcePage={sourcePage}
                fullWidth
                size="lg"
                message={`Hi, I found your profile on STYLEATLAS and I'm interested in your services.`}
              />
            )}
            {professional.phone && (
              <Button asChild variant="secondary" size="lg" className="w-full">
                <a href={`tel:${professional.phone}`}>
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              </Button>
            )}
            {professional.website && (
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href={professional.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" /> Visit Website
                </a>
              </Button>
            )}

            <LeadInquiryForm
              professionalAccountId={professional.id}
              categoryId={professional.category_id}
              city={professional.city}
              state={professional.state}
              sourcePage={sourcePage}
            />

            {professional.address && (
              <div className="rounded-lg border border-charcoal-100 p-4 text-sm">
                <p className="mb-1 flex items-center gap-2 font-medium text-charcoal-800">
                  <MapPin className="h-4 w-4 text-gold-500" /> Address
                </p>
                <p className="text-muted-foreground">{professional.address}</p>
              </div>
            )}

            <div className="rounded-lg border border-charcoal-100 p-4 text-sm">
              <p className="mb-1 flex items-center gap-2 font-medium text-charcoal-800">
                <Clock className="h-4 w-4 text-gold-500" /> Availability
              </p>
              <p className="capitalize text-muted-foreground">{professional.availability_status}</p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              <Link href="/review-guidelines" className="underline">Report this listing</Link>
            </p>
          </aside>
        </div>

        {similarProfessionals.length > 0 && (
          <section className="border-t border-charcoal-100 py-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Similar Professionals</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProfessionals.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>

      <OutfitGalleryPreview outfits={relatedOutfits} />
    </div>
  );
}
