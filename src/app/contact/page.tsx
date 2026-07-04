import { Mail, MapPin, Phone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Contact STYLEATLAS",
  description: "Get in touch with the STYLEATLAS team for support, partnerships, or press inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="section-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Get in Touch</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Questions about your listing, a partnership idea, or press inquiry? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <Mail className="h-5 w-5 text-gold-500" />
                <span className="text-sm text-charcoal-700">hello@styleatlas.ng</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <Phone className="h-5 w-5 text-gold-500" />
                <span className="text-sm text-charcoal-700">+234 800 000 0000</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <MapPin className="h-5 w-5 text-gold-500" />
                <span className="text-sm text-charcoal-700">Lagos, Nigeria</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
