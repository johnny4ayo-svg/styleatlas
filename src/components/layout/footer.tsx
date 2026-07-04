import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { PROFESSIONAL_CATEGORIES, FEATURED_CITIES } from "@/lib/constants";

const FOOTER_LINKS = {
  Discover: [
    { label: "Fashion Designers", href: "/directory/fashion-designers" },
    { label: "Fashion Brands", href: "/directory/fashion-brands" },
    { label: "Bridal Houses", href: "/directory/bridal-houses" },
    { label: "Fashion Schools", href: "/directory/fashion-schools" },
    { label: "Outfit Inspiration", href: "/inspiration" },
  ],
  Company: [
    { label: "About STYLEATLAS", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Fashion Jobs", href: "/jobs" },
    { label: "Fashion Events", href: "/events" },
  ],
  Trust: [
    { label: "Verification Explained", href: "/verification" },
    { label: "Review Guidelines", href: "/review-guidelines" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-charcoal-100 bg-charcoal-900 text-charcoal-200">
      <div className="section-container py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="STYLEATLAS" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-serif text-lg font-semibold text-white">STYLEATLAS</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-charcoal-400">
              Nigeria&apos;s trusted destination for discovering, comparing, and booking verified fashion
              designers, brands, stylists, and schools.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-gold-400 hover:text-charcoal-900">
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400">{heading}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-charcoal-300 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400">Top Cities</p>
            <ul className="space-y-2.5">
              {FEATURED_CITIES.slice(0, 6).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/directory/fashion-designers/${city.slug}`}
                    className="text-sm text-charcoal-300 hover:text-white"
                  >
                    Designers in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400">All Categories</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {PROFESSIONAL_CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/directory/${cat.slug}`} className="text-xs text-charcoal-400 hover:text-white">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-charcoal-400">
            © {new Date().getFullYear()} STYLEATLAS. All rights reserved.
          </p>
          <p className="text-xs text-charcoal-500">Made for Nigeria&apos;s fashion industry.</p>
        </div>
      </div>
    </footer>
  );
}
