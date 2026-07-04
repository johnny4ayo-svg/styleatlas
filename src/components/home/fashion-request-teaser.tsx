"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FEATURED_CITIES } from "@/lib/constants";

const EXAMPLES = [
  "I need a wedding reception dress in Lagos.",
  "I need Aso Ebi for 15 women.",
  "I need a men's senator outfit before Sunday.",
  "I need a fashion school in Abuja.",
];

export function FashionRequestTeaser() {
  const router = useRouter();
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceNeeded) params.set("service", serviceNeeded);
    if (city) params.set("city", city);
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <section className="section-container py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Fashion Requests</p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            Can&apos;t Find the Exact Style You Want?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-charcoal-500 lg:mx-0">
            Post your fashion request and let matched designers, stylists, bridal houses, or fashion vendors send
            you quotes.
          </p>
          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left lg:mx-0">
            {EXAMPLES.map((example) => (
              <li key={example} className="flex items-start gap-2 text-sm text-charcoal-500">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {example}
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-gold-200 shadow-elevated">
          <CardContent className="pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Get quotes in minutes — free to post
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  placeholder="What do you need? e.g. Wedding dress"
                  className="h-12 flex-1 text-sm"
                />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-charcoal-200 bg-white px-3 text-sm text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-40"
                >
                  <option value="">Location</option>
                  {FEATURED_CITIES.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="lg" className="h-12 w-full">
                Submit a Fashion Request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
