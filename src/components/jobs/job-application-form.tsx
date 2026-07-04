"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobApplicationSchema, type JobApplicationValues } from "@/lib/validations/job-application";
import { submitJobApplication } from "@/lib/actions/job-applications";
import { CheckCircle2 } from "lucide-react";

export function JobApplicationForm({ jobId }: { jobId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationValues>({ resolver: zodResolver(jobApplicationSchema) });

  const onSubmit = async (values: JobApplicationValues) => {
    const result = await submitJobApplication(jobId, values);
    if (result.error === "rate_limited") {
      toast.error("You've submitted several applications recently. Please try again later.");
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
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="font-serif text-lg font-semibold text-charcoal-900">Application sent!</p>
          <p className="text-sm text-muted-foreground">The employer will reach out if you&apos;re shortlisted.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for this Role</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} className="mt-1.5" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1.5" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" {...register("phone")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="coverNote">Why are you a good fit?</Label>
            <Textarea id="coverNote" rows={4} {...register("coverNote")} className="mt-1.5" />
            {errors.coverNote && <p className="mt-1 text-xs text-destructive">{errors.coverNote.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
