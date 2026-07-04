"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { customerRequestSchema, type CustomerRequestValues } from "@/lib/validations/customer-request";
import { submitCustomerRequest } from "@/lib/actions/customer-requests";
import { NIGERIAN_STATES } from "@/lib/constants";
import type { Category } from "@/types";

export function FashionRequestForm({ categories }: { categories: Category[] }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerRequestValues>({ resolver: zodResolver(customerRequestSchema) });

  const onSubmit = async (values: CustomerRequestValues) => {
    const result = await submitCustomerRequest(values);
    if (result.error === "auth_required") {
      toast.error("Please sign in to submit a fashion request.");
      return;
    }
    if (result.error === "rate_limited") {
      toast.error("You've submitted several requests recently. Please try again later.");
      return;
    }
    if (result.error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="font-serif text-xl font-semibold text-charcoal-900">Request submitted!</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            We&apos;re matching you with relevant professionals now. You&apos;ll get responses in your dashboard and by email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="title">What do you need?</Label>
        <Input id="title" placeholder="e.g. Wedding gown designer in Lagos" {...register("title")} className="mt-1.5" />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="mt-1 text-xs text-destructive">{errors.categoryId.message}</p>}
        </div>
        <div>
          <Label>State</Label>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="styleNeeded">Style / occasion</Label>
          <Input id="styleNeeded" placeholder="e.g. Aso Ebi, Bridal gown" {...register("styleNeeded")} className="mt-1.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="budgetMin">Budget min (₦)</Label>
          <Input id="budgetMin" type="number" {...register("budgetMin")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="budgetMax">Budget max (₦)</Label>
          <Input id="budgetMax" type="number" {...register("budgetMax")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="numberOfOutfits">Number of outfits</Label>
          <Input id="numberOfOutfits" type="number" {...register("numberOfOutfits")} className="mt-1.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...register("deadline")} className="mt-1.5" />
        </div>
        <div>
          <Label>Preferred contact method</Label>
          <Controller
            control={control}
            name="preferredContactMethod"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="details">Tell us more</Label>
        <Textarea id="details" rows={5} {...register("details")} className="mt-1.5" />
        {errors.details && <p className="mt-1 text-xs text-destructive">{errors.details.message}</p>}
      </div>

      <label className="flex items-start gap-2.5">
        <Checkbox
          checked={watch("consentGiven") === true}
          onCheckedChange={(checked) => setValue("consentGiven", checked === true, { shouldValidate: true })}
          className="mt-0.5"
        />
        <span className="text-xs text-muted-foreground">
          I agree that matched professionals may contact me about this request.
        </span>
      </label>
      {errors.consentGiven && <p className="text-xs text-destructive">{errors.consentGiven.message}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Fashion Request"}
      </Button>
    </form>
  );
}
