"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-white border border-charcoal-100 shadow-elevated text-charcoal-800",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton: "bg-gold-400 text-charcoal-900",
          success: "border-l-4 border-l-emerald-500",
          error: "border-l-4 border-l-red-500",
        },
      }}
    />
  );
}
