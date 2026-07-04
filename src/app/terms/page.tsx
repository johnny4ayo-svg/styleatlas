import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "STYLEATLAS terms of service governing use of the platform by customers and professionals.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="section-container py-16">
      <div className="prose-editorial mx-auto max-w-3xl">
        <h1>Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using STYLEATLAS, you agree to be bound by these Terms of Service. If you do not agree,
          please do not use the platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          STYLEATLAS is a directory and marketplace connecting customers with fashion designers, brands, stylists,
          schools, and related professionals across Nigeria. STYLEATLAS is not a party to any transaction between
          customers and professionals and does not guarantee the quality, safety, or legality of services offered.
        </p>

        <h2>3. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activity
          under your account. You must provide accurate information during registration and onboarding.
        </p>

        <h2>4. Professional Listings</h2>
        <p>
          Professionals are responsible for the accuracy of their business information, pricing, and portfolio
          content. STYLEATLAS reserves the right to moderate, suspend, or remove listings that violate these terms
          or our content guidelines.
        </p>

        <h2>5. Reviews</h2>
        <p>
          Reviews must reflect genuine experiences with a professional. Fake, incentivized, or abusive reviews are
          prohibited and subject to removal. See our{" "}
          <a href="/review-guidelines">Review Guidelines</a> for details.
        </p>

        <h2>6. Subscriptions and Payments</h2>
        <p>
          Paid subscription plans are billed monthly or yearly as selected at checkout. Prices are determined by
          STYLEATLAS and displayed on the Pricing page; all payments are processed by our third-party payment
          providers (Paystack and Flutterwave). Subscriptions renew automatically unless canceled prior to the
          renewal date.
        </p>

        <h2>7. Prohibited Conduct</h2>
        <p>
          You may not use STYLEATLAS to post fraudulent listings, harass other users, scrape data, or attempt to
          circumvent platform security or verification systems.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          STYLEATLAS is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by
          law, STYLEATLAS shall not be liable for indirect, incidental, or consequential damages arising from your
          use of the platform.
        </p>

        <h2>9. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of STYLEATLAS after changes take effect
          constitutes acceptance of the revised terms.
        </p>

        <h2>10. Contact</h2>
        <p>Questions about these terms can be sent to hello@styleatlas.ng.</p>
      </div>
    </div>
  );
}
