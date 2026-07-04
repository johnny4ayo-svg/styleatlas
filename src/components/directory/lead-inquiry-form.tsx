"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import { submitLead } from "@/lib/actions/leads";
import { CheckCircle2 } from "lucide-react";

export function LeadInquiryForm({
  professionalAccountId,
  categoryId,
  city,
  state,
  sourcePage,
}: {
  professionalAccountId: string;
  categoryId?: string;
  city?: string;
  state?: string;
  sourcePage: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadFormSchema) });

  const onSubmit = async (values: LeadFormValues) => {
    const result = await submitLead({
      ...values,
      professionalAccountId,
      categoryId,
      city,
      state,
      sourceType: "profile_inquiry",
      sourcePage,
    });

    if (result.error === "rate_limited") {
      toast.error("You've sent a few inquiries recently. Please try again shortly.");
      return;
    }
    if (result.error) {
      toast.error("Something went wrong sending your inquiry. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="font-serif text-lg font-semibold text-charcoal-900">Inquiry sent!</p>
          <p className="text-sm text-muted-foreground">
            The professional typically responds within a few hours. You can also reach them directly on WhatsApp.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send an Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} className="mt-1.5" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="budget">Budget (optional)</Label>
            <Input id="budget" placeholder="e.g. ₦50,000 – ₦150,000" {...register("budget")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">What do you need?</Label>
            <Textarea id="message" rows={4} {...register("message")} className="mt-1.5" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <label className="flex items-start gap-2.5">
            <Checkbox
              checked={watch("consent") === true}
              onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
              className="mt-0.5"
            />
            <span className="text-xs text-muted-foreground">
              I agree to be contacted by this professional and STYLEATLAS regarding my inquiry.
            </span>
          </label>
          {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send Inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
