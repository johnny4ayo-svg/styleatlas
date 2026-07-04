import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How STYLEATLAS collects, uses, and protects your personal data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="section-container py-16">
      <div className="prose-editorial mx-auto max-w-3xl">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly (name, email, phone, business details, portfolio images,
          reviews), information generated through your use of the platform (leads, WhatsApp clicks, search
          activity), and technical information (device, browser, IP address) for security and analytics purposes.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and improve the STYLEATLAS directory and marketplace</li>
          <li>To match customers with relevant fashion professionals</li>
          <li>To process payments and manage subscriptions</li>
          <li>To send transactional emails (leads, verification, billing, reviews)</li>
          <li>To detect fraud, abuse, and maintain platform security</li>
        </ul>

        <h2>3. Verification Documents</h2>
        <p>
          Documents submitted for professional verification (government ID, business registration, address proof)
          are stored in a private, access-controlled storage bucket and are only visible to the submitting
          professional and authorized STYLEATLAS administrators.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell your personal data. We share data with payment processors (Paystack, Flutterwave), email
          delivery providers (Resend), and AI infrastructure providers (OpenAI, used only for the AI chat feature)
          strictly to provide the service.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management, and may use analytics cookies to
          understand platform usage.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may access, update, or request deletion of your personal data at any time from your account settings,
          or by contacting hello@styleatlas.ng.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain account and transaction data for as long as your account is active and as required for legal,
          tax, and fraud-prevention purposes thereafter.
        </p>

        <h2>8. Contact</h2>
        <p>For privacy inquiries, contact hello@styleatlas.ng.</p>
      </div>
    </div>
  );
}
