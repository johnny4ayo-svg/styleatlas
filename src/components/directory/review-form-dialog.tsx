"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations/review";
import { submitReview } from "@/lib/actions/reviews";
import { cn } from "@/lib/utils";

export function ReviewFormDialog({ professionalAccountId, professionalSlug }: { professionalAccountId: string; professionalSlug: string }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({ resolver: zodResolver(reviewFormSchema), defaultValues: { rating: 5 } });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewFormValues) => {
    const result = await submitReview(professionalAccountId, professionalSlug, values);
    if (result.error === "auth_required") {
      toast.error("Please sign in to leave a review.");
      return;
    }
    if (result.error === "duplicate_review") {
      toast.error("You've already reviewed this service.");
      return;
    }
    if (result.error === "rate_limited") {
      toast.error("You've submitted several reviews recently. Please try again later.");
      return;
    }
    if (result.error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Thanks! Your review is pending moderation.");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Overall rating</Label>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setValue("rating", star, { shouldValidate: true })}>
                  <Star className={cn("h-7 w-7", star <= rating ? "fill-gold-400 text-gold-400" : "text-charcoal-200")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="serviceUsed">Service used</Label>
            <Input id="serviceUsed" placeholder="e.g. Bridal gown, Aso Ebi styling" {...register("serviceUsed")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="title">Review title (optional)</Label>
            <Input id="title" {...register("title")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="body">Your review</Label>
            <Textarea id="body" rows={4} {...register("body")} className="mt-1.5" />
            {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
