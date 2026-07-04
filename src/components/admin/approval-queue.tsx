"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { moderateListing } from "@/lib/actions/admin-moderation";

export interface PendingListing {
  id: string;
  business_name: string;
  slug: string;
  city: string;
  state: string;
  category?: { name: string };
  created_at: string;
}

export function ApprovalQueue({ listings }: { listings: PendingListing[] }) {
  const [isPending, startTransition] = useTransition();

  if (listings.length === 0) {
    return <EmptyState title="Nothing pending" description="All submitted listings have been reviewed." />;
  }

  const handleDecision = (id: string, decision: "active" | "rejected") => {
    startTransition(async () => {
      const result = await moderateListing(id, decision);
      if (result.error) toast.error("Something went wrong.");
      else toast.success(decision === "active" ? "Listing approved." : "Listing rejected.");
    });
  };

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div key={listing.id} className="flex items-center justify-between rounded-lg border border-charcoal-100 bg-white p-4">
          <div>
            <Link href={`/designers/${listing.slug}`} target="_blank" className="font-medium text-charcoal-900 hover:text-gold-600">
              {listing.business_name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {listing.category?.name} · {listing.city}, {listing.state}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDecision(listing.id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" disabled={isPending} onClick={() => handleDecision(listing.id, "active")}>
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
