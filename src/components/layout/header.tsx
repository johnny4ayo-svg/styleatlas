import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { getCurrentProfile } from "@/lib/auth/rbac";

export async function Header() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal-100 bg-white/95 backdrop-blur">
      <div className="section-container flex h-16 items-center justify-between gap-4 lg:h-20">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="STYLEATLAS" width={40} height={40} className="h-9 w-9 object-contain lg:h-10 lg:w-10" priority />
            <span className="hidden font-serif text-xl font-semibold tracking-tight text-charcoal-900 sm:block">
              STYLEATLAS
            </span>
          </Link>
        </div>

        <MegaMenu />

        <div className="flex items-center gap-2">
          <Link
            href="/directory"
            className="hidden items-center gap-2 rounded-full border border-charcoal-200 px-4 py-2 text-sm text-charcoal-500 transition hover:border-gold-300 md:flex"
          >
            <Search className="h-4 w-4" />
            Search designers, brands, schools…
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" asChild aria-label="Search">
            <Link href="/directory">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {profile ? (
            <UserMenu profile={profile} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register?type=professional">List Your Business</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
