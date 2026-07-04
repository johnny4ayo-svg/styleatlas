"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { updateLeadStatus } from "@/lib/actions/lead-status";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";

const STATUS_OPTIONS: LeadStatus[] = ["new", "viewed", "contacted", "responded", "won", "lost", "spam", "archived"];

const STATUS_VARIANT: Record<LeadStatus, "default" | "success" | "warning" | "outline" | "destructive"> = {
  new: "warning",
  viewed: "outline",
  contacted: "outline",
  responded: "outline",
  won: "success",
  lost: "destructive",
  spam: "destructive",
  archived: "outline",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();

  if (leads.length === 0) {
    return <EmptyState title="No leads yet" description="Leads from inquiries, WhatsApp clicks, and matched requests will appear here." />;
  }

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status);
      if (result.error) toast.error("Couldn't update lead status.");
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-left text-xs uppercase tracking-wide text-charcoal-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top hover:bg-charcoal-50/50">
              <td className="px-4 py-3 font-medium text-charcoal-900">{lead.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div>{lead.email}</div>
                {lead.whatsapp && <div>{lead.whatsapp}</div>}
              </td>
              <td className="max-w-xs px-4 py-3 text-muted-foreground">
                <p className="line-clamp-2">{lead.message}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="capitalize">{lead.source_type.replace(/_/g, " ")}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3">
                <Select defaultValue={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v as LeadStatus)} disabled={isPending}>
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue>
                      <Badge variant={STATUS_VARIANT[lead.status]} className="capitalize">{lead.status}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
