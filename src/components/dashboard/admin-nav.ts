import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  MessageSquareWarning,
  FolderTree,
  Newspaper,
  CreditCard,
  Receipt,
  Webhook,
  Star,
  ScrollText,
} from "lucide-react";
import type { DashboardNavSection } from "./dashboard-shell";

// Only pages that actually exist are linked here — see README.md
// "Follow-up work" for the remaining admin screens described in the spec
// (jobs/events/schools moderation, SEO page manager, redirects, featured/
// ad placements, email template editor, AI chat settings, support
// tickets, analytics dashboards, security logs, platform settings).
export const ADMIN_NAV: DashboardNavSection[] = [
  { items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  {
    label: "Platform",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Professionals", href: "/admin/professionals", icon: Building2 },
      { label: "Listing Approvals", href: "/admin/approvals", icon: ShieldCheck },
      { label: "Verification Queue", href: "/admin/verification", icon: ShieldCheck },
      { label: "Review Moderation", href: "/admin/reviews", icon: MessageSquareWarning },
      { label: "Leads", href: "/admin/leads", icon: Star },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Blog / CMS", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    label: "Billing",
    items: [
      { label: "Subscription Plans", href: "/admin/plans", icon: CreditCard },
      { label: "Transactions", href: "/admin/transactions", icon: Receipt },
      { label: "Webhook Events", href: "/admin/webhooks", icon: Webhook },
    ],
  },
  {
    label: "System",
    items: [{ label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText }],
  },
];
