"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MEGA_MENU_SECTIONS, PRIMARY_NAV } from "./nav-data";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-charcoal-100 p-5">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col overflow-y-auto pb-24">
          <Accordion type="single" collapsible className="px-2">
            {MEGA_MENU_SECTIONS.map((section) => (
              <AccordionItem key={section.label} value={section.label}>
                <AccordionTrigger className="px-3 font-serif text-base">{section.label}</AccordionTrigger>
                <AccordionContent className="px-3">
                  <div className="space-y-4">
                    {section.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                          {col.heading}
                        </p>
                        <ul className="space-y-2">
                          {col.items.map((item) => (
                            <li key={item.href}>
                              <Link href={item.href} onClick={() => setOpen(false)} className="text-sm text-charcoal-700">
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-2 flex flex-col gap-1 border-t border-charcoal-100 px-5 py-4">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-charcoal-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-charcoal-100 p-5">
            <Button asChild variant="outline">
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register?type=professional" onClick={() => setOpen(false)}>List Your Business</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
