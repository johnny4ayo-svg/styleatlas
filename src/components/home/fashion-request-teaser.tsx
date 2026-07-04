"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { leadFormSchema } from "@/lib/validations/lead";
import { submitLead } from "@/lib/actions/leads";
import { FEATURED_CITIES, PRICE_RANGES } from "@/lib/constants";

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget Friendly",
  mid: "Mid Range",
  premium: "Premium",
  luxury: "Luxury",
};

const fashionRequestSchema = leadFormSchema.omit({ message: true, whatsapp: true }).extend({
  serviceNeeded: z.string().trim().min(2, "Tell us what you need"),
  city: z.string().trim().min(2, "Select a location"),
  dateNeeded: z.string().optional().or(z.literal("")),
  description: z.string().trim().min(10, "Please share a bit more detail (min 10 characters)").max(2000),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid WhatsApp number"),
});

type FashionRequestValues = z.infer<typeof fashionRequestSchema>;

const EXAMPLES = [
  "I need a wedding reception dress in Lagos.",
  "I need Aso Ebi for 15 women.",
  "I need a men's senator outfit before Sunday.",
  "I need a fashion school in Abuja.",
];

export function FashionRequestTeaser() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FashionRequestValues>({ resolver: zodResolver(fashionRequestSchema) });

  const onSubmit = async (values: FashionRequestValues) => {
    const message = [
      `Service needed: ${values.serviceNeeded}`,
      values.dateNeeded ? `Date needed: ${values.dateNeeded}` : null,
      "",
      values.description,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const result = await submitLead({
      name: values.name,
      email: values.email,
      whatsapp: values.whatsapp,
      phone: "",
      budget: values.budget,
      message,
      consent: values.consent,
      city: values.city,
      sourceType: "marketplace_request",
      sourcePage: "homepage_fashion_request",
    });

    if (result.error === "rate_limited") {
      toast.error("You've submitted a few requests recently. Please try again shortly.");
      return;
    }
    if (result.error) {
      toast.error("Something went wrong submitting your request. Please try again.");
      return;
    }
    setSubmitted(true);
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
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="font-serif text-lg font-semibold text-charcoal-900">Request submitted!</p>
                <p className="text-sm text-muted-foreground">
                  Your fashion request has been submitted. We&apos;ll match it with relevant fashion professionals.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                  Get quotes in minutes — free to post
                </p>

                <div>
                  <Label htmlFor="serviceNeeded">Service needed</Label>
                  <Input
                    id="serviceNeeded"
                    placeholder="e.g. Wedding reception dress"
                    {...register("serviceNeeded")}
                    className="mt-1.5"
                  />
                  {errors.serviceNeeded && (
                    <p className="mt-1 text-xs text-destructive">{errors.serviceNeeded.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">Location</Label>
                    <select
                      id="city"
                      {...register("city")}
                      defaultValue=""
                      className="mt-1.5 flex h-10 w-full rounded-md border border-charcoal-200 bg-white px-3 text-sm text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="" disabled>
                        Select city
                      </option>
                      {FEATURED_CITIES.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <select
                      id="budget"
                      {...register("budget")}
                      defaultValue=""
                      className="mt-1.5 flex h-10 w-full rounded-md border border-charcoal-200 bg-white px-3 text-sm text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Any budget</option>
                      {PRICE_RANGES.map((p) => (
                        <option key={p.value} value={BUDGET_LABELS[p.value]}>
                          {BUDGET_LABELS[p.value]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateNeeded">Date needed (optional)</Label>
                  <Input id="dateNeeded" type="date" {...register("dateNeeded")} className="mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="description">Short description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Tell us more about what you're looking for…"
                    {...register("description")}
                    className="mt-1.5"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" {...register("name")} className="mt-1.5" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp number</Label>
                    <Input id="whatsapp" {...register("whatsapp")} className="mt-1.5" />
                    {errors.whatsapp && (
                      <p className="mt-1 text-xs text-destructive">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1.5" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <label className="flex items-start gap-2.5">
                  <Checkbox
                    checked={watch("consent") === true}
                    onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-muted-foreground">
                    I agree to be contacted by matched fashion professionals and STYLEATLAS regarding my request.
                  </span>
                </label>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit a Fashion Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
