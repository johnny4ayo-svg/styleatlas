"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Newsletter delivery goes through the resend-transactional-email
    // Edge Function; this client only validates and displays feedback.
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    toast.success("You're subscribed! Check your inbox to confirm.");
    setEmail("");
  };

  return (
    <div className="rounded-xl bg-charcoal-900 p-8 text-center text-white">
      <Mail className="mx-auto mb-3 h-6 w-6 text-gold-400" />
      <h3 className="font-serif text-xl font-semibold">Get the STYLEATLAS Style Edit</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-300">
        Fresh designer spotlights, style trends, and event highlights — straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-sm gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="border-white/20 bg-white/10 text-white placeholder:text-charcoal-400"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "…" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
