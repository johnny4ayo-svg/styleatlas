import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reset Your Password | STYLEATLAS",
  description: "Reset your STYLEATLAS account password.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Reset your password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">We&apos;ll email you a secure reset link.</p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-gold-600 hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
