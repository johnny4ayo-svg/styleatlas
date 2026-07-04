"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addPortfolioItem, deletePortfolioItem } from "@/lib/actions/portfolio";
import { EmptyState } from "@/components/shared/empty-state";
import type { PortfolioItem } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  imageUrl: z.string().trim().url(),
  altText: z.string().trim().min(3).max(160),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export function PortfolioManager({ accountId, items }: { accountId: string; items: PortfolioItem[] }) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const result = await addPortfolioItem(accountId, values);
    if (result.error === "plan_limit_reached") {
      toast.error("You've reached your plan's portfolio limit. Upgrade to add more.");
      return;
    }
    if (result.error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Portfolio item added.");
    reset();
  };

  const handleDelete = async (id: string) => {
    setPendingDelete(id);
    const result = await deletePortfolioItem(id);
    if (result.error) toast.error("Couldn't delete this item.");
    setPendingDelete(null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle className="text-base">Add Portfolio Item</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} className="mt-1.5" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} className="mt-1.5" />
              {errors.imageUrl && <p className="mt-1 text-xs text-destructive">{errors.imageUrl.message}</p>}
            </div>
            <div>
              <Label htmlFor="altText">Alt text</Label>
              <Input id="altText" {...register("altText")} className="mt-1.5" />
              {errors.altText && <p className="mt-1 text-xs text-destructive">{errors.altText.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" rows={1} {...register("description")} className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                <Plus className="h-4 w-4" /> {isSubmitting ? "Adding…" : "Add to Portfolio"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No portfolio items yet" description="Add your best work above to start building trust with customers." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-charcoal-100">
              <div className="relative aspect-square bg-charcoal-100">
                <Image src={item.image_url} alt={item.alt_text} fill sizes="25vw" className="object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-charcoal-700">{item.title}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={pendingDelete === item.id}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 transition group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
