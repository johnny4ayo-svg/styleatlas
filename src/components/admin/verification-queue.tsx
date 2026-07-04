"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { moderateVerification } from "@/lib/actions/admin-moderation";
import { formatDate } from "@/lib/utils";

export interface PendingVerification {
  id: string;
  requested_level: string;
  created_at: string;
  professional_account: { business_name: string; slug: string } | null;
}

export function VerificationQueue({ requests }: { requests: PendingVerification[] }) {
  const [isPending, startTransition] = useTransition();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  if (requests.length === 0) {
    return <EmptyState title="No pending verification requests" description="All submissions have been reviewed." />;
  }

  const handleDecision = (id: string, decision: "approved" | "rejected") => {
    startTransition(async () => {
      const result = await moderateVerification(id, decision, reasons[id]);
      if (result.error) toast.error("Something went wrong.");
      else toast.success(decision === "approved" ? "Verification approved." : "Verification rejected.");
    });
  };

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="rounded-lg border border-charcoal-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal-900">{request.professional_account?.business_name}</p>
              <p className="text-xs text-muted-foreground">Requested {formatDate(request.created_at)}</p>
            </div>
            <Badge variant="gold" className="capitalize">{request.requested_level.replace(/_/g, " ")}</Badge>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              placeholder="Rejection reason (if rejecting)"
              value={reasons[request.id] ?? ""}
              onChange={(e) => setReasons((prev) => ({ ...prev, [request.id]: e.target.value }))}
              className="h-9 text-sm"
            />
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDecision(request.id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" disabled={isPending} onClick={() => handleDecision(request.id, "approved")}>
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
