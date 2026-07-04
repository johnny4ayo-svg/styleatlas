import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { HeroMockupCard } from "@/components/home/hero-mockup-card";
import { Button } from "@/components/ui/button";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { PremiumDesigners } from "@/components/home/premium-designers";
import { OutfitGalleryPreview } from "@/components/home/outfit-gallery-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustSection } from "@/components/home/trust-section";
import { VerifiedProfessionals } from "@/components/home/verified-professionals";
import { LocationDiscovery } from "@/components/home/location-discovery";
import { JobsEventsPreview } from "@/components/home/jobs-events-preview";
import { BlogPreview } from "@/components/home/blog-preview";
import { FashionRequestTeaser } from "@/components/home/fashion-request-teaser";
import { CTASection } from "@/components/shared/cta-section";
import { getFeaturedProfessionals, getVerifiedProfessionals } from "@/lib/data/professionals";
import { getFeaturedOutfits } from "@/lib/data/outfits";
import { getRecentJobs, getUpcomingEvents } from "@/lib/data/jobs-events";
import { getRecentPosts } from "@/lib/data/blog";

export default async function HomePage() {
  const [featuredProfessionals, verifiedProfessionals, featuredOutfits, recentJobs, upcomingEvents, recentPosts] = await Promise.all([
    getFeaturedProfessionals(8),
    getVerifiedProfessionals(6),
    getFeaturedOutfits(8),
    getRecentJobs(4),
    getUpcomingEvents(4),
    getRecentPosts(3),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal-900 py-20 sm:py-28">
        <div className="section-container relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              Nigeria&apos;s Premium Fashion Discovery Platform
            </p>
            <h1 className="text-balance font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Find Verified Fashion Designers, Brands &amp; Style Experts Across Nigeria
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-charcoal-200 lg:mx-0">
              Discover trusted fashion designers, bridal houses, stylists, tailors, fashion schools, makeup
              artists, and fabric vendors. Compare portfolios, reviews, pricing, locations, and availability
              before you book.
            </p>

            <div className="mt-10">
              <HeroSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild size="lg">
                <Link href="/directory">Find a Designer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                <Link href="/register?type=professional">List Your Fashion Business</Link>
              </Button>
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-charcoal-300">
              Verified profiles &middot; Real portfolios &middot; Customer reviews &middot; Direct WhatsApp contact
            </p>
          </div>

          <HeroMockupCard />
        </div>
      </section>

      <FeaturedCategories />
      <PremiumDesigners listings={featuredProfessionals} />
      <OutfitGalleryPreview outfits={featuredOutfits} />
      <HowItWorks />
      <VerifiedProfessionals listings={verifiedProfessionals} />
      <LocationDiscovery />

      <FashionRequestTeaser />

      <JobsEventsPreview jobs={recentJobs} events={upcomingEvents} />
      <BlogPreview posts={recentPosts} />

      <section className="section-container py-16 sm:py-20">
        <CTASection
          eyebrow="For Professionals"
          title="Grow your fashion business on STYLEATLAS"
          description="Get discovered by customers searching for designers, brands, stylists, schools, tailors, bridal houses, and fashion services across Nigeria. Free to join, upgrade anytime."
          primaryLabel="List Your Business Free"
          primaryHref="/register?type=professional"
          secondaryLabel="View Pricing Plans"
          secondaryHref="/pricing"
        />
      </section>

      <TrustSection />

      <section className="section-container py-16 sm:py-20">
        <CTASection
          title="Ready to Find the Right Fashion Professional?"
          description="Search verified designers, brands, stylists, schools, and fashion vendors across Nigeria."
          primaryLabel="Start Searching"
          primaryHref="/directory"
          secondaryLabel="List Your Business"
          secondaryHref="/register?type=professional"
        />
      </section>
    </>
  );
}
