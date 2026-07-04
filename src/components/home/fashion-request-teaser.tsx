"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEATURED_CITIES, PRICE_RANGES } from "@/lib/constants";

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget Friendly",
  mid: "Mid Range",
  premium: "Premium",
  luxury: "Luxury",
};

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
  const [budget, setBudget] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceNeeded) params.set("service", serviceNeeded);
    if (city) params.set("city", city);
    if (budget) params.set("budget", budget);
    if (dateNeeded) params.set("date", dateNeeded);
    if (details) params.set("details", details);
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

        <Card className="shadow-elevated">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="service-needed">Service needed</Label>
                <Input
                  id="service-needed"
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  placeholder="e.g. Wedding reception dress"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="request-city">Location</Label>
                <select
                  id="request-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-charcoal-200 bg-white px-3 text-sm text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select city</option>
                  {FEATURED_CITIES.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="request-budget">Budget</Label>
                <select
                  id="request-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-charcoal-200 bg-white px-3 text-sm text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select budget</option>
                  {PRICE_RANGES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {BUDGET_LABELS[p.value]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="request-date">Date needed</Label>
                <Input
                  id="request-date"
                  type="date"
                  value={dateNeeded}
                  onChange={(e) => setDateNeeded(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="request-details">Short description</Label>
                <Textarea
                  id="request-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us more about what you're looking for…"
                  rows={3}
                />
              </div>

              <Button type="submit" size="lg" className="sm:col-span-2">
                Submit a Fashion Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
