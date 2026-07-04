import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Log In | STYLEATLAS",
  description: "Log in to your STYLEATLAS account.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return (
    <div className="section-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-100 bg-white p-8 shadow-elevated">
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Log in to manage your STYLEATLAS account.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-gold-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
