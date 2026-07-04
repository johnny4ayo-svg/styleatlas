import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo";
import {
  Crown,
  Images,
  MessageCircle,
  Star,
  BadgeCheck,
  MapPinned,
  Megaphone,
  BookOpen,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Create an Account | STYLEATLAS",
  description: "Join STYLEATLAS as a customer or list your fashion business as a professional.",
  path: "/register",
  noindex: true,
});

const PROFESSIONAL_BENEFITS = [
  { icon: Crown, label: "Premium business profile" },
  { icon: Images, label: "Portfolio gallery" },
  { icon: MessageCircle, label: "WhatsApp and contact buttons" },
  { icon: Star, label: "Customer reviews" },
  { icon: BadgeCheck, label: "Verification badge" },
  { icon: MapPinned, label: "Location-based discovery" },
  { icon: Megaphone, label: "Featured listing options" },
  { icon: BookOpen, label: "Blog and inspiration exposure" },
];

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const isProfessional = searchParams.type === "professional";

  if (isProfessional) {
    return (
      <div className="section-container grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="order-2 rounded-2xl bg-charcoal-900 p-8 text-white sm:p-10 lg:order-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            For Fashion Professionals
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Get Discovered by Customers Already Searching for Fashion Services
          </h1>
          <p className="mt-4 max-w-md text-charcoal-300">
            Create a professional STYLEATLAS profile, showcase your work, collect reviews, receive enquiries, and
            build trust with customers across Nigeria.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROFESSIONAL_BENEFITS.map((benefit) => (
              <li key={benefit.label} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3.5 py-3 text-sm">
                <benefit.icon className="h-4 w-4 shrink-0 text-gold-500" />
                {benefit.label}
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className="mt-8 inline-block text-sm font-medium text-gold-500 underline-offset-4 hover:underline"
          >
            View Pricing Plans →
          </Link>
        </div>

        <div className="order-1 rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated lg:order-2">
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900">List Your Business Free</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            It only takes a few minutes to create your professional profile.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gold-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Join Nigeria&apos;s premium fashion discovery platform.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
