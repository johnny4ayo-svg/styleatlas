import {
  LayoutDashboard,
  Building2,
  Image as ImageIcon,
  Star,
  CreditCard,
  Settings,
  Heart,
  ShoppingBag,
} from "lucide-react";
import type { DashboardNavSection } from "./dashboard-shell";

export const PROFESSIONAL_NAV: DashboardNavSection[] = [
  { items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "Business",
    items: [
      { label: "Business Profile", href: "/dashboard/profile", icon: Building2 },
      { label: "Portfolio", href: "/dashboard/portfolio", icon: ImageIcon },
      { label: "Leads", href: "/dashboard/leads", icon: ShoppingBag },
      { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Subscription & Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export const CUSTOMER_NAV: DashboardNavSection[] = [
  { items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "My Activity",
    items: [
      { label: "Saved Items", href: "/dashboard/saved", icon: Heart },
      { label: "Fashion Requests", href: "/dashboard/requests", icon: ShoppingBag },
      { label: "My Reviews", href: "/dashboard/reviews", icon: Star },
    ],
  },
  { label: "Account", items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }] },
];
