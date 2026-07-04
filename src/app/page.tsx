import Image from "next/image";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { PremiumDesigners } from "@/components/home/premium-designers";
import { OutfitGalleryPreview } from "@/components/home/outfit-gallery-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustSection } from "@/components/home/trust-section";
import { VerifiedProfessionals } from "@/components/home/verified-professionals";
import { LocationDiscovery } from "@/components/home/location-discovery";
import { JobsEventsPreview } from "@/components/home/jobs-events-preview";
import { BlogPreview } from "@/components/home/blog-preview";
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
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            className="scale-150 object-cover object-center blur-2xl"
            priority
          />
        </div>
        <div className="section-container relative text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            Nigeria&apos;s Trusted Fashion Directory
          </p>
          <h1 className="mx-auto max-w-3xl text-balance font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            Discover Nigeria&apos;s Best Fashion Designers, Brands &amp; Style Experts
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-charcoal-200">
            Search, compare, and connect with verified designers, bridal houses, stylists, and fashion schools —
            all in one trusted, premium directory.
          </p>
          <div className="mt-10">
            <HeroSearch />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-charcoal-300">
            <a href="/register" className="underline-offset-4 hover:text-white hover:underline">
              I&apos;m a customer, help me find a designer
            </a>
            <span className="text-charcoal-600">·</span>
            <a href="/register?type=professional" className="underline-offset-4 hover:text-gold-400 hover:underline">
              I&apos;m a professional, list my business
            </a>
          </div>
        </div>
      </section>

      <FeaturedCategories />
      <PremiumDesigners listings={featuredProfessionals} />
      <OutfitGalleryPreview outfits={featuredOutfits} />
      <HowItWorks />
      <VerifiedProfessionals listings={verifiedProfessionals} />
      <LocationDiscovery />

      <section className="section-container py-16 sm:py-20">
        <CTASection
          eyebrow="Marketplace"
          title="Can't find exactly what you need?"
          description="Post your fashion request — wedding gown, Aso Ebi for 10, children's outfit — and let matched professionals respond with quotes."
          primaryLabel="Submit a Fashion Request"
          primaryHref="/marketplace"
          secondaryLabel="See how it works"
          secondaryHref="/marketplace#how-it-works"
          variant="gold"
        />
      </section>

      <JobsEventsPreview jobs={recentJobs} events={upcomingEvents} />
      <BlogPreview posts={recentPosts} />

      <section className="section-container py-16 sm:py-20">
        <CTASection
          eyebrow="For Professionals"
          title="Grow your fashion business on STYLEATLAS"
          description="Get discovered by thousands of customers searching for designers, brands, and stylists every month. Free to join — upgrade anytime."
          primaryLabel="List Your Business Free"
          primaryHref="/register?type=professional"
          secondaryLabel="View Pricing Plans"
          secondaryHref="/pricing"
        />
      </section>

      <TrustSection />
    </>
  );
}
