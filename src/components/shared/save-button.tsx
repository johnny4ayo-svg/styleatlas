"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";
import { toast } from "sonner";

export function SaveButton({
  entityType,
  entityId,
  initialSaved = false,
  variant = "icon",
}: {
  entityType: "professional_account" | "outfit_inspiration" | "job" | "event" | "blog_post";
  entityId: string;
  initialSaved?: boolean;
  variant?: "icon" | "full";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setSaved((prev) => !prev);
    startTransition(async () => {
      const result = await toggleFavorite(entityType, entityId);
      if (result.error === "auth_required") {
        setSaved((prev) => !prev);
        toast.error("Please sign in to save items.");
        return;
      }
      if (result.error) {
        setSaved((prev) => !prev);
        toast.error("Something went wrong. Try again.");
      }
    });
  };

  if (variant === "full") {
    return (
      <Button variant="outline" onClick={handleClick} disabled={isPending}>
        <Heart className={cn("h-4 w-4", saved && "fill-burgundy-500 text-burgundy-500")} />
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from saved" : "Save"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
    >
      <Heart className={cn("h-4 w-4 text-charcoal-700", saved && "fill-burgundy-500 text-burgundy-500")} />
    </button>
  );
}
