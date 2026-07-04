"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logEngagementEvent } from "@/lib/actions/analytics";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  phone,
  message,
  professionalAccountId,
  sourcePage,
  className,
  size = "default",
  fullWidth,
}: {
  phone: string;
  message?: string;
  professionalAccountId: string;
  sourcePage: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}) {
  const handleClick = () => {
    void logEngagementEvent({
      professionalAccountId,
      eventType: "whatsapp_click",
      sourcePage,
    });
    const digits = phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="emerald"
      size={size}
      onClick={handleClick}
      className={cn(fullWidth && "w-full", className)}
    >
      <MessageCircle className="h-4 w-4" />
      Chat on WhatsApp
    </Button>
  );
}
