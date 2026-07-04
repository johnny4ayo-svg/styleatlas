"use client";

import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { completeCustomerOnboarding } from "@/lib/actions/onboarding";
import { NIGERIAN_STATES } from "@/lib/constants";

interface FormValues {
  phone: string;
  city: string;
  state: string;
}

export function CustomerOnboardingForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const result = await completeCustomerOnboarding(values);
    if (result?.error) toast.error("Please check the form and try again.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" {...register("phone")} className="mt-1.5" />
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
      {errors.city && <p className="text-xs text-destructive">City and state are required</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Continue to Dashboard"}
      </Button>
    </form>
  );
}
