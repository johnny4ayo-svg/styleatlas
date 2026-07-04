"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ADMIN_NAV } from "./admin-nav";
import { PROFESSIONAL_NAV, CUSTOMER_NAV } from "./dashboard-nav";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardNavSection {
  label?: string;
  items: DashboardNavItem[];
}

// Icon components (function references) can't be passed as props from a
// Server Component to a Client Component — React can't serialize them
// across that boundary. So instead of the parent Server Component layout
// passing the nav array as a prop, this Client Component imports the nav
// data itself and only receives a plain, serializable string to pick from.
const NAV_BY_KEY: Record<"admin" | "professional" | "customer", DashboardNavSection[]> = {
  admin: ADMIN_NAV,
  professional: PROFESSIONAL_NAV,
  customer: CUSTOMER_NAV,
};

export function DashboardShell({
  nav,
  title,
  children,
}: {
  nav: "admin" | "professional" | "customer";
  title: string;
  children: React.ReactNode;
}) {
  const sections = NAV_BY_KEY[nav];
  const activePath = usePathname();

  return (
    <div className="min-h-screen bg-ivory">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white lg:flex">
          <Link href="/" className="flex items-center gap-2 border-b border-charcoal-100 px-6 py-5">
            <Image src="/images/logo.png" alt="STYLEATLAS" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-serif text-base font-semibold text-charcoal-900">STYLEATLAS</span>
          </Link>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {sections.map((section, i) => (
              <div key={i} className="mb-5">
                {section.label && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-charcoal-400">{section.label}</p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activePath === item.href || activePath.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive ? "bg-gold-50 text-gold-700" : "text-charcoal-600 hover:bg-charcoal-50"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal-100 bg-white/95 px-6 py-4 backdrop-blur lg:px-8">
            <h1 className="font-serif text-xl font-semibold text-charcoal-900">{title}</h1>
          </header>
          <main className="px-6 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
