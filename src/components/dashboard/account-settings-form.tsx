"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountSettingsSchema, type AccountSettingsValues } from "@/lib/validations/account-settings";
import { updateAccountSettings } from "@/lib/actions/account-settings";

export function AccountSettingsForm({ defaultValues }: { defaultValues: AccountSettingsValues }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AccountSettingsValues>({ resolver: zodResolver(accountSettingsSchema), defaultValues });

  const onSubmit = async (values: AccountSettingsValues) => {
    const result = await updateAccountSettings(values);
    if (result.error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Settings saved.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" {...register("fullName")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">Email notifications</span>
            <Controller control={control} name="emailNotifications" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-charcoal-700">SMS notifications</span>
            <Controller control={control} name="smsNotifications" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
          </label>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
