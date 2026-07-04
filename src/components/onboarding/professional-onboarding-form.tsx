"use client";

import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { completeProfessionalOnboarding } from "@/lib/actions/onboarding";
import { NIGERIAN_STATES } from "@/lib/constants";
import type { Category } from "@/types";

interface FormValues {
  businessName: string;
  categoryId: string;
  city: string;
  state: string;
  whatsapp: string;
}

export function ProfessionalOnboardingForm({ categories }: { categories: Category[] }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const result = await completeProfessionalOnboarding(values);
    if (result?.error) {
      toast.error("Please check the form and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" {...register("businessName", { required: true, minLength: 2 })} className="mt-1.5" />
        {errors.businessName && <p className="mt-1 text-xs text-destructive">Business name is required</p>}
      </div>
      <div>
        <Label>Category</Label>
        <Controller
          control={control}
          name="categoryId"
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select your category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && <p className="mt-1 text-xs text-destructive">Please select a category</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city", { required: true })} className="mt-1.5" />
        </div>
        <div>
          <Label>State</Label>
          <Controller
            control={control}
            name="state"
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp number</Label>
        <Input id="whatsapp" placeholder="+2348012345678" {...register("whatsapp", { required: true, minLength: 7 })} className="mt-1.5" />
        {errors.whatsapp && <p className="mt-1 text-xs text-destructive">WhatsApp number is required</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create My Business Profile"}
      </Button>
    </form>
  );
}
