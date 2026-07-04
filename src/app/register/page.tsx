import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create an Account | STYLEATLAS",
  description: "Join STYLEATLAS as a customer or list your fashion business as a professional.",
  path: "/register",
  noindex: true,
});

export default function RegisterPage() {
  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Join Nigeria&apos;s trusted fashion directory.</p>
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
