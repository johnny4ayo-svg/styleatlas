"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { professionalProfileSchema, type ProfessionalProfileValues } from "@/lib/validations/professional-profile";
import { updateProfessionalProfile } from "@/lib/actions/professional-profile";
import { NIGERIAN_STATES, PRICE_RANGES } from "@/lib/constants";

export function ProfessionalProfileForm({ accountId, defaultValues }: { accountId: string; defaultValues: ProfessionalProfileValues }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalProfileValues>({ resolver: zodResolver(professionalProfileSchema), defaultValues });

  const onSubmit = async (values: ProfessionalProfileValues) => {
    const result = await updateProfessionalProfile(accountId, values);
    if (result.error) {
      toast.error("Please check the form for errors.");
      return;
    }
    toast.success("Profile updated.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Business Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" {...register("businessName")} className="mt-1.5" />
            {errors.businessName && <p className="mt-1 text-xs text-destructive">{errors.businessName.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">About your business</Label>
            <Textarea id="description" rows={4} {...register("description")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="brandStory">Brand story (Premium+ feature)</Label>
            <Textarea id="brandStory" rows={3} {...register("brandStory")} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} className="mt-1.5" />
            </div>
            <div>
              <Label>State</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Price range</Label>
              <Controller
                control={control}
                name="priceRange"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Availability</Label>
              <Controller
                control={control}
                name="availabilityStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Contact & Social</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" {...register("phone")} className="mt-1.5" /></div>
          <div><Label htmlFor="whatsapp">WhatsApp</Label><Input id="whatsapp" {...register("whatsapp")} className="mt-1.5" /></div>
          <div><Label htmlFor="email">Business email</Label><Input id="email" {...register("email")} className="mt-1.5" /></div>
          <div><Label htmlFor="website">Website</Label><Input id="website" {...register("website")} className="mt-1.5" /></div>
          <div><Label htmlFor="instagram">Instagram URL</Label><Input id="instagram" {...register("instagram")} className="mt-1.5" /></div>
          <div><Label htmlFor="facebook">Facebook URL</Label><Input id="facebook" {...register("facebook")} className="mt-1.5" /></div>
          <div><Label htmlFor="tiktok">TikTok URL</Label><Input id="tiktok" {...register("tiktok")} className="mt-1.5" /></div>
          <div><Label htmlFor="youtube">YouTube URL</Label><Input id="youtube" {...register("youtube")} className="mt-1.5" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Branding Images</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label htmlFor="logoUrl">Logo URL</Label><Input id="logoUrl" {...register("logoUrl")} className="mt-1.5" /></div>
          <div><Label htmlFor="coverImageUrl">Cover image URL</Label><Input id="coverImageUrl" {...register("coverImageUrl")} className="mt-1.5" /></div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
